/// <reference path="AbstractButton.ts" />

namespace ToolHUD {
	export class ButtonNightvision extends AbstractButton {
		constructor() {
			super("button_nightvision", "armor", {
				position: 0,
				bitmap: "button_nightvision_on",
				bitmap2: "button_nightvision_off",
				scale: 50,
			});
		}

		onClick(player: number) {
			let client = Network.getClientForPlayer(player);
			let slot = Entity.getArmorSlot(player, 0);
			let extra = slot.extra || new ItemExtraData();
			if (extra.getBoolean("nv")) {
				extra.putBoolean("nv", false);
				BlockEngine.sendMessage(client, "§4", "message.nightvision.disabled");
			}
			else {
				extra.putBoolean("nv", true);
				BlockEngine.sendMessage(client, "§2", "message.nightvision.enabled");
			}
			Entity.setArmorSlot(player, 0, slot.id, 1, slot.data, extra);
		}
	}
}
