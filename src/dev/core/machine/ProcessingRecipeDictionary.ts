/// <reference path="./RecipeDictionary.ts" />

type ProcessingRecipeInput = {
	id: number,
	count?: number,
	data?: number
}

type ProcessingRecipeOutput = {
	id: number,
	count: number,
	data?: number,
	extra?: ItemExtraData,
	chance?: number
}

type ProcessingRecipeBase = {
	source: ProcessingRecipeInput
	processTime?: number
}

type ProcessingRecipe = {
	source: ProcessingRecipeInput
	result: ProcessingRecipeOutput[],
	processTime?: number
}

class ProcessingRecipeDictionary<T extends ProcessingRecipeBase> extends RecipeDictionary<T> {
	recipes: DataMap<T> = {};

	constructor(public defaultProccessTime: number) {
		super();
	}

	register(recipe: T): void {
        recipe.source.data ??= -1;
        recipe.source.count ??= 1;
        recipe.processTime ??= this.defaultProccessTime;
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
