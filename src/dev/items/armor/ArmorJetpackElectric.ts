/// <reference path="./ArmorElectric.ts" />
/// <reference path="./JetpackProvider.ts" />

class ArmorJetpackElectric
extends ArmorElectric {
	constructor() {
		super("jetpack", "electric_jetpack", {type: "chestplate", defence: 3, texture: "electric_jetpack"}, 30000, 100, 1);
		UIbuttons.setArmorButton(this.id, "button_fly");
		UIbuttons.setArmorButton(this.id, "button_hover");
	}

	getIcon(armorName: string): string {
		return armorName;
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		return JetpackProvider.onTick(item, playerUid);
	}
}