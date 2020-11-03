/// <reference path="./ItemArmorElectric.ts" />

class ItemArmorBatpack
extends ItemArmorElectric {
	constructor(nameID: string, name: string, maxCharge: number, transferLimit: number, tier: number) {
		super(nameID, name, {type: "chestplate", defence: 3, texture: name}, maxCharge, transferLimit, tier);
	}

	getIcon(armorName: string): string {
		return armorName;
	}

	canProvideEnergy(): boolean {
		return true;
	}

	onTick(item: ItemInstance, index: number, player: number): boolean {
		if (World.getThreadTime() % 20 == 0) {
			var carried = Entity.getCarriedItem(player);
			if (ChargeItemRegistry.isValidItem(carried.id, "Eu", this.tier, "tool")) {
				var energyStored = ChargeItemRegistry.getEnergyStored(item);
				var energyAdd = ChargeItemRegistry.addEnergyTo(carried, "Eu", energyStored, this.transferLimit*20, this.tier);
				if (energyAdd > 0) {
					ChargeItemRegistry.setEnergyStored(item, energyStored - energyAdd);
					Entity.setCarriedItem(player, carried.id, 1, carried.data, carried.extra);
					Entity.setArmorSlot(player, 1, item.id, 1, item.data, item.extra);
				}
			}
		}
		return false;
	}
}