/// <reference path="./RecipeDictionary.ts" />

type ItemInputEntry = {
	id: number,
	count?: number,
	data?: number
}

type ItemOutputEntry = {
	id: number,
	count: number,
	data?: number,
	extra?: ItemExtraData,
	chance?: number
}

interface ItemSourceRecipe {
	source: ItemInputEntry,
}

namespace MachineRecipe {
	export class SourceRecipeDictionary<T extends ItemSourceRecipe> extends RecipeDictionary<T> {
		register(recipe: T): void {
			recipe.source.count ??= 1;
			recipe.source.data ??= -1;
			const recipeKey = this.getInputKey(recipe.source.id, recipe.source.data);
			this.putRecipe(recipeKey, recipe);
		}

		getRecipe(sourceId: number, sourceData: number): Nullable<T> {
			return this.recipes[this.getInputKey(sourceId, sourceData)] ||
				this.recipes[this.getInputKey(sourceId, -1)] || null;
		}

		removeRecipe(sourceId: number, sourceData: number): boolean {
			const recipeKey = this.getInputKey(sourceId, sourceData);
			return this.removeByKey(recipeKey);
		}

		getInputKey(sourceId: number, sourceData: number): string {
			return sourceId + ":" + sourceData;
		}
	}
}