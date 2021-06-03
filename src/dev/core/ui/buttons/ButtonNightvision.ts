/// <reference path="AbstractButton.ts" />

namespace ToolHUD {
	export class ButtonNightvision extends AbstractButton {
		constructor() {
			super("button_nightvision", "armor");
		}

		uiElement: UI.UIButtonElement = {
			x: 0,
			y: 0,
			type: "button",
			bitmap: "button_nightvision_on",
			bitmap2: "button_nightvision_off",
			scale: 50,
			clicker: {
				onClick: () => {
					ToolHUD.onClick(this.name);
				}
			}
		}

		onClick(player: number) {
			let slot = Entity.getArmorSlot(player, 0);
			let extra = slot.extra || new ItemExtraData();
			if (extra.getBoolean("nv")) {
				extra.putBoolean("nv", false);
				Game.message("§4" + Translation.translate("Nightvision mode disabled"));
			}
			else {
				extra.putBoolean("nv", true);
				Game.message("§2" + Translation.translate("Nightvision mode enabled"));
			}
			Entity.setArmorSlot(player, 0, slot.id, 1, slot.data, extra);
		}
	}
}
