/// <reference path="./ArmorElectric.ts" />

class ArmorNightvisionGoggles
extends ArmorElectric {
	constructor() {
		super("nightvisionGoggles", "nightvision_goggles", {type: "helmet", defence: 1, texture: "nightvision"}, 100000, 256, 2);
		UIbuttons.setArmorButton(this.id, "button_nightvision");
	}

	onTick(item: ItemInstance, index: number, player: number): ItemInstance {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
			let pos = Entity.getPosition(player);
			let time = World.getWorldTime()%24000;
			let region = BlockSource.getDefaultForActor(player);
			if (region.getLightLevel(pos.x, pos.y, pos.z) > 13 && time <= 12000) {
				Entity.clearEffect(player, PotionEffect.nightVision);
				Entity.addEffect(player, PotionEffect.blindness, 1, 25);
			} else {
				Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
			}
			if (World.getThreadTime()%20 == 0) {
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
				return item;
			}
		}
		return null;
	}
}