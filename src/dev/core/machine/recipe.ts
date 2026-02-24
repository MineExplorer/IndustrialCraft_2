namespace MachineRecipeRegistry {
	export const recipeData = {};
	export const fluidRecipeData = {};

	export function registerRecipesFor(name: string, data: any, parseKeys?: boolean): void {
		if (!parseKeys) {
			this.recipeData[name] = data;
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
		this.recipeData[name] = newData;
	}

	export function addRecipeFor(name: string, input: any, result: any, props: any = {}): void {
		const recipes = this.requireRecipesFor(name, true);
		if (Array.isArray(recipes)) {
			recipes.push({input: input, result: result, ...props});
		}
		else {
			recipes[input] = {...result, ...props};
		}
	}

	export function requireRecipesFor<T>(name: string, createIfNotFound?: boolean): T {
		if (!recipeData[name] && createIfNotFound) {
			recipeData[name] = {};
		}
		return recipeData[name];
	}

	export function getRecipeResult<T>(name: string, key1: string | number, key2?: string | number): T {
		const data = this.requireRecipesFor(name);
		if (data && key1) {
			return data[key1] || key2 !== undefined && data[key1+":"+key2];
		}
		return null;
	}

	export function hasRecipeFor(name: string, key1: string | number, key2?: string | number): boolean {
		return !!this.getRecipeResult(name, key1, key2);
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