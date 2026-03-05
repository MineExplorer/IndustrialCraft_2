/// <reference path="./ProcessingMachine.ts" />

namespace Machine {
	export type AdvancedProcessingRecipe = {
		source: {id: number, count?: number, data?: number}
		result: ProcessingRecipeResult[],
		processTime?: number
	}

	export abstract class AdvancedProcessingMachine
	extends ProcessingMachine {
		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name.startsWith("slotSource")) return this.isValidSource(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		getRecipeDictionary(): ProcessingRecipeDictionary<AdvancedProcessingRecipe> {
			return null;
		}

		getRecipe(item: ItemInstance): AdvancedProcessingRecipe {
			const dictionary = this.getRecipeDictionary();
			return dictionary.getRecipe(item.id, item.data)
		}

		isValidSource(id: number, data: number): boolean {
			return !!this.getRecipeDictionary().getRecipe(id, data);
		}

		getResultSlotsCount(): number {
			return 1;
		}

		performRecipe(): boolean {
			let newActive = false;
			const sourceSlot = this.container.getSlot("slotSource");
			const recipe = this.getRecipe(sourceSlot);

			if (recipe && recipe.source.count <= sourceSlot.count) {
				const resultSize = this.getResultSlotsCount();
				if (this.canPutResult(recipe.result, resultSize)) {
					if (this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						this.updateProgress(recipe.processTime);
						newActive = true;
					}
					if (newActive && this.isCompletedProgress()) {
						this.decreaseSlot(sourceSlot, recipe.source.count);
						const result = this.modifyResult(recipe, resultSize);
						this.putResult(result, resultSize);
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

		canPutResult(result: ProcessingRecipeResult[], resultSize: number): boolean {
			for (let i = 0; i < Math.min(result.length, resultSize); i++) {
				const item = result[i];
				if (!item || item.id == 0 || item.count <= 0) {
					continue;
				}
				const resultSlot = this.container.getSlot("slotResult" + (i + 1));
				const itemData = item.data || 0;
				if (resultSlot.id != 0 && (resultSlot.id != item.id || resultSlot.data != itemData || resultSlot.count + item.count > 64)) {
					return false;
				}
			}
			return true;
		}

		modifyResult(recipe: AdvancedProcessingRecipe, resultSize: number): ItemInstance[] {
			const result: ItemInstance[] = [];
			for (let i = 0; i < Math.min(recipe.result.length, resultSize); i++) {
				const item = recipe.result[i];
                if (item.chance == null || Math.random() < item.chance) {
                    result.push(new ItemStack(item.id, item.count, item.data || 0, item.extra));
                } else {
                    result.push(null);
                }
			}
			return result;
		}

		putResult(result: ItemInstance[], resultSize: number): void {
			for (let i = 0; i < Math.min(result.length, resultSize); i++) {
				const item = result[i];
				if (!item || item.id == 0 || item.count <= 0) {
					continue;
				}
				const resultSlot = this.container.getSlot("slotResult" + (i + 1));
				resultSlot.setSlot(item.id, resultSlot.count + item.count, item.data, item.extra);
			}
		}
	}
}
