interface IWrech {
	isUseable(item: ItemInstance, damage: number): boolean;
	useItem(item: ItemStack, damage: number, player: number): void;
}

namespace ICTool {
	const wrenchData = {}

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
			SoundManager.playSoundAtBlock(tileEntity, "Wrench.ogg", 1);
		}
	}

	export function addRecipe(result: ItemInstance, data: {id: number, data: number}[], tool: number): void {
		data.push({id: tool, data: -1});
		Recipes.addShapeless(result, data, function(api, field, result) {
			for (let i = 0; i < field.length; i++) {
				if (field[i].id == tool) {
					field[i].data++;
					if (field[i].data >= Item.getMaxDamage(tool)) {
						field[i].id = field[i].count = field[i].data = 0;
					}
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

	/** @deprecated */
	export function registerElectricHoe(stringID: string) {}

	/** @deprecated */
	export function registerElectricTreetap(stringID: string) {}

	export function setOnHandSound(itemID: number, idleSound: string, stopSound?: string) {
		Callback.addCallback("LocalTick", function() {
			if (!IC2Config.soundEnabled) {return;}
			const item = Player.getCarriedItem();
			const tool = ToolAPI.getToolData(item.id) as any;
			if (item.id == itemID && (!tool || !tool.energyPerUse || ChargeItemRegistry.getEnergyStored(item) >= tool.energyPerUse)) {
				SoundManager.startPlaySound(SourceType.ENTITY, Player.get(), idleSound);
			}
			else if (SoundManager.stopPlaySound(Player.get(), idleSound) && stopSound) {
				SoundManager.playSound(stopSound);
			}
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
		const player = client.getPlayerUid();
		const region = WorldRegion.getForActor(player);
		const blockID = region.getBlockId(data);
		if (MachineRegistry.isMachine(blockID)) {
			const item = new ItemStack(Entity.getCarriedItem(player));
			if (ICTool.isUseableWrench(item, 10)) {
				const tileEntity = (region.getTileEntity(data) || region.addTileEntity(data)) as Machine.IWrenchable;
				if (!tileEntity) return;

				const drop = tileEntity.adjustDrop(new ItemStack(tileEntity.blockID, 1, 0));
				TileEntity.destroyTileEntity(tileEntity);
				region.setBlock(data, 0, 0);
				region.dropAtBlock(data.x, data.y, data.z, drop);
				ICTool.useWrench(item, 10, player);
				SoundManager.playSoundAtBlock(tileEntity, "Wrench.ogg", 1);
			}
		}
	});
}