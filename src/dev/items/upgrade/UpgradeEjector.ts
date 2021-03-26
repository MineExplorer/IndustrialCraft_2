/// <reference path="UpgradeTransporting.ts" />

class UpgradeEjector extends UpgradeTransporting {
	constructor() {
		super("upgradeEjector", "ejector", "itemEjector");
	}

	getTooltip(): string {
		return "tooltip.upgrade.ejector";
	}

	onTick(item: ItemInstance, machine: TileEntity): void {
		let checkSide = item.data - 1;
		let machineStorage = StorageInterface.getInterface(machine);
		for (let side = 0; side < 6; side++) {
			if (checkSide > 0 && checkSide != side) continue;
			let storage = StorageInterface.getNeighbourStorage(machine.blockSource, machine, side);
			if (storage)
				StorageInterface.extractItemsFromStorage(storage, machineStorage, side);
		}
	}
}