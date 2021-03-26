/// <reference path="IUpgrade.ts" />

namespace UpgradeAPI {
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

	export function getUpgrades(machine: TileEntity): UpgradeSet {
		return new UpgradeSet(machine);
	}

	export function executeUpgrades(machine: TileEntity): UpgradeSet {
		StorageInterface.checkHoppers(machine);
		return getUpgrades(machine);
	}

	class UpgradeSet {
		tileEntity: TileEntity;
		augmentation: number;
		processTimeMultiplier: number;
		energyDemandMultiplier: number;
		extraEnergyStorage: number;
		extraTier: number;

		constructor(tileEntity: TileEntity) {
			this.tileEntity = tileEntity;
			this.resetRates();
			this.useUpgrades();
		}

		resetRates(): void {
			this.augmentation = 0;
			this.processTimeMultiplier = 1;
			this.energyDemandMultiplier = 1;
			this.extraEnergyStorage = 0;
			this.extraTier = 0;
		}

		useUpgrades(): void {
			let container = this.tileEntity.container;
			for (let slotName in container.slots) {
				if (slotName.match(/Upgrade/)) {
					let slot = container.getSlot(slotName);
					let upgrade = getUpgrade(slot.id);
					if (upgrade && this.isValidUpgrade(upgrade)) {
						this.executeUprade(upgrade, slot);
					}
				}
			}
		}

		isValidUpgrade(upgrade: IUpgrade): boolean {
			let validUpgrades = this.tileEntity["upgrades"];
			if (!validUpgrades || validUpgrades.indexOf(upgrade.type) != -1) {
				return true;
			}
			return false;
		}

		executeUprade(upgrade: IUpgrade, stack: ItemInstance) {
			if ("getAugmentation" in upgrade) {
				this.augmentation += upgrade.getAugmentation(stack, this.tileEntity) * stack.count;
			}
			if ("getProcessTimeMultiplier" in upgrade) {
				this.processTimeMultiplier *= Math.pow(upgrade.getProcessTimeMultiplier(stack, this.tileEntity), stack.count);
			}
			if ("getEnergyDemandMultiplier" in upgrade) {
				this.energyDemandMultiplier *= Math.pow(upgrade.getEnergyDemandMultiplier(stack, this.tileEntity), stack.count);
			}
			if ("getExtraEnergyStorage" in upgrade) {
				this.extraEnergyStorage += upgrade.getExtraEnergyStorage(stack, this.tileEntity) * stack.count;
			}
			if ("getExtraTier" in upgrade) {
				this.extraTier += upgrade.getExtraTier(stack, this.tileEntity) * stack.count;
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
			let energyStorage = defaultEnergyStorage + this.extraEnergyStorage;
			let tileData = this.tileEntity.data;
			tileData.energy = Math.min(tileData.energy, energyStorage);
			return energyStorage;
		}

		getTier(defaultTier: number): number {
			return Math.min(defaultTier + this.extraTier, 14);
		}
	}
}
