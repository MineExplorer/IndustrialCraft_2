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
		processTime?: number;

		getTier(): number {
			return this.tier;
		}

		getEnergyStorage(): number {
			return this.energyStorage;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name.startsWith("slotSource")) return !!this.getRecipeResult(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		onInit(): void {
			super.onInit();
			this.useUpgrades();
		}

		getRecipeResult(id: number, data: number): any {
			return null;
		}

		useUpgrades(): UpgradeAPI.UpgradeSet {
			const upgrades = UpgradeAPI.useUpgrades(this);
			this.tier = upgrades.getTier(this.defaultTier);
			this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
			this.energyDemand = upgrades.getEnergyDemand(this.defaultEnergyDemand);
			this.processTime = upgrades.getProcessTime(this.defaultProcessTime);
			return upgrades;
		}

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);

			let newActive = false;
			const sourceSlot = this.container.getSlot("slotSource");
			const result = this.getRecipeResult(sourceSlot.id, sourceSlot.data);
			if (result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)) {
				const resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && (!result.data || resultSlot.data == result.data) && resultSlot.count <= 64 - result.count || resultSlot.id == 0) {
					if (this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						this.updateProgress();
						newActive = true;
					}
					if (this.isCompletedProgress()) {
						const sourceCount = result.sourceCount || 1;
						this.decreaseSlot(sourceSlot, sourceCount);
						resultSlot.setSlot(result.id, resultSlot.count + result.count, result.data || 0);
						this.data.progress = 0;
					}
				}
				if (this.networkData.getBoolean(NetworkDataKeys.isActive) && !newActive) {
					if (this.getInterruptSound()) { // play interrupt sound if machine stopped working while processing item
						this.playOnce(this.getInterruptSound());
					}
				}
			}
			else if (this.data.progress > 0) {
				this.data.progress = 0;
				if (this.getInterruptSound()) { // play interrupt sound if the source item was extracted
					this.playOnce(this.getInterruptSound());
				}
			}
			this.setActive(newActive);

			this.dischargeSlot("slotEnergy");

			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		updateProgress() {
			this.data.progress += 1 / this.processTime;
		}

		isCompletedProgress() {
			return +this.data.progress.toFixed(3) >= 1;
		}

		canRotate(side: number): boolean {
			return side > 1;
		}

		getInterruptSound(): string {
			return null;
		}
	}
}