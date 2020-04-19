/*
ToolLib by MineExplorer
The library includes simple tool create methods

Attention!
Code change or clearing up the code is prohibited.
By using the library you automatically agree to these rules.

Внимание!
Явное копирование или изменение кода запрещено.
Используя библиотеку вы автоматически соглашаетесь с этими правилами.
*/

LIBRARY({
	name: "ToolLib",
	version: 17,
	shared: true,
	api: "CoreEngine"
});

/**
* Adding new tool type in your mod
* ToolType.*name* = {...}
*/

var ToolType = {
	sword: {
		isWeapon: true,
		enchantType: Native.EnchantType.weapon,
		damage: 4,
		blockTypes: ["fibre", "plant"],
		calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
			if(block.id==30){return 0.08;}
			if(block.id==35){return 0.05;}
			var material = ToolAPI.getBlockMaterial(block.id) || {};
			if(material.name=="fibre" || material.name=="plant"){
				return params.base/1.5;
			}
			return destroyTime;
		}
	},
	
	shovel: {
		enchantType: Native.EnchantType.shovel,
		damage: 2,
		blockTypes: ["dirt"],
		useItem: function(coords, item, block){
			if(block.id==2 && coords.side==1){ 
				World.setBlock(coords.x, coords.y, coords.z, 198);
				World.playSoundAtEntity(Player.get(), "step.grass", 0.5, 0.8);
				ToolLib.breakCarriedTool(1);
			}
		}
	},
	
	pickaxe: {
		enchantType: Native.EnchantType.pickaxe,
		damage: 2,
		blockTypes: ["stone"],
	},
	
	axe: {
		enchantType: Native.EnchantType.axe,
		damage: 3,
		blockTypes: ["wood"],
	},
	
	hoe: {
		useItem: function(coords, item, block){
			if((block.id==2 || block.id==3) && coords.side==1){ 
				World.setBlock(coords.x, coords.y, coords.z, 60);
				World.playSoundAtEntity(Player.get(), "step.gravel", 1, 0.8);
				ToolLib.breakCarriedTool(1);
			}
		}
	}
}

