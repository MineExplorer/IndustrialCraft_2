/// <reference path="./ProcessingMachine.ts" />

namespace Machine {
	export type ProcessingRecipeResult = {
		id: number,
		count: number,
		data?: number,
		extra?: ItemExtraData,
		chance?: number
	}

	export type ProcessingRecipe = {
		source: {id: number, count?: number, data?: number}
		result: ProcessingRecipeResult,
		processTime?: number
	}

	export abstract class BasicProcessingMachine
	extends ProcessingMachine {
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

		performRecipe(): boolean {
			let newActive = false;
			const sourceSlot = this.container.getSlot("slotSource");
			const recipe = this.getRecipe(sourceSlot) as ProcessingRecipe;

			if (recipe && recipe.source.count <= sourceSlot.count) {
				if (this.canPutResult(recipe.result)) {
					if (this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						this.updateProgress(recipe.processTime);
						newActive = true;
					}
					if (newActive && this.isCompletedProgress()) {
						this.decreaseSlot(sourceSlot, recipe.source.count);
						const itemResult = this.modifyResult(recipe.result);
						if (itemResult) {
							this.putResult(itemResult);
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

		canPutResult(result: ProcessingRecipeResult): boolean {
			const resultSlot = this.container.getSlot("slotResult");
			const itemData = result.data || 0;
			if (resultSlot.id != 0 && (resultSlot.id != result.id || resultSlot.data != itemData || resultSlot.count + result.count > 64)) {
				return false;
			}
			return true;
		}

		modifyResult(recipeResult: ProcessingRecipeResult): ItemInstance {
			if (recipeResult.chance == null || Math.random() < recipeResult.chance) {
				return new ItemStack(recipeResult.id, recipeResult.count, recipeResult.data, recipeResult.extra);
			}
			return null;
		}

		putResult(result: ItemInstance): void {
			const resultSlot = this.container.getSlot("slotResult");
			resultSlot.setSlot(result.id, resultSlot.count + result.count, result.data);
		}
	}
}
