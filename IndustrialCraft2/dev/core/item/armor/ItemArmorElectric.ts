/// <reference path="./ItemArmorIC2.ts" />

abstract class ItemArmorElectric
extends ItemArmorIC2
implements IArmorFuncs {
	maxCharge: number
	transferLimit: number
	tier: number

	constructor(nameID: string, name: string, params: {type: ArmorType, defence: number, texture?: string}, maxCharge: number, transferLimit: number, tier: number, inCreative?: boolean) {
		super(nameID, name, params, false);
		ItemArmor.registerFuncs(nameID, this);
		this.maxCharge = maxCharge;
		this.transferLimit = transferLimit;
		this.tier = tier;
		var chargeType = this.canProvideEnergy() ? "storage" : "armor";
		ChargeItemRegistry.registerExtraItem(this.id, "Eu", maxCharge, transferLimit, tier, chargeType, true, inCreative);
	}

	canProvideEnergy(): boolean {
		return false;
	}

	overrideName(item: ItemInstance, name: string) {
		name = this.getRarityCode(this.rarity) + name + '\n' + ItemName.getItemStorageText(item);
		return name;
	}

	onHurt(params: {attacker: number, damage: number, type: number}, slot: ItemInstance, index: number, maxDamage: number): boolean {
		return false;
	}

	onTick(slot: ItemInstance, index: number, maxDamage: number): boolean {
		return false;
	}
}