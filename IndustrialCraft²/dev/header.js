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
IMPORT("Vector");
IMPORT("ToolLib");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("BackpackAPI");

// constants
const GUI_SCALE = 3.2;
const fallVelocity = -0.0784;
var player;

// square lava texture for geothermal generator ui.
LiquidRegistry.getLiquidData("lava").uiTextures.push("gui_lava_texture_16x16");

// import values
Player.getArmorSlot = ModAPI.requireGlobal("Player.getArmorSlot");
Player.setArmorSlot = ModAPI.requireGlobal("Player.setArmorSlot");
Player.setInventorySlot = ModAPI.requireGlobal("Player.setInventorySlot");
Player.getPointed = ModAPI.requireGlobal("Player.getPointed");
var nativeDropItem = ModAPI.requireGlobal("Level.dropItem");
var canTileBeReplaced = ModAPI.requireGlobal("canTileBeReplaced");

// energy (Eu)
var EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);

// API
function random(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
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


// vanilla items
Recipes.removeFurnaceRecipe(81);
Recipes.addFurnace(81, 351, 2); // cactus fix
Recipes.addFurnaceFuel(325, 10, 2000); // lava bucket
ChargeItemRegistry.registerFlashItem(331, "Eu", 800, 0); // redstone

// debug
var lasttime = -1
var frame = 0

Callback.addCallback("tick", function(){
	if(Config.debugMode){
		var t = Debug.sysTime();
		if(frame++ % 20 == 0){
			if(lasttime != -1){
				tps = 1000 / (t - lasttime) * 20
				Game.tipMessage(Math.round(tps * 10) / 10 + "tps")
			}
			lasttime = t
		}
	}
});

// redstone items placing fix
Item.registerUseFunctionForID(69, function(coords, item, block){
	if(block.id >= 8192){
		Game.prevent();
		var side  = coords.side;
		coords = coords.relative;
		block = World.getBlockID(coords.x, coords.y, coords.z);
		if(canTileBeReplaced(block)){
			var item = Player.getCarriedItem(i);
			Player.decreaseCarriedItem(1);
			World.setBlock(coords.x, coords.y, coords.z, 69, (6 - side)%6);
		}
	}
});