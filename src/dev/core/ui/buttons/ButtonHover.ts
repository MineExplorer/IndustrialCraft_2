/// <reference path="AbstractButton.ts" />

namespace ToolHUD {
	export class ButtonHover extends AbstractButton {
		constructor() {
			super("button_hover", "armor", {
				position: 2,
				bitmap: "button_hover_off",
				scale: 50,
			});
		}

		onUpdate(element: UI.UIButtonElement): void {
			let extra = Player.getArmorSlot(1).extra;
			if (extra?.getBoolean("hover")) {
				element.bitmap = "button_hover_on";
			} else {
				element.bitmap = "button_hover_off";
			}
		}

		onClick(player: number): void {
			let slot = Entity.getArmorSlot(player, 1);
			if (!EntityHelper.isOnGround(player) && ChargeItemRegistry.getEnergyStored(slot) >= 8) {
				let client = Network.getClientForPlayer(player);
				let extra = slot.extra || new ItemExtraData();
				if (extra.getBoolean("hover")) {
					extra.putBoolean("hover", false);
					BlockEngine.sendMessage(client, "§4", "message.hover_mode.disabled");
				}
				else {
					extra.putBoolean("hover", true);
					BlockEngine.sendMessage(client, "§2", "message.hover_mode.enabled");
				}
				Entity.setArmorSlot(player, 1, slot.id, 1, slot.data, extra);
			}
		}
	}
}
