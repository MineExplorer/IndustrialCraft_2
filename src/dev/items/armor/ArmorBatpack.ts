/// <reference path="./ArmorElectric.ts" />

class ArmorBatpack extends ArmorElectric {
	constructor(stringID: string, name: string, maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, {type: "chestplate", defence: 3, texture: name}, maxCharge, transferLimit, tier);
		this.canProvideEnergy = true;
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		if (World.getThreadTime() % 20 == 0) {
			let carried = Entity.getCarriedItem(playerUid);
			if (ChargeItemRegistry.isValidItem(carried.id, "Eu", this.tier)) {
				let energyStored = ChargeItemRegistry.getEnergyStored(item);
				let energyAdd = ChargeItemRegistry.addEnergyTo(carried, "Eu", Math.min(energyStored, this.transferLimit*20), this.tier);
				if (energyAdd > 0) {
					ChargeItemRegistry.setEnergyStored(item, energyStored - energyAdd);
					Entity.setCarriedItem(playerUid, carried.id, 1, carried.data, carried.extra);
					return item;
				}
			}
		}
		return null;
	}
}