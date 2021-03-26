/// <reference path="UpgradeTransporting.ts" />

class UpgradePulling extends UpgradeTransporting {
	constructor() {
		super("upgradePulling", "pulling", "itemPulling");
	}

	getTooltip(): string {
		return "tooltip.upgrade.pulling";
	}

	onTick(item: ItemInstance, machine: TileEntity): void {
		if (World.getThreadTime()%20 == 0) {
			let checkSide = item.data - 1;
			let machineStorage = StorageInterface.getInterface(machine);
			for (let side = 0; side < 6; side++) {
				if (checkSide > 0 && checkSide != side) continue;
				let storage = StorageInterface.getNeighbourStorage(machine.blockSource, machine, side);
				if (storage)
					StorageInterface.extractItemsFromStorage(machineStorage, storage, side);
			}
		}
	}
}