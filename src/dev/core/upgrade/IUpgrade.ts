interface IUpgrade {
	type: string;
	getAugmentation?(item: ItemInstance, machine: TileEntity): number;
	getEnergyDemandMultiplier?(item: ItemInstance, machine: TileEntity): number;
	getProcessTimeMultiplier?(item: ItemInstance, machine: TileEntity): number;
	getExtraTier?(item: ItemInstance, machine: TileEntity): number;
	getExtraEnergyStorage?(item: ItemInstance, machine: TileEntity): number;
	getRedstoneInput?(item: ItemInstance, machine: TileEntity, signal: number): number;
	onTick?(item: ItemInstance, machine: TileEntity): void;
}