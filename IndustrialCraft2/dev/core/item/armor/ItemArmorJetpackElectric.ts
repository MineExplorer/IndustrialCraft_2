/// <reference path="./ItemArmorElectric.ts" />

class ItemArmorJetpackElectric
extends ItemArmorElectric {
	constructor() {
		super("jetpack", "electric_jetpack", {type: "chestplate", defence: 3, texture: "electric_jetpack"}, 30000, 100, 1);
		UIbuttons.setArmorButton(this.id, "button_fly");
		UIbuttons.setArmorButton(this.id, "button_hover");
	}

	getIcon(armorName: string): string {
		return armorName;
	}

	onHurt(params: {attacker: number, damage: number, type: number}, slot: ItemInstance, index: number): boolean {
		if (params.type == 5) {
			Utils.fixFallDamage(params.damage);
		}
		return false;
	}
	
	onTick(slot: ItemInstance, index: number): boolean {
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		if (slot.extra && slot.extra.getBoolean("hover")) {
			Utils.resetFallHeight();
			var vel = Player.getVelocity();
			if (Utils.isPlayerOnGround() || energyStored < 8) {
				slot.extra.putBoolean("hover", false);
				Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				Game.message("§4" + Translation.translate("Hover mode disabled"));
			}
			else if (vel.y < -0.1) {
				Player.addVelocity(0, Math.min(0.25, -0.1 - vel.y), 0);
				if (World.getThreadTime()%5 == 0) {
					ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
					Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				}
			}
		}
		return false;
	}
}