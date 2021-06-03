/// <reference path="./ArmorElectric.ts" />
/// <reference path="./JetpackProvider.ts" />

class ArmorJetpackElectric
extends ArmorElectric {
	constructor() {
		super("jetpack", "electric_jetpack", {type: "chestplate", defence: 3, texture: "electric_jetpack"}, 30000, 100, 1);
		ToolHUD.setButtonFor(this.id, "button_fly");
		ToolHUD.setButtonFor(this.id, "button_hover");
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		return JetpackProvider.onTick(item, playerUid);
	}
}