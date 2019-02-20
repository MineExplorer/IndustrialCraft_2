/*
  ___               _                 _                    _      ____                         
 |_ _|  _ __     __| |  _   _   ___  | |_   _ __    __ _  | |    / ___|   ___    _ __    ___   
  | |  | '_ \   / _` | | | | | / __| | __| | '__|  / _` | | |   | |      / _ \  | '__|  / _ \  
  | |  | | | | | (_| | | |_| | \__ \ | |_  | |    | (_| | | |   | |___  | (_) | | |    |  __/  
 |___| |_| |_|  \__,_|  \__,_| |___/  \__| |_|     \__,_| |_|    \____|  \___/  |_|     \___|  
 
 by zheka_smirnov (vk.com/zheka_smirnov) and MineExplorer (vk.com/vlad.gr2027)

 This code is a copyright, do not distribute.
*/

// libraries
IMPORT("flags");
IMPORT("ToolType");
IMPORT("energylib");
IMPORT("ChargeItem");
IMPORT("TileRender");
IMPORT("StorageInterface");

// constants
var GUI_SCALE = 3.2;
var fallVelocity = -0.0784;
var debugMode = __config__.getBool("debug_mode");

// square lava texture for geothermal generator ui.
LiquidRegistry.getLiquidData("lava").uiTextures.push("gui_lava_texture_16x16");

// import values
Player.getArmorSlot = ModAPI.requireGlobal("Player.getArmorSlot");
Player.setArmorSlot = ModAPI.requireGlobal("Player.setArmorSlot");
var nativeDropItem = ModAPI.requireGlobal("Level.dropItem");
var MobEffect = Native.PotionEffect;
var Enchantment = Native.Enchantment;
var BlockSide = Native.BlockSide;
var EntityType = Native.EntityType;

// energy (Eu)
var EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);

// API
var player;
Callback.addCallback("LevelLoaded", function(){
	debugMode = __config__.getBool("debug_mode");
	player = Player.get();
});

function random(min, max){
	return Math.ceil(Math.random() * (max - min)) + min;
}

function addShapelessRecipe(result, source){
	var ingredients = [];
	for(var i in source){
		var item = source[i];
		for(var n = 0; n < item.count; n++){
			ingredients.push(item);
		}
	}
	Recipes.addShapeless(result, ingredients);
}


var RARE_ITEM_NAME = function(item, name){
	return "§b" + name;
}

var ENERGY_ITEM_NAME = function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = ChargeItemRegistry.getEnergyStored(item);
	if(energyStored==0){return name;}
	return name + "\n§7" + energyStored + "/" + energyStorage + " Eu";
}

var RARE_ENERGY_ITEM_NAME = function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = ChargeItemRegistry.getEnergyStored(item);
	if(energyStored==0){return name;}
	return "§b" + name + "\n§7" + energyStored + "/" + energyStorage + " Eu";
}

// vanilla items
Recipes.addFurnaceFuel(325, 10, 2000);
ChargeItemRegistry.registerFlashItem(331, "Eu", 800, 0); // redstone

// debug
var lasttime = -1
var frame = 0

if(debugMode){
	Callback.addCallback("tick", function(){
		var t = java.lang.System.currentTimeMillis()
		if(frame++ % 20 == 0){
			if(lasttime != -1){
				tps = 1000 / (t - lasttime) * 20
				Game.tipMessage(Math.round(tps * 10) / 10 + "tps")
			}
			lasttime = t
		}
	});
}