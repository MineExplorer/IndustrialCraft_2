/// <reference path="./ArmorElectric.ts" />

class ArmorNightvisionGoggles
extends ArmorElectric {
	constructor() {
		super("nightvisionGoggles", "nightvision_goggles", {type: "helmet", defence: 1, texture: "nightvision"}, 100000, 256, 2);
		ToolHUD.setButtonFor(this.id, "button_nightvision");
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
			let pos = Entity.getPosition(playerUid);
			let time = World.getWorldTime() % 24000;
			let region = WorldRegion.getForActor(playerUid);
			if (region.getLightLevel(pos) > 13 && time <= 12000) {
				Entity.clearEffect(playerUid, PotionEffect.nightVision);
				Entity.addEffect(playerUid, PotionEffect.blindness, 1, 25);
			} else {
				Entity.addEffect(playerUid, PotionEffect.nightVision, 1, 225);
			}
			if (World.getThreadTime()%20 == 0) {
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
				return item;
			}
		}
		return null;
	}
}