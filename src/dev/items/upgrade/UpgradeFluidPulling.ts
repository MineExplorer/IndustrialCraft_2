/// <reference path="UpgradeTransporting.ts" />

class UpgradeFluidPulling extends UpgradeTransporting {
	constructor() {
		super("upgradeFluidPulling", "fluid_pulling", "fluidPulling");
	}

	getTooltip(): string {
		return "tooltip.upgrade.pulling";
	}

	onTick(item: ItemInstance, machine: TileEntity): void {
		let machineStorage = StorageInterface.getInterface(machine);
		let checkSide = item.data - 1;
		for (let side = 0; side < 6; side++) {
			if (checkSide > 0 && checkSide != side) continue;
			let liquid = machineStorage.getLiquidStored("input");
			let storage = StorageInterface.getNeighbourLiquidStorage(machine.blockSource, machine, side);
			if (storage)
				StorageInterface.extractLiquid(liquid, 0.25, machineStorage, storage, side);
		}
	}
}