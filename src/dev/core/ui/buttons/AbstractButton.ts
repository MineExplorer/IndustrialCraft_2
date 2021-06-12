namespace ToolHUD {
	type ButtonUIData = {
		position: number,
		bitmap: string,
		bitmap2?: string,
		scale: number,
		clicker?: UI.UIClickEvent
	}

	export abstract class AbstractButton
	implements IHUDButton {
		uiElement: UI.UIButtonElement;
		bindedItems = [];

		constructor(public name: string, public type: "armor" | "tool", public uiData: ButtonUIData) {
			this.uiElement = {
				type: "button",
				x: 0,
				y: uiData.position * 1000,
				...uiData,
				clicker: {
					onClick: () => {
						ToolHUD.onClick(this.name);
					}
				}
			}
		}

		bindItem(id: number): void {
			this.bindedItems.push(id);
		}

		isBindedItem(id: number): boolean {
			return this.bindedItems.indexOf(id) != -1;
		}

		onClick(player: number): void {}

		onUpdate(element: UI.UIButtonElement): void {}
	}
}