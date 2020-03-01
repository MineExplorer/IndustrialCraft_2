var MachineRecipeRegistry = {
	recipeData: {},
	
	registerRecipesFor: function(name, data, validateKeys){
		if(validateKeys){
			var newData = {};
			for(var key in data){
				var newKey = key;
				if(key.split(":").length < 2){
					newKey = eval(key);
				}
				newData[newKey] = data[key];
			}
			data = newData;
		}
		this.recipeData[name] = data;
	},
	
	addRecipeFor: function(name, input, result){
		var recipes = this.requireRecipesFor(name, true);
		if(Array.isArray(recipes)){
			recipes.push({input: input, result: result});
		}
		else {
			recipes[input] = result;
		}
	},
	
	requireRecipesFor: function(name, createIfNotFound){
		if(!this.recipeData[name] && createIfNotFound){
			this.recipeData[name] = {};
		}
		return this.recipeData[name];
	},
	
	getRecipeResult: function(name, key1, key2){
		var data = this.requireRecipesFor(name);
		if(data){
			return data[key1] || data[key1+":"+key2];
		}
	},
	
	hasRecipeFor: function(name, key1, key2){
		return this.getRecipeResult(name, key1, key2)? true : false;
	}
}