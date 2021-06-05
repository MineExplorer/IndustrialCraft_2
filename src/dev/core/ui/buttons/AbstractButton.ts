namespace ToolHUD {
	export abstract class AbstractButton
	implements IHUDButton {
		uiElement: UI.UIButtonElement;
		bindedItems = [];

		constructor(public name: string, public type: "armor" | "tool") {}

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