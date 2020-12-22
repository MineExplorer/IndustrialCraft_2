class ItemIC2
extends ItemBasic {
	constructor(stringID: string, name: string, texture: string | Item.TextureData, inCreative?: boolean) {
		super(stringID, name, texture);
		this.createItem(inCreative);
	}
}