/// <reference path="AbstractButton.ts" />

namespace ToolHUD {
	export class ButtonFly extends AbstractButton {
		isTouched = false;
		jetpackSound = "JetpackLoop.ogg";

		constructor() {
			super("button_fly", "armor", {
				position: 1,
				bitmap: "button_fly_on",
				bitmap2: "button_fly_off",
				scale: 50
			});
		}

		onUpdate(): void {
			const isFlying = ToolHUD.container.isElementTouched(this.name);
			if (this.isTouched != isFlying) {
				this.isTouched = isFlying;
				Network.sendToServer(IC2NetworkPackets.jetpackFlying, {fly: isFlying});
			}
			const armor = Player.getArmorSlot(1);
			const hoverMode = armor.extra?.getBoolean("hover") || false;
			const pos = Player.getPosition();
			let playSound = false;
			if (JetpackProvider.canBeFlying(armor, pos)) {
				const vy = Player.getVelocity().y;
				if (isFlying) {
					playSound = true;
					const maxVel = Math.min(32, 265 - pos.y) / 160; // max 0.2
					if (hoverMode && vy < 0.2) {
						Player.addVelocity(0, Math.min(maxVel, 0.2 - vy), 0);
					}
					else if (!hoverMode && vy < 0.67) {
						Player.addVelocity(0, Math.min(maxVel, 0.67 - vy), 0);
					}
				}
				else if (hoverMode) {
					if (vy < -0.1) {
						Player.addVelocity(0, Math.min(0.25, -0.1 - vy), 0);
					}
					playSound = true;
				}
			}
			if (playSound) {
				ICTool.startPlaySound(this.jetpackSound, true, hoverMode ? 0.8 : 1)
			} else {
				ICTool.stopPlaySound(this.jetpackSound);
			}
		}
	}
}