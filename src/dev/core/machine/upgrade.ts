namespace UpgradeAPI {
	let data = {};

	export function getUpgradeData(id: number) {
		return data[id];
	}

	export function isUpgrade(id: number) {
		return data[id]? true : false;
	}

	export function isValidUpgrade(id: number, machine: Machine.MachineBase) {
		let upgrades = machine.upgrades;
		let upgradeData = getUpgradeData(id);
		if (upgradeData && (!upgrades || upgrades.indexOf(upgradeData.type) != -1)) {
			return true;
		}
		return false;
	}

	export function registerUpgrade(id: number, type: string, func: (item: ItemInstance, machine: Machine.MachineBase, data: any) => void) {
		data[id] = {type: type, func: func};
	}

	export function callUpgrade(item: ItemInstance, machine: Machine.MachineBase, data: any) {
		let upgrades = machine.upgrades;
		let upgradeData = getUpgradeData(item.id);
		if (upgradeData && (!upgrades || upgrades.indexOf(upgradeData.type) != -1)) {
			upgradeData.func(item, machine, data);
		}
	}

	export function getUpgrades(container: ItemContainer) {
		let upgrades = [];
		for (let slotName in container.slots) {
			if (slotName.match(/Upgrade/)) {
				let slot = container.getSlot(slotName);
				if (slot.id > 0) {
					let find = false;
					for (let i in upgrades) {
						let item = upgrades[i];
						if (item.id == slot.id && item.data == slot.data) {
							item.count += slot.count;
							find = true;
							break;
						}
					}
					if (!find) {
						let item = new ItemStack(slot);
						upgrades.push(item);
					}
				}
			}
		}
		return upgrades;
	}

	export function getCountOfUpgrade(id: number, container: ItemContainer) {
		let count = 0;
		for (let slotName in container.slots) {
			if (slotName.match(/Upgrade/)) {
				let slot = container.getSlot("name");
				if (slot.id == id)
					count += slot.count;
			}
		}
		return count;
	}

	export function executeUpgrades(machine: Machine.MachineBase) {
		let container = machine.container;
		let data = machine.data;
		let upgrades = getUpgrades(container);
		for (let i in upgrades) {
			callUpgrade(upgrades[i], machine, data);
		}
		StorageInterface.checkHoppers(machine);
	}
}
