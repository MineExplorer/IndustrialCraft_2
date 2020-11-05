class ItemArmorIC2
extends ItemArmor {
	constructor(nameID: string, name: string, params: ArmorParams, inCreative?: boolean) {
		super(nameID, name, name, params);
		this.createItem(inCreative);
	}

	setArmorTexture(name: string) {
		var index = (this.armorType == "leggings")? 2 : 1;
		this.texture = 'armor/' + name + '_' + index + '.png';
		return this;
	}
	/*
	static createItem(nameID: string, params: {name?: string, armorName: string, type: ArmorType, defence?: number, material?: string | ArmorMaterial}) {
		var instance = new ItemArmorIC2(nameID, params.armorName, params.type, params.defence);
		if (params.name) instance.setName(params.name);
		instance.createItem();
		if (params.material) instance.setMaterial(params.material);
		return instance;
	}*/
}