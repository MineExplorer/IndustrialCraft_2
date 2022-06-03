/// <reference path="./ArmorElectric.ts" />

class ArmorBatpack extends ArmorElectric {
	constructor(stringID: string, name: string, maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, {type: "chestplate", defence: 3, texture: name}, maxCharge, transferLimit, tier);
		this.canProvideEnergy = true;
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		return ArmorBatpack.chargeCarriedItem(this, item, playerUid);
	}

	static chargeCarriedItem(itemData: IElectricItem, stack: ItemInstance, playerUid: number): ItemInstance {
		const tickDelay = 20;
		if (World.getThreadTime() % tickDelay == 0) {
			const carried = Entity.getCarriedItem(playerUid);
			const carriedData = ChargeItemRegistry.getItemData(carried.id);
			if (carriedData && carriedData.transferLimit > 0 && carriedData.energy == itemData.energy && carriedData.tier <= itemData.tier) {
				const energyStored = ChargeItemRegistry.getEnergyStored(stack);
				const energyAmount = Math.min(energyStored, itemData.transferLimit * tickDelay);
				const energyAdded = ChargeItemRegistry.addEnergyTo(carried, itemData.energy, energyAmount, itemData.tier, true);
				if (energyAdded > 0) {
					ChargeItemRegistry.setEnergyStored(stack, energyStored - energyAdded);
					Entity.setCarriedItem(playerUid, carried.id, 1, carried.data, carried.extra);
					return stack;
				}
			}
		}
		return null;
	}
}