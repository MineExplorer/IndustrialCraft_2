/// <reference path="ItemIC2.ts" />

class ItemElectric
extends ItemIC2
implements IElectricItem, ItemFuncs {
	energy: string = "Eu";
	maxCharge: number;
	transferLimit: number;
	tier: number;
	canProvideEnergy: boolean = false;

	constructor(stringID: string, name: string, maxCharge: number, transferLimit: number, tier: number, inCreative: boolean = true) {
		super(stringID, name, name, false);
		this.setMaxStack(1);
		this.setCategory(CreativeCategory.EQUIPMENT);
		this.maxCharge = maxCharge;
		this.transferLimit = transferLimit;
		this.tier = tier;
		ChargeItemRegistry.registerItem(this.id, this, !inCreative);
	}

	onNameOverride(item: ItemInstance, name: string): string {
		return name + '\n' + ItemName.getItemStorageText(item);
	}
}