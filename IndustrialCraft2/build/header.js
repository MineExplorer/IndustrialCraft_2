/*
  ___               _                 _            _           _      ____                    __   _
 ║_ _║  _ __     __║ ║  _   _   ___  ║ ║_   _ __  ║_║   __ _  ║ ║    / ___║  _ __    __ _   _/ _║ ║ ║_
  ║ ║  ║ '_ \   / _` ║ ║ ║ ║ ║ / __║ ║ __║ ║ '__║ ,─╗  / _` ║ ║ ║   ║ ║     ║ '__║  / _` ║ [  _]  ║ __║
  ║ ║  ║ ║ ║ ║ ║ (_║ ║ ║ ║_║ ║ \__ \ ║ ║_  ║ ║    ║ ║ ║ (_║ ║ ║ ║   ║ ║___  ║ ║    ║ (_║ ║  ║ ║   ║ ║_
 ║___║ ║_║ ║_║  \__,_║  \__,_║ |___/  \__║ ║_║    ║_║  \__,_║ ║_║    \____║ ║_║     \__,_║  ║_║    \__║
 
 by MineExplorer (vk.com/vlad.gr2027) and NikolaySavenko (vk.com/savenkons)
 based on Industrial Core by zheka_smirnov (vk.com/zheka_smirnov)

 This code is a copyright, do not distribute.
*/
// libraries
IMPORT("TypeEngine");
IMPORT("flags");
IMPORT("Vector");
IMPORT("ToolLib");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("LiquidLib");
IMPORT("SoundLib");
IMPORT("BackpackAPI");
// constants
var GUI_SCALE = 3.2;
var GUI_SCALE_NEW = 3;
var fallVelocity = -0.0784;
var ELECTRIC_ITEM_MAX_DAMAGE = 27;
// import values
var nativeDropItem = ModAPI.requireGlobal("Level.dropItem");
var Color = android.graphics.Color;
var PotionEffect = Native.PotionEffect;
var ParticleType = Native.ParticleType;
var BlockSide = Native.BlockSide;
var EntityType = Native.EntityType;
// energy (Eu)
var EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);
// API
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function addShapelessRecipe(result, source) {
    var ingredients = [];
    for (var i in source) {
        var item = source[i];
        for (var n = 0; n < item.count; n++) {
            ingredients.push(item);
        }
    }
    Recipes.addShapeless(result, ingredients);
}
// vanilla items
Recipes.addFurnaceFuel(325, 10, 2000); // lava bucket
ChargeItemRegistry.registerFlashItem(331, "Eu", 800, 0); // redstone
// Recipe debug
/*
var workbenchAddShaped = Recipes.addShaped;
Recipes.addShaped = function(result, scheme, keys) {
    Logger.Log("Shaped recipe: "+result.id+", "+result.count+", "+result.data, "DEBUG");
    workbenchAddShaped(result, scheme, keys);
}

var workbenchAddShapeless = Recipes.addShapeless;
Recipes.addShapeless = function(result, input) {
    Logger.Log("Shapeless recipe: "+result.id+", "+result.count+", "+result.data, "DEBUG");
    workbenchAddShapeless(result, input);
}
*/
// delete temporary files
var File = java.io.File;
var FileWriter = java.io.FileWriter;
var target_path = __packdir__ + "assets/definitions/recipe";
var source_path = __dir__ + "assets/res/definitions/recipe";
var files = new File(source_path).list();
for (var i_1 in files) {
    try {
        var fileName = files[i_1];
        new File(target_path, fileName).delete();
    }
    catch (e) {
        Logger.Log(e, "ERROR");
    }
}
