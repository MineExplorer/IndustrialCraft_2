/// <reference path="../Electricmachine.ts" />

namespace Machine {
	export abstract class ProcessingMachine
	extends ElectricMachine {
		defaultValues: {
			energy: number,
			tier: number,
			energy_storage: number,
			energy_consume?: number,
			work_time?: number,
			progress?: number,
		}

		getTier(): number {
			return this.data.tier;
		}

		getEnergyStorage(): number {
			return this.data.energy_storage;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name.startsWith("slotSource")) return !!this.getRecipeResult(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		getRecipeResult(id: number, data: number): MachineRecipeRegistry.RecipeData {
			return null;
		}

		resetValues(): void {
			this.data.tier = this.defaultValues.tier;
			this.data.energy_storage = this.defaultValues.energy_storage;
			this.data.energy_consume = this.defaultValues.energy_consume;
			this.data.work_time = this.defaultValues.work_time;
		}

		tick(): void {
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);

			var newActive = false;
			var sourceSlot = this.container.getSlot("slotSource");
			var resultSlot = this.container.getSlot("slotResult");
			var result = this.getRecipeResult(sourceSlot.id, sourceSlot.data);
			if (result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)) {
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && (!result.data || resultSlot.data == result.data) && resultSlot.count <= 64 - result.count || resultSlot.id == 0) {
					if (this.data.energy >= this.data.energy_consume) {
						this.data.energy -= this.data.energy_consume;
						this.data.progress += 1/this.data.work_time;
						newActive = true;
					}
					if (this.data.progress.toFixed(3) >= 1) {
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

			var energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.sendChanges();
		}
	}
}