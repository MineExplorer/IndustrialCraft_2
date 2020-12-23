class ItemArmorIC2
extends ItemArmor {
	constructor(nameID: string, name: string, params: ArmorParams, inCreative?: boolean) {
		super(nameID, name, name, params);
		ItemRegistry.registerItem(this, inCreative);
	}

	setArmorTexture(name: string) {
		var index = (this.armorType == "leggings")? 2 : 1;
		this.texture = 'armor/' + name + '_' + index + '.png';
		return this;
	}
}