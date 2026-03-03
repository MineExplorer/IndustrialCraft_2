/// <reference path="RecipeDictionary.ts" />

namespace MachineRecipeRegistry {
	export const recipeData = {};
	export const fluidRecipeData = {};
	export const dictionaries = {};

	export function registerDictionary<T>(name: string, dictionary: RecipeDictionary<T>): RecipeDictionary<T> {
		if (dictionaries[name]) {
			Logger.Log(`Recipe dictionary for ${name} is overriden`, "ERROR");
		}
		dictionaries[name] = dictionary;
		return dictionary;
	}

	export function getDictionary<T>(name: string): RecipeDictionary<T> {
		return dictionaries[name];
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

	export function addRecipeFor(name: string, input: any, result: any): void {
		const recipes = requireRecipesFor(name, true);
		if (Array.isArray(recipes)) {
			recipes.push({input: input, result: result});
		}
		else {
			recipes[input] = result;
		}
	}

	export function requireRecipesFor(name: string, createIfNotFound?: boolean): any {
		const dictionary = getDictionary(name);
		if (dictionary) {
			return dictionary.getAll();
		}
		if (!recipeData[name] && createIfNotFound) {
			recipeData[name] = {};
		}
		return recipeData[name];
	}

	export function getRecipe<T>(dictionaryName: string, input1: any, input2?: any): T {
		const dictionary = getDictionary<T>(dictionaryName);
		if (dictionary) {
			return dictionary.getRecipe(input1, input2);
		}
	}

	/** @deprecated */
	export function getRecipeResult<T>(name: string, key1: string | number, key2?: string | number): T {
		const data = requireRecipesFor(name);
		if (data && key1) {
			return data[key1] || key2 !== undefined && data[key1+":"+key2];
		}
		return null;
	}

	export function hasRecipeFor(name: string, key1: any, key2?: any): boolean {
		return !!(getRecipe(name, key1, key2) || getRecipeResult(name, key1, key2));
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

	export type ItemResult = {
		id: number,
		count: number,
		data?: number,
		extra?: ItemExtraData
	}
}
