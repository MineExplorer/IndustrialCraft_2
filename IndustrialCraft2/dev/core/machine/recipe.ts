namespace MachineRecipeRegistry {
	export var recipeData = {};

	export function registerRecipesFor(name: string, data: any, validateKeys: boolean) {
		if (validateKeys) {
			var newData = {};
			for (var key in data) {
				if (key.indexOf(":") != -1) {
					var keyArray = key.split(":");
					var newKey = eval(keyArray[0]) + ":" + keyArray[1];
				} else {
					var newKey = eval(key) as string;
				}
				newData[newKey] = data[key];
			}
			data = newData;
		}
		this.recipeData[name] = data;
	}

	export function addRecipeFor(name: string, input: any, result: any) {
		var recipes = this.requireRecipesFor(name, true);
		if (Array.isArray(recipes)) {
			recipes.push({input: input, result: result});
		}
		else {
			recipes[input] = result;
		}
	}

	export function requireRecipesFor(name: string, createIfNotFound: boolean) {
		if (!this.recipeData[name] && createIfNotFound) {
			this.recipeData[name] = {};
		}
		return this.recipeData[name];
	}

	export function getRecipeResult(name: string, key1: number, key2?: number) {
		var data = this.requireRecipesFor(name);
		if (data) {
			return data[key1] || data[key1+":"+key2];
		}
		return null;
	}

	export function hasRecipeFor(name: string, key1: number, key2?: number) {
		return this.getRecipeResult(name, key1, key2)? true : false;
	}
}