/// <reference path="../Electricmachine.ts" />

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

		tier: number;
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

		getRecipeResult(id: number, data: number): any {
			return null;
		}

		useUpgrades(): UpgradeAPI.UpgradeSet {
			let upgrades = UpgradeAPI.useUpgrades(this);
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
			let sourceSlot = this.container.getSlot("slotSource");
			let result = this.getRecipeResult(sourceSlot.id, sourceSlot.data);
			if (result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)) {
				let resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && (!result.data || resultSlot.data == result.data) && resultSlot.count <= 64 - result.count || resultSlot.id == 0) {
					if (this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						this.data.progress += 1 / this.processTime;
						newActive = true;
					}
					if (+this.data.progress.toFixed(3) >= 1) {
						let sourceCount = result.sourceCount || 1;
						sourceSlot.setSlot(sourceSlot.id, sourceSlot.count - sourceCount, sourceSlot.data);
						sourceSlot.validate();
						resultSlot.setSlot(result.id, resultSlot.count + result.count, result.data || 0);
						this.data.progress = 0;
					}
				}
			}
			else {
				this.data.progress = 0;
			}
			this.setActive(newActive);

			this.dischargeSlot("slotEnergy");

			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
	}
}