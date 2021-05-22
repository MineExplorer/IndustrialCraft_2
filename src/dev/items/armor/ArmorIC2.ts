class ArmorIC2
extends ItemArmor {
	constructor(stringID: string, name: string, params: ArmorParams, inCreative?: boolean) {
		super(stringID, name, name, params, inCreative);
	}

	setArmorTexture(name: string): void {
		let index = (this.armorType == "leggings")? 2 : 1;
		this.texture = `armor/${name}_${index}.png`;
	}
}