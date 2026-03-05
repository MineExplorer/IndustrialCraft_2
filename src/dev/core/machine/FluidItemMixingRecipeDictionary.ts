/// <reference path="./RecipeDictionary.ts" />

interface FluidItemMixingRecipeBase {
	source: {id: number, count?: number, data?: number}
	inputFluid: {name: string, amount: number}
};

class FluidItemMixingRecipeDictionary<T extends FluidItemMixingRecipeBase> extends RecipeDictionary<T> {
	register(recipe: T): void {
        recipe.source.data ??= -1;
        recipe.source.count ??= 1;
		const recipeKey = this.getInputKey(recipe.inputFluid.name, recipe.source.id, recipe.source.data);
		this.putRecipe(recipeKey, recipe);
	}

	getRecipe(fluid: string, source: {id: number, data: number}): Nullable<T> {
		return this.recipes[this.getInputKey(fluid, source.id, source.data)] ||
			this.recipes[this.getInputKey(fluid, source.id, -1)] || null;
	}

	removeRecipe(fluid: string, source: ItemInstance): boolean {
		const recipeKey = this.getInputKey(fluid, source.id, source.data);
		return this.removeByKey(recipeKey);
	}

	getInputKey(fluid: string, sourceId: number, sourceData: number): string {
 		return fluid + ":" + sourceId + ":" + sourceData;
	}
}
