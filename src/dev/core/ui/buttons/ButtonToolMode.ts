/// <reference path="AbstractButton.ts" />

namespace ToolHUD {
	export class ButtonToolMode extends AbstractButton {
		constructor() {
			super("button_switch", "armor");
		}

		uiElement: UI.UIButtonElement = {
			x: 0,
			y: 3000,
			type: "button",
			bitmap: "button_jump_on",
			bitmap2: "button_jump_off",
			scale: 50,
			clicker: {
				onClick: () => {
					ToolHUD.onClick(this.name);
				}
			}
		}

		onClick(player: number) {
			let item = Entity.getCarriedItem(player);
			let instance = ItemRegistry.getInstanceOf(item.id) as IModeSwitchAction;
			if (instance && 'onModeSwitch' in instance) {
				instance.onModeSwitch(item, player);
			}
		}
	}
}
