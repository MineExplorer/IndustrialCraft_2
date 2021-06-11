/// <reference path="AbstractButton.ts" />

namespace ToolHUD {
	export class ButtonToolMode extends AbstractButton {
		constructor() {
			super("button_switch", "tool", {
				position: 4,
				bitmap: "button_switch",
				bitmap2: "button_switch_touched",
				scale: 25,
			});
		}

		onClick(player: number) {
			let item = Entity.getCarriedItem(player);
			let instance = ItemRegistry.getInstanceOf(item.id) as IModeSwitchable;
			if (instance && 'onModeSwitch' in instance) {
				instance.onModeSwitch(item, player);
			}
		}
	}
}
