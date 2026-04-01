/// <reference path="../ElectricMachine.ts" />

namespace Machine {
	export abstract class ProcessingMachine
	extends ElectricMachine {
		defaultValues = {
			energy: 0,
			progress: 0
		}
		
		defaultDrop = BlockID.machineBlockBasic;

		defaultTier = 1;
		defaultEnergyStorage = 1200;
		defaultEnergyDemand?: number;
		defaultProcessTime?: number;

		tier: number = this.defaultTier;
		energyCapacity: number;
		energyDemand?: number;
		processTimeMultiplier?: number;

		upgradeSet?: UpgradeAPI.UpgradeSet;

		getTier(): number {
			return this.tier;
		}

		getEnergyCapacity(): number {
			return this.energyCapacity;
		}
		
		onInit(): void {
			super.onInit();
			this.upgradeSet = UpgradeAPI.getUpgradeSet(this);
			this.useUpgrades(true);
		}

		isValidSource(id: number, data: number): boolean {
			return true;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name.startsWith("slotSource")) return this.isValidSource(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		useUpgrades(isInit: boolean): UpgradeAPI.UpgradeSet {
			const upgrades = UpgradeAPI.performUpgrades(this.upgradeSet, isInit);
			this.tier = upgrades.getTier(this.defaultTier);
			this.energyCapacity = upgrades.getEnergyStorage(this.defaultEnergyStorage);
			this.energyDemand = upgrades.getEnergyDemand(this.defaultEnergyDemand);
			this.processTimeMultiplier = upgrades.processTimeMultiplier;
			return upgrades;
		}

		onTick(): void {
			this.useUpgrades(false);
			StorageInterface.checkHoppers(this);

			const isActive = this.performRecipe();
			this.setActive(isActive);

			this.dischargeSlot("slotEnergy");

			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		performRecipe(): boolean {
			return false;
		}

		updateProgress(recipeProcessTime: number = this.defaultProcessTime) {
			const processTime = Math.max(Math.round(recipeProcessTime * this.processTimeMultiplier), 1);
			this.data.progress += 1 / processTime;
		}

		isCompletedProgress() {
			return +this.data.progress.toFixed(3) >= 1;
		}

		canRotate(side: number): boolean {
			return side > 1;
		}

		onInterrupt(): void {
			if (this.getInterruptSound()) {
				this.playOnce(this.getInterruptSound());
			}
		}

		getInterruptSound(): string {
			return null;
		}
	}
}