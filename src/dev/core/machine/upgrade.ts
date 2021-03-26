namespace UpgradeAPI {
	type UpgradeData = {
		type: string,
		getExtraTier?: (item: ItemStack, machine: TileEntityBase) => number
	}

	const data = {};

	export function getUpgrade(id: number): IUpgrade {
		return data[id];
	}

	export function isUpgrade(id: number): boolean {
		return !!data[id];
	}

	export function isValidUpgrade(id: number, machine: TileEntity): boolean {
		let upgrade = getUpgrade(id);
		let validUpgrades = machine["upgrades"];
		if (upgrade && (!validUpgrades || validUpgrades.indexOf(upgrade.type) != -1)) {
			return true;
		}
		return false;
	}

	export function registerUpgrade(id: number, upgrade: IUpgrade): void {
		data[id] = upgrade;
	}

	export function callUpgrade(item: ItemInstance, machine: TileEntity): void {
		let upgrade = getUpgrade(item.id);
		upgrade.onTick(item, machine);
	}

	export function getUpgrades(machine: TileEntity): ItemInstance[] {
		let upgrades = [];
		for (let slotName in machine.container.slots) {
			if (slotName.match(/Upgrade/)) {
				let slot = machine.container.getSlot(slotName);
				if (slot.id > 0 && isValidUpgrade(slot.id, machine)) {
					upgrades.push(slot);
				}
			}
		}
		return upgrades;
	}

	export function getCountOfUpgrade(type: string, container: ItemContainer): number {
		let count = 0;
		for (let slotName in container.slots) {
			if (slotName.match(/Upgrade/)) {
				let slot = container.getSlot("name");
				let upgrade = getUpgrade(slot.id);
				if (upgrade?.type == type)
					count += slot.count;
			}
		}
		return count;
	}

	export function getExtraTier(machine: Machine.ElectricMachine, upgrades: ItemInstance[], defaultTier: number): number {
		let tier = defaultTier;
		for (let item of upgrades) {
			let upgrade = getUpgrade(item.id);
			tier += upgrade.getExtraTier(item, machine) * item.count;
		}
		return Math.min(tier, 14);
	}

	export function getExtraEnergyStorage(machine: Machine.ElectricMachine, upgrades: ItemInstance[]): number {
		let energyStorage = 0;
		for (let item of upgrades) {
			let upgrade = getUpgrade(item.id);
			energyStorage += upgrade.getExtraEnergyStorage(item, machine) * item.count;
		}
		return energyStorage;
	}

	export function executeUpgrades(machine: TileEntity): void {
		let upgrades = getUpgrades(machine);
		for (let item of upgrades) {
			callUpgrade(item, machine);
		}
		StorageInterface.checkHoppers(machine);
	}
}
