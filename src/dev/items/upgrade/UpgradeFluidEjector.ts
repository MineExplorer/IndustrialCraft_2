/// <reference path="UpgradeTransporting.ts" />

class UpgradeFluidEjector extends UpgradeTransporting {
	constructor() {
		super("upgradeFluidEjector", "fluid_ejector", "fluidEjector");
	}

	getTooltip(): string {
		return "tooltip.upgrade.ejector";
	}

	onTick(item: ItemInstance, machine: TileEntity): void {
		let machineStorage = StorageInterface.getInterface(machine);
		let liquid = machineStorage.getLiquidStored("output");
		if (!liquid) return;

		let checkSide = item.data - 1;
		for (let side = 0; side < 6; side++) {
			if (checkSide > 0 && checkSide != side) continue;
			let storage = StorageInterface.getNeighbourLiquidStorage(machine.blockSource, machine, side);
			if (storage)
				StorageInterface.transportLiquid(liquid, 0.25, machineStorage, storage, side);
		}
	}
}