interface IModeSwitchable extends ItemBase {
	onModeSwitch(item: ItemInstance, player: number): void;
}