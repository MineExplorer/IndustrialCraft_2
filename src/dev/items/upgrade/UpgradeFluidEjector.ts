/// <reference path="UpgradeTransporting.ts" />

class UpgradeFluidEjector extends UpgradeTransporting {
	type = "fluidEjector";

	getTooltip(): string {
		return "tooltip.upgrade.ejector";
	}

	onTick(item: ItemInstance, machine: TileEntity): void {
		let machineStorage = StorageInterface.getInterface(machine);

		let checkSide = item.data - 1;
		for (let side = 0; side < 6; side++) {
			if (checkSide > 0 && checkSide != side) continue;
			let liquid = machineStorage.getOutputTank(side)?.getLiquidStored();
			if (!liquid) continue;
			let storage = StorageInterface.getNeighbourLiquidStorage(machine.blockSource, machine, side);
			if (storage)
				StorageInterface.transportLiquid(liquid, 0.25, machineStorage, storage, side);
		}
	}
}