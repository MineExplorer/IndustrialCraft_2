namespace UpgradeAPI {
	let data = {};

	export function getUpgradeData(id: number) {
		return data[id];
	}

	export function isUpgrade(id: number) {
		return data[id]? true : false;
	}

	export function isValidUpgrade(id: number, tileEntity: Machine.MachineBase) {
		var upgrades = tileEntity.upgrades;
		var upgradeData = UpgradeAPI.getUpgradeData(id);
		if (upgradeData && (!upgrades || upgrades.indexOf(upgradeData.type) != -1)) {
			return true;
		}
		return false;
	}

	export function registerUpgrade(id: number, type: string, func) {
		data[id] = {type: type, func: func};
	}

	export function callUpgrade(item: ItemInstance, machine: Machine.MachineBase, container, data) {
		var upgrades = machine.upgrades;
		var upgrade = this.getUpgradeData(item.id);
		if (upgrade && (!upgrades || upgrades.indexOf(upgrade.type) != -1)) {
			upgrade.func(item, machine, container, data);
		}
	}

	export function getUpgrades(machine, container) {
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
						item = {id: slot.id, count: slot.count, data: slot.data};
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
		var upgrades = this.getUpgrades(machine, container);
		for (var i in upgrades) {
			this.callUpgrade(upgrades[i], machine, container, data);
		}
		StorageInterface.checkHoppers(machine);
	}
}
