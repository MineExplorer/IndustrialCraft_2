interface IRecipeDictionary<T> {
    register(recipe: T): void;
    
    registerList(recipeList: T[]): void;

	findRecipe(predicate: (recipe: T) => boolean): Nullable<T>;
    
	/** @returns true if the recipe was deleted, false otherwise */
	//removeRecipe(input1: T[keyof T], input2?: T[keyof T]): boolean;

    getAll(): T[];
}

abstract class RecipeDictionary<T> implements IRecipeDictionary<T> {
	recipes: DataMap<T> = {};

	register(recipe: T): void {
		const recipeKey = this.getRecipeKey(recipe);
		this.recipes[recipeKey] = recipe;
	}

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

	protected removeByKey(recipeKey: string): boolean {
		if (this.recipes[recipeKey]) {
			delete this.recipes[recipeKey];
			return true;
		}
		return false;
	}

	protected abstract getRecipeKey(recipe: T): string;
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
		super.register(recipe);
	}

	getRecipe(sourceId: number, sourceData: number): Nullable<T> {
		return this.getRecipeBySource(sourceId, sourceData) || this.getRecipeBySource(sourceId, -1);
	}

	removeRecipe(sourceId: number, sourceData: number): boolean {
		const recipeKey = this.getLookupKey(sourceId, sourceData);
		return this.removeByKey(recipeKey);
	}

	protected getRecipeBySource(sourceId: number, sourceData: number): T {
		return this.recipes[this.getLookupKey(sourceId, sourceData)];
	}

	protected getRecipeKey(recipe: T): string {
		return this.getLookupKey(recipe.source.id, recipe.source.data);
	}

	protected getLookupKey(sourceId: number, sourceData: number): string {
 		return sourceId + ":" + sourceData;
	}
}

type FluidMixingRecipe = {
	source: {id: number, count?: number, data?: number}
	inputFluid: {name: string, amount: number},
	outputFluid: {name: string, amount: number}
};

class FluidMixingRecipeDictionary extends RecipeDictionary<FluidMixingRecipe> {
	register(recipe: FluidMixingRecipe): void {
        recipe.source.data ??= -1;
        recipe.source.count ??= 1;
		super.register(recipe);
	}

	getRecipe(source: ItemInstance, fluid: string) {
		return this.findRecipe(recipe => recipe.inputFluid.name == fluid && recipe.source.id == source.id && (recipe.source.data == -1 || recipe.source.data == source.data));
	}

	removeRecipe(source: ItemInstance, fluid: string): boolean {
		const recipeKey = this.getLookupKey(fluid, source.id, source.data);
		return this.removeByKey(recipeKey);
	}

	protected getRecipeKey(recipe: FluidMixingRecipe): string {
		return this.getLookupKey(recipe.inputFluid.name, recipe.source.id, recipe.source.data);
	}

	protected getLookupKey(fluid: string, sourceId: number, sourceData: number): string {
 		return fluid + ":" + sourceId + ":" + sourceData;
	}
}
