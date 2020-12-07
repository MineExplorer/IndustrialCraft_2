namespace UpgradeAPI {
	let data = {};

	export function getUpgradeData(id: number) {
		return data[id];
	}

	export function isUpgrade(id: number) {
		return data[id]? true : false;
	}

	export function isValidUpgrade(id: number, machine: Machine.MachineBase) {
		var upgrades = machine.upgrades;
		var upgradeData = getUpgradeData(id);
		if (upgradeData && (!upgrades || upgrades.indexOf(upgradeData.type) != -1)) {
			return true;
		}
		return false;
	}

	export function registerUpgrade(id: number, type: string, func: (item: ItemInstance, machine: Machine.MachineBase, data: any) => void) {
		data[id] = {type: type, func: func};
	}

	export function callUpgrade(item: ItemInstance, machine: Machine.MachineBase, data: any) {
		var upgrades = machine.upgrades;
		var upgradeData = getUpgradeData(item.id);
		if (upgradeData && (!upgrades || upgrades.indexOf(upgradeData.type) != -1)) {
			upgradeData.func(item, machine, data);
		}
	}

	export function getUpgrades(container: ItemContainer) {
		var upgrades = [];
		for (var slotName in container.slots) {
			if (slotName.match(/Upgrade/)) {
				var slot = container.getSlot(slotName);
				if (slot.id > 0) {
					var find = false;
					for (var i in upgrades) {
						var item = upgrades[i];
						if (item.id == slot.id && item.data == slot.data) {
							item.count += slot.count;
							find = true;
							break;
						}
					}
					if (!find) {
						item = new ItemStack(slot.id, slot.count, slot.data);
						upgrades.push(item);
					}
				}
			}
		}
		return upgrades;
	}

	export function executeUpgrades(machine: Machine.MachineBase) {
		var container = machine.container;
		var data = machine.data;
		var upgrades = getUpgrades(container);
		for (var i in upgrades) {
			callUpgrade(upgrades[i], machine, data);
		}
		StorageInterface.checkHoppers(machine);
	}
}
