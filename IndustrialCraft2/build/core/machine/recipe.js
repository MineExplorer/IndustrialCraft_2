var MachineRecipeRegistry;
(function (MachineRecipeRegistry) {
    MachineRecipeRegistry.recipeData = {};
    function registerRecipesFor(name, data, validateKeys) {
        if (validateKeys) {
            var newData = {};
            for (var key in data) {
                if (key.indexOf(":") != -1) {
                    var keyArray = key.split(":");
                    var newKey = eval(keyArray[0]) + ":" + keyArray[1];
                }
                else {
                    var newKey = eval(key);
                }
                newData[newKey] = data[key];
            }
            data = newData;
        }
        this.recipeData[name] = data;
    }
    MachineRecipeRegistry.registerRecipesFor = registerRecipesFor;
    function addRecipeFor(name, input, result) {
        var recipes = this.requireRecipesFor(name, true);
        if (Array.isArray(recipes)) {
            recipes.push({ input: input, result: result });
        }
        else {
            recipes[input] = result;
        }
    }
    MachineRecipeRegistry.addRecipeFor = addRecipeFor;
    function requireRecipesFor(name, createIfNotFound) {
        if (!this.recipeData[name] && createIfNotFound) {
            this.recipeData[name] = {};
        }
        return this.recipeData[name];
    }
    MachineRecipeRegistry.requireRecipesFor = requireRecipesFor;
    function getRecipeResult(name, key1, key2) {
        var data = this.requireRecipesFor(name);
        if (data) {
            return data[key1] || data[key1 + ":" + key2];
        }
        return null;
    }
    MachineRecipeRegistry.getRecipeResult = getRecipeResult;
    function hasRecipeFor(name, key1, key2) {
        return this.getRecipeResult(name, key1, key2) ? true : false;
    }
    MachineRecipeRegistry.hasRecipeFor = hasRecipeFor;
})(MachineRecipeRegistry || (MachineRecipeRegistry = {}));
