LIBRARY({
    name: "VanillaRecipe",
    version: 2,
    shared: false,
    api: "CoreEngine"
});
var MOD_PREFIX = "mod_";
var VanillaRecipe;
(function (VanillaRecipe) {
    var resource_path;
    function setResourcePath(path) {
        resource_path = path + "/definitions/recipe/";
        FileTools.mkdir(resource_path);
        resetRecipes();
    }
    VanillaRecipe.setResourcePath = setResourcePath;
    function getFileName(recipeName) {
        return MOD_PREFIX + recipeName + ".json";
    }
    VanillaRecipe.getFileName = getFileName;
    function getFilePath(recipeName) {
        return resource_path + getFileName(recipeName);
    }
    VanillaRecipe.getFilePath = getFilePath;
    function resetRecipes() {
        var files = FileTools.GetListOfFiles(resource_path, "json");
        for (var i in files) {
            var file = files[i];
            if (file.getName().startsWith(MOD_PREFIX)) {
                file.delete();
            }
        }
    }
    VanillaRecipe.resetRecipes = resetRecipes;
    function getNumericID(stringID) {
        var stringArray = stringID.split(":");
        if (stringArray.length == 1) {
            return VanillaBlockID[stringID] || VanillaItemID[stringID];
        }
        if (stringArray[0] == "item")
            return ItemID[stringArray[1]];
        if (stringArray[0] == "block")
            return BlockID[stringArray[1]];
        return 0;
    }
    VanillaRecipe.getNumericID = getNumericID;
    var __isValid__ = true;
    function convertToVanillaID(stringID) {
        var newID = "";
        if (!getNumericID(stringID)) {
            Logger.Log("ID " + stringID + " is invalid", "ERROR");
            __isValid__ = false;
            return null;
        }
        stringID = stringID.replace(":", "_");
        var wasLowerCase = false;
        for (var i = 0; i < stringID.length; i++) {
            if (stringID[i] == stringID[i].toUpperCase()) {
                if (wasLowerCase && stringID[i] != "_")
                    newID += "_";
                newID += stringID[i].toLowerCase();
                wasLowerCase = false;
            }
            else {
                newID += stringID[i];
                wasLowerCase = true;
            }
        }
        return "minecraft:" + newID;
    }
    VanillaRecipe.convertToVanillaID = convertToVanillaID;
    function generateBlankFile(recipeName) {
        var path = __packdir__ + "assets/definitions/recipe/" + getFileName(recipeName);
        FileTools.WriteText(path, '{"type": "crafting_shaped", "tags": []}');
    }
    function generateJSONRecipe(name, obj) {
        generateBlankFile(name);
        FileTools.WriteJSON(getFilePath(name), obj, true);
    }
    VanillaRecipe.generateJSONRecipe = generateJSONRecipe;
    function addWorkbenchRecipeFromJSON(obj) {
        if (Array.isArray(obj.result)) {
            Logger.Log("Recipes with multiple output are not supported in modded workbench", "ERROR");
            return;
        }
        var result = {
            id: getNumericID(obj.result.item),
            count: obj.result.count || 1,
            data: obj.result.data || 0
        };
        if (obj.key) {
            var ingredients = [];
            for (var key in obj.key) {
                ingredients.push(key);
                var item = obj.key[key];
                ingredients.push(getNumericID(item.item), item.data || -1);
            }
            Recipes.addShaped(result, obj.pattern, ingredients);
        }
        else {
            var ingredients = [];
            obj.ingredients.forEach(function (item) {
                ingredients.push({ id: getNumericID(item.item), data: item.data || 0 });
            });
            Recipes.addShapeless(result, ingredients);
        }
    }
    VanillaRecipe.addWorkbenchRecipeFromJSON = addWorkbenchRecipeFromJSON;
    function addCraftingRecipe(name, obj, addToWorkbench) {
        if (addToWorkbench)
            addWorkbenchRecipeFromJSON(obj);
        obj.type = "crafting_" + obj.type;
        if (!obj.tags)
            obj.tags = ["crafting_table"];
        __isValid__ = true;
        var items = obj.key || obj.ingredients;
        for (var i in items) {
            items[i].item = convertToVanillaID(items[i].item);
        }
        if (Array.isArray(obj.result)) {
            for (var i in obj.result) {
                var itemStack = obj.result[i];
                itemStack.item = convertToVanillaID(itemStack.item);
            }
        }
        else {
            obj.result.item = convertToVanillaID(obj.result.item);
        }
        if (__isValid__) {
            generateJSONRecipe(name, obj);
        }
        else {
            Logger.Log("Failed to add JSON recipe: " + name, "ERROR");
        }
    }
    VanillaRecipe.addCraftingRecipe = addCraftingRecipe;
    function addStonecutterRecipe(name, obj) {
        obj.type = "shapeless";
        obj.tags = ["stonecutter"];
        obj.priority = obj.priority || 0;
        addCraftingRecipe(name, obj);
    }
    VanillaRecipe.addStonecutterRecipe = addStonecutterRecipe;
})(VanillaRecipe || (VanillaRecipe = {}));
EXPORT("VanillaRecipe", VanillaRecipe);
