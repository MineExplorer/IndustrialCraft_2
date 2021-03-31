interface IUpgrade {
	type: string;
	getSpeedModifier?(item: ItemInstance, machine: TileEntity): number;
	getEnergyDemandMultiplier?(item: ItemInstance, machine: TileEntity): number;
	getProcessTimeMultiplier?(item: ItemInstance, machine: TileEntity): number;
	getExtraTier?(item: ItemInstance, machine: TileEntity): number;
	getExtraEnergyStorage?(item: ItemInstance, machine: TileEntity): number;
	modifyRedstone?(item: ItemInstance, machine: TileEntity): boolean;
	onTick?(item: ItemInstance, machine: TileEntity): void;
}