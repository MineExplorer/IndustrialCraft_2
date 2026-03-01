/// <reference path="../ElectricMachine.ts" />

namespace Machine {
	export type ProcessingRecipe = {
		id: number,
		count: number,
		data?: number,
		sourceCount?: number,
		processTime?: number
	}

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
			let newActive = false;
			const sourceSlot = this.container.getSlot("slotSource");
			const recipeResult = this.getRecipeResult(sourceSlot.id, sourceSlot.data);

			if (recipeResult && (!recipeResult.sourceCount || sourceSlot.count >= recipeResult.sourceCount)) {
				const resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == 0 || (resultSlot.id == recipeResult.id && (!recipeResult.data || resultSlot.data == recipeResult.data) && resultSlot.count <= 64 - recipeResult.count)) {
					if (this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						this.updateProgress(recipeResult.processTime);
						newActive = true;
					}
					if (this.isCompletedProgress()) {
						this.decreaseSlot(sourceSlot, recipeResult.sourceCount || 1);
						const itemResult = this.modifyResult(sourceSlot, resultSlot, recipeResult);
						if (itemResult) {
							resultSlot.setSlot(itemResult.id, resultSlot.count + itemResult.count, itemResult.data || 0);
						}
						this.data.progress = 0;
					}
				}
				if (!newActive && this.networkData.getBoolean(NetworkDataKeys.isActive)) {
					this.onInterrupt(); // interrupt if machine stopped working while processing item
				}
			}
			else if (this.data.progress > 0) {
				this.data.progress = 0;
				this.onInterrupt(); // interrupt when the source item is extracted
			}

			return newActive;
		}

		updateProgress(recipeProcessTime: number = this.defaultProcessTime) {
			this.data.progress += this.getProcessingSpeed() / Math.ceil(recipeProcessTime * this.processTimeMultiplier);
		}

		isCompletedProgress() {
			return +this.data.progress.toFixed(3) >= 1;
		}

		modifyResult(sourceSlot: ItemContainerSlot, resultSlot: ItemContainerSlot, recipeResult: MachineRecipeRegistry.ItemResult): ItemInstance {
			return new ItemStack(recipeResult.id, recipeResult.count, recipeResult.data);
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