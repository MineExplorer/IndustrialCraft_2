/// <reference path="./ArmorIC2.ts" />

abstract class ArmorElectric
extends ArmorIC2
implements IElectricItem, OnHurtListener, OnTickListener {
	energy: string = "Eu";
	maxCharge: number;
	transferLimit: number;
	tier: number;
	canProvideEnergy: boolean = false;

	constructor(nameID: string, name: string, params: {type: ArmorType, defence: number, texture?: string}, maxCharge: number, transferLimit: number, tier: number, inCreative: boolean = true) {
		super(nameID, name, params, false);
		this.maxCharge = maxCharge;
		this.transferLimit = transferLimit;
		this.tier = tier;
		ChargeItemRegistry.registerItem(this.id, this, !inCreative);
	}

	onNameOverride(item: ItemInstance, name: string) {
		let color = this.getRarityColor(this.rarity);
		return color + name + '\n' + ItemName.getItemStorageText(item);
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, player: number): ItemInstance {
		return item;
	}

	onTick(item: ItemInstance, index: number, player: number): ItemInstance {
		return null;
	}
}