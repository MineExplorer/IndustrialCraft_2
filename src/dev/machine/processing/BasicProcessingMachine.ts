/// <reference path="./ProcessingMachine.ts" />

namespace Machine {
	export type ProcessingRecipe = {
		source: {id: number, count?: number, data?: number}
		result: {id: number, count: number, data?: number, extra?: ItemExtraData},
		processTime?: number
	}

	export abstract class BasicProcessingMachine
	extends ProcessingMachine {
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

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name.startsWith("slotSource")) return this.isValidSource(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		getRecipeDictionary(): ProcessingRecipeDictionary<ProcessingRecipeBase> {
			return null;
		}

		getRecipe(item: ItemInstance): ProcessingRecipeBase {
			const dictionary = this.getRecipeDictionary();
			return dictionary.getRecipe(item.id, item.data)
		}

		isValidSource(id: number, data: number): boolean {
			return !!this.getRecipeDictionary().getRecipe(id, data);
		}

		getProcessingSpeed(): number {
			return 1;
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
			const recipe = this.getRecipe(sourceSlot) as ProcessingRecipe;

			if (recipe && recipe.source.count <= sourceSlot.count) {
				const resultSlot = this.container.getSlot("slotResult");
				if (this.canStackBeMerged(sourceSlot, resultSlot, true)) {
					if (this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						this.updateProgress(recipe.processTime);
						newActive = true;
					}
					if (this.isCompletedProgress()) {
						this.decreaseSlot(sourceSlot, recipe.source.count);
						const itemResult = this.modifyResult(sourceSlot, resultSlot, recipe.result);
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

		modifyResult(sourceSlot: ItemContainerSlot, resultSlot: ItemContainerSlot, recipeResult: ProcessingRecipe["result"]): ItemInstance {
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