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
		energyStorage: number;
		energyDemand?: number;
		processTimeMultiplier?: number;

		getTier(): number {
			return this.tier;
		}

		getEnergyStorage(): number {
			return this.energyStorage;
		}
		
		/*onInit(): void {
			super.onInit();
			this.useUpgrades();
		}*/

		getProcessingSpeed(): number {
			return 1;
		}

		useUpgrades(): UpgradeAPI.UpgradeSet {
			const upgrades = UpgradeAPI.useUpgrades(this);
			this.tier = upgrades.getTier(this.defaultTier);
			this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
			this.energyDemand = upgrades.getEnergyDemand(this.defaultEnergyDemand);
			this.processTimeMultiplier = upgrades.processTimeMultiplier;
			return upgrades;
		}

		onTick(): void {
			this.useUpgrades();
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
			this.data.progress += this.getProcessingSpeed() / Math.ceil(recipeProcessTime * this.processTimeMultiplier);
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