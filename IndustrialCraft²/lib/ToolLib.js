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
	version: 15,
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
	}
}

// old versions compatibility
ToolAPI.setTool = ToolLib.setTool;
ToolAPI.breakCarriedTool = ToolLib.breakCarriedTool;

EXPORT("ToolLib", ToolLib);
EXPORT("ToolType", ToolType);
