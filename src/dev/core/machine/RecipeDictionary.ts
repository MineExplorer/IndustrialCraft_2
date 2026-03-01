interface RecipeDictionary<T> {
    register(recipe: T): void;

    registerList(recipeList: T[]): void;

    getRecipe(key1: string | number, key2?: string | number): T;

    getAll(): T[];

    getCompoundKey(recipe: T): string;
}

interface ProcessingRecipeBase {
	input: { id: number, count?: number, data?: number}
    processTime?: number
}

class ProcessingRecipeDictionary<T extends ProcessingRecipeBase> implements RecipeDictionary<T> {
	recipes: DataMap<T> = {};

	constructor(public defaultProccessTime: number) { }

	register(recipe: T): void {
        recipe.input.count ??= 1;
        recipe.processTime ??= this.defaultProccessTime;
		this.recipes[this.getCompoundKey(recipe)] = recipe;
	}

	registerList(recipeList: T[]): void {
		recipeList.forEach(r => this.register(r));
	}

	getRecipe(inputId: number, inputData: number): T {
		return this.recipes[inputId + ":" + inputData] || this.recipes[inputId + ":-1"];
	}

    getAll(): T[] {
        return Object.values(this.recipes);
    }

	getCompoundKey(recipe: T): string {
		return recipe.input.id + ":" + (recipe.input.data ?? -1);
	}
}