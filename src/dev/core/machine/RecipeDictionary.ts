interface RecipeDictionary<T> {
    register(recipe: T): void;
    
    registerList(recipeList: T[]): void;
    
    getRecipe(input1: T[keyof T], input2?: T[keyof T]): Nullable<T>;

	/** @returns true if the recipe was deleted, false otherwise */
	removeRecipe(input1: T[keyof T], input2?: T[keyof T]): boolean;

    getAll(): T[];
}

interface ProcessingRecipeBase {
	source: { id: number, count?: number, data?: number}
    processTime?: number
}

class ProcessingRecipeDictionary<T extends ProcessingRecipeBase> implements RecipeDictionary<T> {
	recipes: DataMap<T> = {};

	constructor(public defaultProccessTime: number) { }

	register(recipe: T): void {
        recipe.source.data ??= -1;
        recipe.source.count ??= 1;
        recipe.processTime ??= this.defaultProccessTime;
		const recipeKey = this.getRecipeKey(recipe.source.id, recipe.source.data);
		this.recipes[recipeKey] = recipe;
	}

	registerList(recipeList: T[]): void {
		recipeList.forEach(r => this.register(r));
	}

	getRecipe(input: T["source"]): Nullable<T> {
		const recipe = this.getRecipeBySource(input.id, input.data);
		if (recipe && recipe.source.count <= input.count) {
			return recipe;
		}
		return null;
	}

	removeRecipe(input: T["source"]): boolean {
		const recipeKey = this.getRecipeKey(input.id, input.data)
		if (this.recipes[recipeKey]) {
			delete this.recipes[recipeKey];
			return true;
		}
		return false;
	}

    getAll(): T[] {
        return Object.values(this.recipes);
    }

	getRecipeBySource(sourceId: number, sourceData: number) {
		return this.recipes[this.getRecipeKey(sourceId, sourceData)] || this.recipes[this.getRecipeKey(sourceId, -1)];
	}

	private getRecipeKey(sourceId: number, sourceData: number): string {
		return sourceId + ":" + sourceData;
	}
}