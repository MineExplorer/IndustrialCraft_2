interface IRecipeDictionary<T> {
    register(recipe: T): void;
    
    registerList(recipeList: T[]): void;

	findRecipe(predicate: (recipe: T) => boolean): Nullable<T>;

    getAll(): T[];

	clear(): void;
}

abstract class RecipeDictionary<T> implements IRecipeDictionary<T> {
	recipes: DataMap<T> = {};

	abstract register(recipe: T): void;

	registerList(recipeList: T[]): void {
		recipeList.forEach(r => this.register(r));
	}

	findRecipe(predicate: (recipe: T) => boolean): Nullable<T> {
		for (let key in this.recipes) {
			const recipe = this.recipes[key];
			if (predicate(recipe)) {
				return recipe;
			}
		}
		return null;
	}

    getAll(): T[] {
        return Object.values(this.recipes);
    }

	clear(): void {
		this.recipes = {};
	}

	protected putRecipe(key: string, recipe: T): void {
		this.recipes[key] = recipe;
	}

	protected removeByKey(recipeKey: string): boolean {
		if (recipeKey in this.recipes) {
			delete this.recipes[recipeKey];
			return true;
		}
		return false;
	}
}

interface ProcessingRecipeBase {
	source: { id: number, count?: number, data?: number}
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

type FluidItemMixingRecipeBase = {
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
