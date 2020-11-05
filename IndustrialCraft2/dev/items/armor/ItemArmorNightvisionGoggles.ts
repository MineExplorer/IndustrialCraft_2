/// <reference path="./ItemArmorElectric.ts" />

class ItemArmorNightvisionGoggles
extends ItemArmorElectric {
	constructor() {
		super("nightvisionGoggles", "nightvision", {type: "helmet", defence: 1, texture: "nightvision"}, 100000, 256, 2);
		UIbuttons.setArmorButton(this.id, "button_nightvision");
	}

	onTick(item: ItemInstance, index: number, player: number): boolean {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
			let coords = Entity.getPosition(player);
			let time = World.getWorldTime()%24000;
			// let region = BlockSource.getDefaultForActor(player);
			// TODO: change to block source after Inner Core update
			if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
				Entity.clearEffect(player, PotionEffect.nightVision);
				Entity.addEffect(player, PotionEffect.blindness, 1, 25);
			} else {
				Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
			}
			if (World.getThreadTime()%20 == 0) {
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
				return true;
			}
		}
		return false;
	}
}