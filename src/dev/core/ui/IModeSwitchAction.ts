interface IModeSwitchAction extends ItemBase {
	onModeSwitch(item: ItemInstance, player: number): void;
}