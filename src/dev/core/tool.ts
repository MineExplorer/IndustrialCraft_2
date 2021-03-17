interface IWrech {
	dropChance: number;
	isUseable(item: ItemInstance, damage: number): boolean;
	useItem(item: ItemInstance, damage: number, player: number): boolean;
}

namespace ICTool {
	let wrenchData = {}

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
		let wrench = getWrenchData(item.id);
		return wrench?.isUseable(item, damage);
	}

	export function useWrench(item: ItemInstance, damage: number, player: number): boolean {
		let wrench = getWrenchData(item.id);
		return wrench?.useItem(item, damage, player);
	}

	export function rotateMachine(tileEntity: TileEntity, side: number, item: ItemInstance, player: number): void {
		if (Entity.getSneaking(player)) {
			side ^= 1;
		}
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
		let energy = 0;
		let armor = Entity.getArmorSlot(player, 1);
		let itemChargeLevel = ChargeItemRegistry.getItemData(item.id).tier;
		let armorChargeData = ChargeItemRegistry.getItemData(armor.id);
		if (armorChargeData && armorChargeData.tier >= itemChargeLevel) {
			energy = ChargeItemRegistry.getEnergyFrom(armor, "Eu", consume, 100, true);
			consume -= energy;
		}
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored >= consume) {
			if (energy > 0) {
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
			if (!ConfigIC.soundEnabled) {return;}
			let item = Player.getCarriedItem();
			let tool = ToolAPI.getToolData(item.id) as any;
			if (item.id == itemID && (!tool || !tool.energyPerUse || ChargeItemRegistry.getEnergyStored(item) >= tool.energyPerUse)) {
				SoundManager.startPlaySound(SourceType.ENTITY, Player.get(), idleSound);
			}
			else if (SoundManager.stopPlaySound(Player.get(), idleSound) && stopSound) {
				SoundManager.playSound(stopSound);
			}
		});
	}
}

Callback.addCallback("DestroyBlockStart", function(coords: Callback.ItemUseCoordinates, block: Tile) {
	if (MachineRegistry.isMachine(block.id)) {
		let item = Player.getCarriedItem();
		if (ICTool.isUseableWrench(item, 10)) {
			//Block.setTempDestroyTime(block.id, 0);
			World.destroyBlock(coords.x, coords.y, coords.z, true);
		}
	}
});


Network.addServerPacket("icpe.demontageMachine", function (client: NetworkClient, data: Vector) {
	const player = client.getPlayerUid();
	const region = WorldRegion.getForActor(player);
	const blockID = region.getBlockId(data);
	if (MachineRegistry.isMachine(blockID)) {
		const item = Entity.getCarriedItem(player);
		if (ICTool.isUseableWrench(item, 10)) {
			//Block.setTempDestroyTime(block.id, 0);
			const tileEntity = region.getTileEntity(data.x, data.y, data.z) as Machine.MachineBase;
			if (tileEntity) {
				let drop = tileEntity.getDropItem(player);
				region.dropItem(data.x + .5, data.y + .5, data.z + .5, drop);
			}
			region.destroyBlock(data.x, data.y, data.z, true);
		}
	}
});