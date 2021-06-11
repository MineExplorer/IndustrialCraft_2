/// <reference path="AbstractButton.ts" />

namespace ToolHUD {
	export class ButtonJump extends AbstractButton {
		constructor() {
			super("button_jump", "armor", {
				position: 3,
				bitmap: "button_jump_on",
				bitmap2: "button_jump_off",
				scale: 50,
			});
		}

		onClick(player: number) {
			let slot = Entity.getArmorSlot(player, 3);
			let energyStored = ChargeItemRegistry.getEnergyStored(slot);
			let vel = Entity.getVelocity(player);
			if (energyStored >= 4000 && Math.abs(vel.y - fallVelocity) < 0.0001) {
				Entity.setVelocity(player, vel.x * 3.5, 1.3, vel.z * 3.5);
				ChargeItemRegistry.setEnergyStored(slot, energyStored - 4000);
				Entity.setArmorSlot(player, 3, slot.id, 1, slot.data, slot.extra);
			}
		}
	}
}
