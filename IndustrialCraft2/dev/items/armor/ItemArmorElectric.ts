/// <reference path="./ItemArmorIC2.ts" />

abstract class ItemArmorElectric
extends ItemArmorIC2
implements IElectricItem, OnHurtListener, OnTickListener {
	energy: string = "Eu";
	maxCharge: number;
	transferLimit: number;
	tier: number;
	canProvideEnergy: boolean = false;

	constructor(nameID: string, name: string, params: {type: ArmorType, defence: number, texture?: string}, maxCharge: number, transferLimit: number, tier: number, inCreative?: boolean) {
		super(nameID, name, params, false);
		this.maxCharge = maxCharge;
		this.transferLimit = transferLimit;
		this.tier = tier;
		ChargeItemRegistry.registerItem(this.id, this, !inCreative);
	}

	overrideName(item: ItemInstance, name: string) {
		name = this.getRarityCode(this.rarity) + name + '\n' + ItemName.getItemStorageText(item);
		return name;
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, player: number): ItemInstance {
		return item;
	}

	onTick(item: ItemInstance, index: number, player: number): ItemInstance {
		return null;
	}
}