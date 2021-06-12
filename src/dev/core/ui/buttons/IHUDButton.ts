interface IHUDButton {
	name: string;
	type: "armor" | "tool";
	uiElement: UI.UIButtonElement;
	bindItem(id: number): void;
	isBindedItem(id: number): boolean;
	onClick(player: number): void;
	onUpdate(element: UI.UIButtonElement): void;
}