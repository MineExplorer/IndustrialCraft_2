/// <reference path="./ArmorIC2.ts" />

abstract class ArmorElectric extends ArmorIC2
implements IElectricItem, OnHurtListener, OnTickListener {
	energy: string = "Eu";
	maxCharge: number;
	transferLimit: number;
	tier: number;
	canProvideEnergy: boolean = false;

	constructor(stringID: string, name: string, params: ArmorParams, maxCharge: number, transferLimit: number, tier: number, inCreative?: boolean) {
		super(stringID, name, params, false);
		this.preventDamaging();
		this.maxCharge = maxCharge;
		this.transferLimit = transferLimit;
		this.tier = tier;
		ChargeItemRegistry.registerItem(this.id, this, inCreative);
	}

	onNameOverride(item: ItemInstance, name: string): string {
		return name + '\n' + ItemName.getItemStorageText(item);
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		return item;
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		return null;
	}
}