/// <reference path="./ProcessingMachine.ts" />

namespace Machine {
	export abstract class BasicProcessingMachine
	extends ProcessingMachine {
		getRecipeDictionary(): ProcessingRecipeDictionary<ProcessingRecipeBase> {
			return null;
		}

		getRecipe(id: number, data: number): ProcessingRecipeBase {
			const dictionary = this.getRecipeDictionary();
			return dictionary.getRecipe(id, data);
		}

		isValidSource(id: number, data: number): boolean {
			return !!this.getRecipe(id, data);
		}

		getOutputSlots(): string[] {
			return ["slotResult"];
		}

		performRecipe(): boolean {
			let newActive = false;
			const sourceSlot = this.container.getSlot("slotSource");
			const recipe = this.getRecipe(sourceSlot.id, sourceSlot.data) as ProcessingRecipe;

			if (recipe && recipe.source.count <= sourceSlot.count) {
				if (this.canPutResult(recipe.result)) {
					if (this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						this.updateProgress(recipe.processTime);
						newActive = true;
					}
					if (newActive && this.isCompletedProgress()) {
						this.decreaseSlot(sourceSlot, recipe.source.count);
						this.putResult(recipe.result);
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

		canPutResult(result: ProcessingRecipeOutput[]): boolean {
			const outputSlots = this.getOutputSlots();
			for (let i = 0; i < Math.min(result.length, outputSlots.length); i++) {
				const item = result[i];
				const itemData = item.data || 0;
				const resultSlot = this.container.getSlot(outputSlots[i]);
				if (resultSlot.id != 0 && (resultSlot.id != item.id || resultSlot.data != itemData || resultSlot.count + item.count > 64)) {
					return false;
				}
			}
			return true;
		}

		putResult(result: ProcessingRecipeOutput[]): void {
			const outputSlots = this.getOutputSlots();
			for (let i = 0; i < Math.min(result.length, outputSlots.length); i++) {
				const entry = result[i];
				if (entry.chance != null && Math.random() < entry.chance) {
					continue;
				}
				const resultSlot = this.container.getSlot(outputSlots[i]);
				resultSlot.setSlot(entry.id, resultSlot.count + entry.count, entry.data || 0, entry.extra || null);
			}
		}
	}
}
