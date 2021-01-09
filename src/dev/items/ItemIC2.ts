class ItemIC2
extends ItemBasic {
	constructor(stringID: string, name: string = stringID, texture: string | Item.TextureData = name, inCreative?: boolean) {
		super(stringID, name, texture);
		ItemRegistry.registerItem(this, inCreative);
	}
}