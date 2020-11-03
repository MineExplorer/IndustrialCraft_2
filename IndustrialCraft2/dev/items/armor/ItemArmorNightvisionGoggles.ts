/// <reference path="./ItemArmorElectric.ts" />

class ItemArmorNightvisionGoggles
extends ItemArmorElectric {
	constructor() {
		super("nightvisionGoggles", "nightvision", {type: "helmet", defence: 1, texture: "nightvision"}, 100000, 256, 2);
		UIbuttons.setArmorButton(this.id, "button_nightvision");
	}

	onTick(slot: ItemInstance): boolean {
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		if (energyStored > 0 && slot.extra && slot.extra.getBoolean("nv")) {
			var coords = Player.getPosition();
			var time = World.getWorldTime()%24000;
			if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
				Entity.clearEffect(Player.get(), PotionEffect.nightVision);
				Entity.addEffect(Player.get(), PotionEffect.blindness, 1, 25);
			} else {
				Entity.addEffect(Player.get(), PotionEffect.nightVision, 1, 225);
			}
			if (World.getThreadTime()%20 == 0) {
				ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
				Player.setArmorSlot(0, slot.id, 1, slot.data, slot.extra);
			}
		}
		return false;
	}
}