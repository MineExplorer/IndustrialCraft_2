/// <reference path="AbstractButton.ts" />

namespace ToolHUD {
	export class ButtonHover extends AbstractButton {
		constructor() {
			super("button_hover", "armor");
		}

		uiElement: UI.UIButtonElement = {
			x: 0,
			y: 2000,
			type: "button",
			bitmap: "button_hover_off",
			scale: 50,
			clicker: {
				onClick: () => {
					ToolHUD.onClick(this.name);
				}
			}
		}

		onUpdate(): void {
			let extra = Player.getArmorSlot(1).extra;
			if (extra?.getBoolean("hover")) {
				this.uiElement.bitmap = "button_hover_on";
			} else {
				this.uiElement.bitmap = "button_hover_off";
			}
		}

		onClick(player: number): void {
			let slot = Entity.getArmorSlot(player, 1);
			if (!EntityHelper.isOnGround(player) && ChargeItemRegistry.getEnergyStored(slot) >= 8) {
				let extra = slot.extra || new ItemExtraData();
				if (extra.getBoolean("hover")) {
					extra.putBoolean("hover", false);
					Game.message("§4" + Translation.translate("Hover mode disabled"));
				}
				else {
					extra.putBoolean("hover", true);
					Game.message("§2" + Translation.translate("Hover mode enabled"));
				}
				Entity.setArmorSlot(player, 1, slot.id, 1, slot.data, extra);
			}
		}
	}
}
