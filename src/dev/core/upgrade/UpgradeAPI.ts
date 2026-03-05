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

	export function getUpgradeSet(machine: TileEntity): UpgradeSet {
		return new UpgradeSet(machine);
	}

	export function useUpgrades(machine: TileEntity) {
		const upgrades = getUpgradeSet(machine);
		performUpgrades(upgrades);
	}

	export function performUpgrades(upgrades: UpgradeSet, isInit?: boolean): UpgradeSet {
		upgrades.reset();
		upgrades.getUpgrades();
		upgrades.updateModifiers();
		if (!isInit) {
			upgrades.onTick();
		}
		return upgrades;
	}

	/** @deprecated */
	export function executeUpgrades(machine: TileEntity): UpgradeSet {
		const upgrades = getUpgradeSet(machine);
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
		upgrades: {
			upgrade: IUpgrade;
			stack: ItemInstance;
		}[];
		speedModifier: number;
		processTimeMultiplier: number;
		energyDemandMultiplier: number;
		extraEnergyStorage: number;
		extraTier: number;
		invertRedstone: boolean;

		constructor(protected tileEntity: TileEntity) {
			this.reset();
		}

		reset(): void {
			this.upgrades = [];
			this.speedModifier = 1;
			this.processTimeMultiplier = 1;
			this.energyDemandMultiplier = 1;
			this.extraEnergyStorage = 0;
			this.extraTier = 0;
			this.invertRedstone = false;
		}

		getUpgrades(): void {
			const container = this.tileEntity.container;
			for (let slotName in container.slots) {
				if (slotName.includes("Upgrade")) {
					const slot = container.getSlot(slotName);
					const upgrade = getUpgrade(slot.id);
					if (upgrade && this.isValidUpgrade(upgrade)) {
						this.upgrades.push({
							upgrade: upgrade,
							stack: slot
						});
					}
				}
			}
		}

		updateModifiers(): void {
			for (let i = 0; i < this.upgrades.length; i++) {
				const upgradeData = this.upgrades[i];
				this.performUpgradeModifiers(upgradeData.upgrade, upgradeData.stack);
			}
		}

		onTick(): void {
			for (let i = 0; i < this.upgrades.length; i++) {
				const upgradeData = this.upgrades[i];
				const upgrade = upgradeData.upgrade;
				if ("onTick" in upgrade) {
					upgrade.onTick(upgradeData.stack, this.tileEntity);
				}
			}
		}

		isValidUpgrade(upgrade: IUpgrade): boolean {
			const validUpgrades = this.tileEntity["upgrades"];
			return (!validUpgrades || validUpgrades.indexOf(upgrade.type) != -1);
		}

		performUpgradeModifiers(upgrade: IUpgrade, stack: ItemInstance) {
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
