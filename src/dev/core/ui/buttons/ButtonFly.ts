/// <reference path="AbstractButton.ts" />

namespace ToolHUD {
	export class ButtonFly extends AbstractButton {
		isTouched = false;

		constructor() {
			super("button_fly", "armor");
		}

		uiElement: UI.UIButtonElement = {
			x: 0,
			y: 1000,
			type: "button",
			bitmap: "button_fly_on",
			bitmap2: "button_fly_off",
			scale: 50
		}

		onUpdate(): void {
			let isFlying = ToolHUD.container.isElementTouched(this.name);
			if (this.isTouched != isFlying) {
				this.isTouched = isFlying;
				Network.sendToServer("icpe.setFlying", {fly: isFlying});
			}
			let armor = Player.getArmorSlot(1);
			let hoverMode = armor.extra?.getBoolean("hover") || false;
			let energyStored = ChargeItemRegistry.getEnergyStored(armor);
			let posY = Player.getPosition().y;
			if (energyStored >= 8 && posY < 256) {
				let vy = Player.getVelocity().y;
				if (isFlying) {
					let maxVel = Math.min(32, 265 - posY) / 160; // max 0.2
					if (hoverMode) {
						if (vy < 0.2)
						Player.addVelocity(0, Math.min(maxVel, 0.2 - vy), 0);
					}
					else if (vy < 0.67) {
						Player.addVelocity(0, Math.min(maxVel, 0.67 - vy), 0);
					}
				} else if (hoverMode) {
					if (vy < -0.1)
					Player.addVelocity(0, Math.min(0.25, -0.1 - vy), 0);
				}
			}
		}
	}
}