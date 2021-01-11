class ArmorIC2
extends ItemArmor {
	constructor(stringID: string, name: string, params: ArmorParams, inCreative?: boolean) {
		super(stringID, name, name, params);
		ItemRegistry.registerItem(this, inCreative);
		this.setCategory(3);
	}

	setArmorTexture(name: string) {
		var index = (this.armorType == "leggings")? 2 : 1;
		this.texture = 'armor/' + name + '_' + index + '.png';
		return this;
	}
}