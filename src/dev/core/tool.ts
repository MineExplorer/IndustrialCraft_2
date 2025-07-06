interface IWrech {
	isUseable(item: ItemInstance, damage: number): boolean;
	useItem(item: ItemStack, damage: number, player: number): void;
}

interface IHandEquippedFuncs {
	/**
	 * Called every tick when item is in hand
	 * @param item item that being equipped
	 */
	onHandEquippedLocal?(item: ItemInstance): void;
	/**
	 * Called when carried item slot changed
	 * @param item item that being uneqipped
	 */
	onHandUnequippedLocal?(item: ItemInstance): void;
}

namespace ICTool {
	const wrenchData: {[key: number]: IWrech} = {};
	const handEquippedFuncs: {[key: number]: IHandEquippedFuncs} = {};
	let lastCarriedItem: ItemInstance = new ItemStack();
	let lastSelectedSlot: number = 0;
	let playerAudioSource: AudioSourceEntityClient;

	export function registerWrench(id: number, properties: IWrech) {
		wrenchData[id] = properties;
	}

	export function getWrenchData(id: number): IWrech {
		return wrenchData[id];
	}

	export function isWrench(id: number): boolean {
		return !!getWrenchData(id);
	}

	export function isUseableWrench(item: ItemInstance, damage: number = 1): boolean {
		const wrench = getWrenchData(item.id);
		return wrench?.isUseable(item, damage);
	}

	export function useWrench(item: ItemStack, damage: number, player: number): void {
		const wrench = getWrenchData(item.id);
		wrench?.useItem(item, damage, player);
	}

	export function rotateMachine(tileEntity: Machine.IWrenchable, side: number, item: ItemStack, player: number): void {
		if (tileEntity.setFacing(side)) {
			useWrench(item, 1, player);
			SoundLib.playSoundAtBlock(tileEntity, tileEntity.dimension, "Wrench.ogg");
		}
	}

	export function addRecipe(result: ItemInstance, data: {id: number, data: number}[], tool: number): void {
		data.push({id: tool, data: -1});
		Recipes.addShapeless(result, data, function(api, field, result) {
			for (let i = 0; i < field.length; i++) {
				const slot = field[i];
				if (slot.id == tool && slot.data + 1 < Item.getMaxDamage(tool)) {
					slot.set(slot.id, 1, slot.data + 1, slot.extra);
				}
				else {
					api.decreaseFieldSlot(i);
				}
			}
		});
	}

	export function dischargeItem(item: ItemInstance, consume: number, player: number): boolean {
		let energyGot = 0;
		const itemTier = ChargeItemRegistry.getItemData(item.id).tier;
		const armor = Entity.getArmorSlot(player, 1);
		const armorEnergy = ChargeItemRegistry.getEnergyStored(armor);
		const armorData = ChargeItemRegistry.getItemData(armor.id);
		if (armorEnergy > 0 && armorData.energy == EU.name && armorData.tier >= itemTier) {
			energyGot = Math.min(armorEnergy, consume);
		}
		const energyStored = ChargeItemRegistry.getEnergyStored(item) + energyGot;
		if (energyStored >= consume) {
			if (energyGot > 0) {
				ChargeItemRegistry.setEnergyStored(armor, armorEnergy - energyGot);
				Entity.setArmorSlot(player, 1, armor.id, 1, armor.data, armor.extra);
			}
			ChargeItemRegistry.setEnergyStored(item, energyStored - consume);
			return true;
		}
		return false;
	}

	export function useElectricItem(item: ItemInstance, consume: number, player: number): boolean {
		if (dischargeItem(item, consume, player)) {
			Entity.setCarriedItem(player, item.id, 1, item.data, item.extra);
			return true;
		}
		return false;
	}

	export function onDemontage(client: NetworkClient, coords: Vector) {
		const player = client.getPlayerUid();
		if (Entity.getDistanceToCoords(player, coords) <= 10) {
			const region = WorldRegion.getForActor(player);
			const blockID = region.getBlockId(coords);
			if (!MachineRegistry.isMachine(blockID)) {
				return;
			}

			const item = new ItemStack(Entity.getCarriedItem(player));
			if (!ICTool.isUseableWrench(item, 10)) {
				return;
			}
			
			const tileEntity = (region.getTileEntity(coords) || region.addTileEntity(coords)) as Machine.IWrenchable;
			if (!tileEntity) {
				return;
			}

			const drop = tileEntity.adjustDrop(new ItemStack(tileEntity.blockID, 1, 0));
			TileEntity.destroyTileEntity(tileEntity);
			region.setBlock(coords, 0, 0);
			region.dropAtBlock(coords.x, coords.y, coords.z, drop);
			ICTool.useWrench(item, 10, player);
			SoundLib.playSoundAtBlock(tileEntity, tileEntity.dimension, "Wrench.ogg");
		}
	}

	export function setOnHandEquipped(itemID: number, funcs: IHandEquippedFuncs) {
		handEquippedFuncs[itemID] = funcs;
	}

	/**
	 * Client-side only
	 * @param soundName sound name 
	 * @param looping true if sound is looped, false otherwise
	 * @param volume value from 0 to 1
	 */
	export function startPlaySound(soundName: string, looping: boolean, volume: number = 1): void {
		if (!IC2Config.soundEnabled) return;

		const stream = playerAudioSource.getStream(soundName);
		if (!stream) {
			playerAudioSource.play(soundName, looping, volume);
		}
		else if (stream.volume != volume) {
			stream.volume = volume;
			stream.updateVolume(1);
		}
	}

	export function stopPlaySound(soundName: string): boolean {
		if (!IC2Config.soundEnabled) return;

		const wasPlaying = playerAudioSource.isPlaying(soundName);
		playerAudioSource.stop(soundName);
		return wasPlaying;
	}

	Callback.addCallback("LocalLevelLoaded", function() {
		if (IC2Config.soundEnabled) {
			playerAudioSource = new AudioSourceEntityClient(Player.get());
			Updatable.addLocalUpdatable(playerAudioSource);
		}
	});

	Callback.addCallback("LocalLevelLeft", function() {
		playerAudioSource?.unload();
		lastCarriedItem = new ItemStack();
		lastSelectedSlot = 0;
	});

	Callback.addCallback("LocalTick", function() {
		const item = Player.getCarriedItem();
		const selectedSlot = Player.getSelectedSlotId();
		if (item.id != lastCarriedItem.id || selectedSlot != lastSelectedSlot) {
			const handEquippedData = handEquippedFuncs[lastCarriedItem.id];
			if (handEquippedData && 'onHandUnequippedLocal' in handEquippedData) {
				handEquippedData.onHandUnequippedLocal(lastCarriedItem);
			}
		}
		const handEquippedData = handEquippedFuncs[item.id];
		if (handEquippedData && 'onHandEquippedLocal' in handEquippedData) {
			handEquippedData.onHandEquippedLocal(item);
		}
		lastCarriedItem = item;
		lastSelectedSlot = selectedSlot;
	});
}

Callback.addCallback("DestroyBlockStart", function(coords: Callback.ItemUseCoordinates, block: Tile) {
	if (MachineRegistry.isMachine(block.id)) {
		const item = Player.getCarriedItem();
		if (ICTool.isUseableWrench(item, 10)) {
			Network.sendToServer(IC2NetworkPackets.demontage, {x: coords.x, y: coords.y, z: coords.z});
		}
	}
});

Network.addServerPacket(IC2NetworkPackets.demontage, function (client: NetworkClient, data: Vector) {
	ICTool.onDemontage(client, data);
});