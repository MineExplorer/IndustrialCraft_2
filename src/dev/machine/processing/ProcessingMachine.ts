/// <reference path="../Electricmachine.ts" />

namespace Machine {
	export abstract class ProcessingMachine
	extends ElectricMachine {
		defaultValues: {
			energy: number,
			power_tier: number,
			energy_storage: number,
			energy_consumption?: number,
			work_time?: number,
			progress?: number,
			isActive: boolean
		}

		getTier() {
			return this.data.power_tier;
		}

		getEnergyStorage() {
			return this.data.energy_storage;
		}

		setupContainer() {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name.startsWith("slotSource")) return this.getRecipeResult(id, data)? true : false;
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		getRecipeResult(id: number, data: number): MachineRecipeRegistry.RecipeData {
			return null;
		}

		resetValues() {
			this.data.power_tier = this.defaultValues.power_tier;
			this.data.energy_storage = this.defaultValues.energy_storage;
			this.data.energy_consumption = this.defaultValues.energy_consumption;
			this.data.work_time = this.defaultValues.work_time;
		}

		tick() {
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);

			var newActive = false;
			var sourceSlot = this.container.getSlot("slotSource");
			var resultSlot = this.container.getSlot("slotResult");
			var result = this.getRecipeResult(sourceSlot.id, sourceSlot.data);
			if (result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)) {
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && (!result.data || resultSlot.data == result.data) && resultSlot.count <= 64 - result.count || resultSlot.id == 0) {
					if (this.data.energy >= this.data.energy_consumption) {
						this.data.energy -= this.data.energy_consumption;
						this.data.progress += 1/this.data.work_time;
						newActive = true;
						//this.startPlaySound();
					}
					if (this.data.progress.toFixed(3) >= 1) {
						sourceSlot.setSlot(sourceSlot.id, sourceSlot.count - (result.sourceCount || 1), sourceSlot.data);
						resultSlot.setSlot(result.id, resultSlot.count + result.count, result.data);
						this.container.validateAll();
						this.data.progress = 0;
					}
				}
			}
			else {
				this.data.progress = 0;
			}
			//if (!newActive)
				//this.stopPlaySound();
			this.setActive(newActive);

			var energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.sendChanges();
		}
	}
}