function random(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// data for ToolLib.getBlockDrop
// drop from some plants are not added
var noDropBlocks = [26, 30, 31, 32, 51, 59, 92, 99, 100, 104, 105, 106, 115, 127, 132, 141, 142, 144, 161, 175, 199, 244, 385, 386, 388, 389, 390, 391, 392, 462];

var ToolLib = {
	setTool: function(id, toolMaterial, toolType, brokenId){
		Item.setToolRender(id, true);
		if(typeof toolMaterial == "string"){
		toolMaterial = ToolAPI.toolMaterials[toolMaterial];}
		toolData = {brokenId: brokenId || 0};
		for(var i in toolType){
			toolData[i] = toolType[i];
		}
		if(!toolMaterial.durability){
			var maxDmg = Item.getMaxDamage(id);
			toolMaterial.durability = maxDmg;
		}
		if(!toolType.blockTypes){
			toolData.isNative = true;
			Item.setMaxDamage(id, toolMaterial.durability);
		}
		ToolAPI.registerTool(id, toolMaterial, toolType.blockTypes, toolData);
		if(toolType.enchantType){
			Item.setEnchantType(id, toolType.enchantType, toolMaterial.enchantability);
		}
		if(toolType.useItem){
			Item.registerUseFunctionForID(id, toolType.useItem);
		}
		if(toolType.destroyBlock){
			Callback.addCallback("DestroyBlock", function(coords, block, player){
				var item = Player.getCarriedItem();
				if(item.id == id){
					ToolAPI.getToolData(id).destroyBlock(coords, coords.side, item, block);
				}
			});
		}
		if(toolType.continueDestroyBlock){
			Callback.addCallback("DestroyBlockContinue", function(coords, block, progress){
				var item = Player.getCarriedItem();
				if(item.id == id){
					ToolAPI.getToolData(id).continueDestroyBlock(item, coords, block, progress);
				}
			});
		}
	},
	
	breakCarriedTool: function(damage){
		var item = Player.getCarriedItem();
		var enchant = ToolAPI.getEnchantExtraData(item.extra);
		if(Math.random() < 1 / (enchant.unbreaking + 1)){
			item.data += damage;
		}
		if(item.data >= Item.getMaxDamage(item.id)){
			var tool = ToolAPI.getToolData(item.id);
			item.id = tool ? tool.brokenId : 0;
			item.count = 1;
			item.data = 0;
		}
		Player.setCarriedItem(item.id, item.count, item.data, item.extra);
	},
	
	getBlockDrop: function(coords, id, data, level, enchant){
		enchant = enchant || {};
		var dropFunc = Block.dropFunctions[id];
		if(dropFunc){
			return dropFunc(coords, id, data, level, enchant);
		}
		if(id == 5 || id == 6 || id == 19 || id == 35 || id == 85 || id == 158 || id == 171 || id == 467) return [[id, 1, data]];
		if(id == 17 || id == 162) return [[id, 1, data]]; // log
		if(id == 18 || id == 161){ // leaves
			if(enchant.silk) return [[id, 1, data]];
			return [];
		}
		if(id == 47){ // bookshelf
			if(enchant.silk) return [[47, 1, 0]];
			return [[340, 3, 0]];
		}
		if(id == 55) return [[331, 1, 0]]; // redstone wire
		if(id == 60) return [[3, 1, 0]]; // farmland
		if(id == 63 || id == 68) return [[338, 1, 0]]; // sign
		if(id == 64) return [[324, 1, 0]]; // door
		if(id == 75 || id == 76) return [[76, 1, 0]]; // redstone torch
		if(id == 79){ // ice
			if(enchant.silk) return [[79, 1, 0]];
			return [];
		}
		if(id == 83) return [[338, 1, 0]]; // sugar canes
		if(id == 89) return [[348, random(2, 4), 0]]; // glowstone
		if(id == 93 || id == 94) return [[356, 1, 0]]; // repeater
		if(id == 103) return [[360, random(3, 7), 0]]; // melon
		if(id == 123 || id == 124) return [[123, 1, 0]]; // redstone lamp
		if(id == 140) return [[390, 1, 0]]; // pot
		if(id == 149 || id == 150) return [[404, 1, 0]]; // comparator
		if(id == 151 || id == 178) return [[151, 1, 0]]; // daylight detector
		// doors
		if(id == 193) return [[427, 1, 0]];
		if(id == 194) return [[428, 1, 0]];
		if(id == 195) return [[429, 1, 0]];
		if(id == 196) return [[430, 1, 0]];
		if(id == 197) return [[431, 1, 0]];

		if(id == 393) return [[335, 1, 0]]; // kelp
		if(id == 464) return [[720, 1, 0]]; // campfire
		// signs
		if(id == 436 || id == 437) return [[472, 1, 0]];
		if(id == 441 || id == 442) return [[473, 1, 0]];
		if(id == 443 || id == 444) return [[474, 1, 0]];
		if(id == 445 || id == 446) return [[475, 1, 0]];
		if(id == 447 || id == 448) return [[476, 1, 0]];
		if(noDropBlocks.indexOf(id) != -1) return [];
		return [[id, 1, 0]];
	},
	
	isBlock: function(id){
		return IDRegistry.getIdInfo(id).startsWith("block");
	},

	addBlockDropOnExplosion: function(nameID){
		var numericID = BlockID[nameID];
		Block.registerPopResourcesFunctionForID(numericID, function(coords, block, f, i){
			if(Math.random() < 0.25){
				var dropFunc = Block.getDropFunction(block.id);
				var drop = dropFunc(coords, block.id, block.data, 99, {});
				for(var i in drop){
					World.drop(coords.x + .5, coords.y + .5, coords.z + .5, drop[i][0], drop[i][1], drop[i][2]);
				}
			}
		});
	}
}

// old versions compatibility
ToolAPI.setTool = ToolLib.setTool;
ToolAPI.breakCarriedTool = ToolLib.breakCarriedTool;

EXPORT("ToolLib", ToolLib);
EXPORT("ToolType", ToolType);
