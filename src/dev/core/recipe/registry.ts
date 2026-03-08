/// <reference path="./RecipeDictionary.ts" />

namespace MachineRecipeRegistry {
	export const recipeData = {};
	export const fluidRecipeData = {};
	export const dictionaries = {};

	export function registerDictionary<T>(name: string, dictionary: IRecipeDictionary<T>): IRecipeDictionary<T> {
		if (dictionaries[name]) {
			Logger.Log(`Recipe dictionary for ${name} is overriden`, "ERROR");
		}
		dictionaries[name] = dictionary;
		return dictionary;
	}

	export function getDictionary<T>(name: string): T {
		return dictionaries[name];
	}

	export function registerRecipe<T>(name: string, recipe: T): void {
		const dictionary = getDictionary<IRecipeDictionary<T>>(name);
		if (!dictionary) {
			Logger.Log(`Recipe dictionary "${name}" not found, skipped adding recipe"`, "ERROR");
			return;
		}
		dictionary.register(recipe);
	}

	export function registerRecipes<T>(name: string, recipes: T[]) {
		const dictionary = getDictionary<IRecipeDictionary<T>>(name);
		if (!dictionary) {
			Logger.Log(`Recipe dictionary "${name}" not found, skipped adding ${recipes.length} recipes"`, "ERROR");
			return;
		}
		recipes.forEach(recipe => dictionary.register(recipe));
	}

	/** @deprecated */
	export function registerRecipesFor<T>(name: string, data: T, parseKeys?: boolean): void {
		if (!parseKeys) {
			recipeData[name] = data;
			return;
		}

		const newData = {};
		for (let key in data) {
			let newKey: any;
			if (key.includes(":")) {
				const keyArray = key.split(":");
				const stringID = keyArray[1];
				switch (keyArray[0]) {
					case "minecraft":
						newKey = VanillaBlockID[stringID] || VanillaItemID[stringID];
					break;
					case "block":
						newKey = Block.getNumericId(stringID);
					break;
					case "item":
						newKey = Item.getNumericId(stringID);
					break;
					default:
						newKey = eval(keyArray[0]) + ":" + keyArray[1];
					break;
				}
				if (!newKey) continue;
				if (keyArray.length > 2) {
					newKey += ":" + keyArray[2];
				}
			} else {
				newKey = eval(key);
			}
			if (newKey) {
				newData[newKey] = data[key];
			}
		}
		recipeData[name] = newData;
	}

	/** @deprecated */
	export function addRecipeFor(name: string, input: any, result: any): void {
		const recipes = requireRecipesFor(name, true);
		if (Array.isArray(recipes)) {
			recipes.push({input: input, result: result});
		}
		else {
			recipes[input] = result;
		}
	}

	/** @deprecated */
	export function requireRecipesFor(name: string, createIfNotFound?: boolean): any {
		if (!recipeData[name] && createIfNotFound) {
			recipeData[name] = {};
		}
		return recipeData[name];
	}

	/** @deprecated */
	export function getRecipeResult<T>(name: string, key1: string | number, key2?: string | number): T {
		const data = requireRecipesFor(name);
		if (data && key1) {
			return data[key1] || key2 !== undefined && data[key1+":"+key2];
		}
		return null;
	}

	/** @deprecated */
	export function hasRecipeFor(name: string, key1: any, key2?: any): boolean {
		return getRecipeResult(name, key1, key2);
	}

	export function registerFluidRecipes(name: string, data: any): void {
		fluidRecipeData[name] = data;
	}

	export function requireFluidRecipes(name: string) {
		if (!fluidRecipeData[name]) {
			fluidRecipeData[name] = {};
		}
		return fluidRecipeData[name];
	}

	export function addFluidRecipe(name: string, liquid: string, data: any) {
		const recipes = requireFluidRecipes(name);
		recipes[liquid] = data;
	}

	export function getFluidRecipe(name: string, liquid: string) {
		const recipes = requireFluidRecipes(name);
		return recipes[liquid];
	}
}