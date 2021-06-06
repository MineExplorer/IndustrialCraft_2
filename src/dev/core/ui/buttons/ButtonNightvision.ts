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
			let client = Network.getClientForPlayer(player);
			let slot = Entity.getArmorSlot(player, 0);
			let extra = slot.extra || new ItemExtraData();
			if (extra.getBoolean("nv")) {
				extra.putBoolean("nv", false);
				BlockEngine.sendUnlocalizedMessage(client, "§4", "message.nightvision.disabled");
			}
			else {
				extra.putBoolean("nv", true);
				BlockEngine.sendUnlocalizedMessage(client, "§2", "message.nightvision.enabled");
			}
			Entity.setArmorSlot(player, 0, slot.id, 1, slot.data, extra);
		}
	}
}
