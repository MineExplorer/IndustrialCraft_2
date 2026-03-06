interface IRecipeDictionary<T> {
    register(recipe: T): void;
    
    registerList(recipeList: T[]): void;

	findRecipe(predicate: (recipe: T) => boolean): Nullable<T>;

    getAll(): T[];

	clear(): void;
}

abstract class RecipeDictionary<T> implements IRecipeDictionary<T> {
	recipes: KeyValueMap<T> = {};

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
