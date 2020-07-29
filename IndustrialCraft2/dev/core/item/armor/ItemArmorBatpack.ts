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

	onTick(slot: ItemInstance): boolean {
		if (World.getThreadTime() % 20 == 0) {
			var item = Player.getCarriedItem();
			if (ChargeItemRegistry.isValidItem(item.id, "Eu", this.tier, "tool")) {
				var energyStored = ChargeItemRegistry.getEnergyStored(slot);
				var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", energyStored, this.transferLimit*20, this.tier);
				if (energyAdd > 0) {
					ChargeItemRegistry.setEnergyStored(slot, energyStored - energyAdd);
					Player.setCarriedItem(item.id, 1, item.data, item.extra);
					Player.setArmorSlot(1, slot.id, 1, slot.data, slot.extra);
				}
			}
		}
		return false;
	}
}