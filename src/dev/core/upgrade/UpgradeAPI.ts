namespace UpgradeAPI {
	const data = {};

	export function getUpgrade(id: number): IUpgrade {
		return data[id];
	}

	export function isUpgrade(id: number): boolean {
		return !!data[id];
	}

	export function isValidUpgrade(id: number, machine: TileEntity): boolean {
		const upgrade = getUpgrade(id);
		const validUpgrades = machine["upgrades"];
		if (upgrade && (!validUpgrades || validUpgrades.indexOf(upgrade.type) != -1)) {
			return true;
		}
		return false;
	}

	export function registerUpgrade(id: number, upgrade: IUpgrade): void {
		data[id] = upgrade;
	}

	export function useUpgrades(machine: TileEntity): UpgradeSet {
		return new UpgradeSet(machine);
	}

	/** @deprecated */
	export function executeUpgrades(machine: TileEntity): UpgradeSet {
		const upgrades = useUpgrades(machine);
		// reverse compatibility with Advanced Machines
		const data = machine.data;
		if ("power_tier" in data) {
			data.power_tier = upgrades.getTier(data.power_tier);
		}
		if ("energy_storage" in data) {
			data.energy_storage = upgrades.getEnergyStorage(data.energy_storage);
		}
		if ("isHeating" in data) {
			data.isHeating = upgrades.getRedstoneInput(data.isHeating);
		}
		StorageInterface.checkHoppers(machine);
		return upgrades;
	}

	export class UpgradeSet {
		speedModifier: number;
		processTimeMultiplier: number;
		energyDemandMultiplier: number;
		extraEnergyStorage: number;
		extraTier: number;
		invertRedstone: boolean;

		constructor(protected tileEntity: TileEntity) {
			this.resetRates();
			this.useUpgrades();
		}

		resetRates(): void {
			this.speedModifier = 1;
			this.processTimeMultiplier = 1;
			this.energyDemandMultiplier = 1;
			this.extraEnergyStorage = 0;
			this.extraTier = 0;
		}

		useUpgrades(): void {
			const container = this.tileEntity.container;
			for (let slotName in container.slots) {
				if (slotName.match(/Upgrade/)) {
					const slot = container.getSlot(slotName);
					const upgrade = getUpgrade(slot.id);
					if (upgrade && this.isValidUpgrade(upgrade)) {
						this.executeUprade(upgrade, slot);
					}
				}
			}
		}

		isValidUpgrade(upgrade: IUpgrade): boolean {
			const validUpgrades = this.tileEntity["upgrades"];
			return (!validUpgrades || validUpgrades.indexOf(upgrade.type) != -1);
		}

		executeUprade(upgrade: IUpgrade, stack: ItemInstance) {
			if (upgrade.type == "overclocker") {
				this.speedModifier += upgrade.getSpeedModifier(stack, this.tileEntity) * stack.count;
				this.processTimeMultiplier *= Math.pow(upgrade.getProcessTimeMultiplier(stack, this.tileEntity), stack.count);
				this.energyDemandMultiplier *= Math.pow(upgrade.getEnergyDemandMultiplier(stack, this.tileEntity), stack.count);
			}
			if (upgrade.type == "energyStorage") {
				this.extraEnergyStorage += upgrade.getExtraEnergyStorage(stack, this.tileEntity) * stack.count;
			}
			if (upgrade.type == "transformer") {
				this.extraTier += upgrade.getExtraTier(stack, this.tileEntity) * stack.count;
			}
			if (upgrade.type == "redstone") {
				this.invertRedstone = true;
			}
			if ("onTick" in upgrade) {
				upgrade.onTick(stack, this.tileEntity);
			}
		}

		getProcessTime(defaultLength: number): number {
			return Math.round(defaultLength * this.processTimeMultiplier);
		}

		getEnergyDemand(defaultEnergy: number): number {
			return Math.round(defaultEnergy * this.energyDemandMultiplier);
		}

		getEnergyStorage(defaultEnergyStorage: number): number {
			const energyStorage = defaultEnergyStorage + this.extraEnergyStorage;
			const tileData = this.tileEntity.data;
			tileData.energy = Math.min(tileData.energy, energyStorage);
			return energyStorage;
		}

		getTier(defaultTier: number): number {
			return Math.min(defaultTier + this.extraTier, 14);
		}

		getRedstoneInput(powered: boolean): boolean {
			return this.invertRedstone ? !powered : powered;
		}
	}
}
