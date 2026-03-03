interface RecipeDictionary<T> {
    register(recipe: T): void;
    
    registerList(recipeList: T[]): void;
    
    getRecipe(input1: T[keyof T], input2?: T[keyof T]): Nullable<T>;

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
		return this.recipes[this.getRecipeKey(input.id, input.data)] || this.recipes[this.getRecipeKey(input.id, -1)];
	}

    getAll(): T[] {
        return Object.values(this.recipes);
    }

	getRecipeKey(sourceId: number, sourceData: number): string {
		return sourceId + ":" + sourceData;
	}
}