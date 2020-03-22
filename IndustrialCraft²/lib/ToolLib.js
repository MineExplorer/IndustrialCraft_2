/*
ToolLib by MineExplorer
The library includes simple tool create methods and a lot of CoreEngine bug fixes.

Attention!
Code change or clearing up the code is prohibited.
By using the library you automatically agree to these rules.

Внимание!
Явное копирование или изменение кода запрещено.
Используя библиотеку вы автоматически соглашаетесь с этими правилами.
*/

LIBRARY({
	name: "ToolLib",
	version: 14,
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

// API bug fixes
ToolAPI.getEnchantExtraData = function(extra){
	var enchant = {
		silk: false,
		fortune: 0,
		efficiency: 0,
		unbreaking: 0,
		experience: 0
	}
	if(!extra){
		extra = Player.getCarriedItem().extra;
	}
	if(extra){
		var enchants = extra.getEnchants();
		for(var i in enchants){
			if(i == 15){
				enchant.efficiency = enchants[i];
			}
			if(i == 16){
				enchant.silk = true;
			}
			if(i == 17){
				enchant.unbreaking = enchants[i];
			}
			if(i == 18){
				enchant.fortune = enchants[i];
			}
		}
	}
	return enchant;
}

ToolAPI.playerAttackHook = function(attacker, victim, item) {
	var toolData = this.getToolData(item.id);
	var enchant = this.getEnchantExtraData(item.extra);
	var worldTime = World.getThreadTime();
	var isTimeCorrect = this.LastAttackTime + 10 < worldTime;
	if(isTimeCorrect && toolData && !toolData.isNative && Entity.getHealth(victim) > 0) {
		if (!(toolData.onAttack && toolData.onAttack(item, victim))) {
			if (toolData.modifyEnchant) {
				toolData.modifyEnchant(enchant, item);
			}
			if (Math.random() < 1 / (enchant.unbreaking + 1)) {
				item.data++;
				if (toolData.isWeapon) {
					item.data++;
				}
			}
		}
		if (item.data >= toolData.toolMaterial.durability) {
			if (!(toolData.onBroke && toolData.onBroke(item))) {
				item.id = toolData.brokenId;
				item.count = 1;
				item.data = 0;
				World.playSoundAtEntity(Player.get(), "random.break", 1);
			}
		}
		var damage = toolData.damage + toolData.toolMaterial.damage;
		damage = Math.floor(damage) + (Math.random() < damage - Math.floor(damage) ? 1 : 0);
		Entity.damageEntity(victim, damage, 2, {attacker: Player.get(), bool1: true});
		Player.setCarriedItem(item.id, item.count, item.data, item.extra);
		this.LastAttackTime = worldTime;
	}
}

ToolAPI.destroyBlockHook = function (coords, block, item) {
	var toolData = this.getToolData(item.id);
	var enchant = this.getEnchantExtraData(item.extra);
	if (toolData && !toolData.isNative) {
		if (!(toolData.onDestroy && toolData.onDestroy(item, coords, block))) {
			if (toolData.modifyEnchant) {
				toolData.modifyEnchant(enchant, item);
			}
			if ((Block.getDestroyTime(block.id) > 0 || this.getToolLevelViaBlock(item.id, block.id) > 0) && Math.random() < 1 / (enchant.unbreaking + 1)) {
				item.data++;
				if (toolData.isWeapon) {
					item.data++;
				}
			}
		}
		if (item.data >= toolData.toolMaterial.durability) {
			if (!(toolData.onBroke && toolData.onBroke(item))) {
				item.id = toolData.brokenId;
				item.count = 1;
				item.data = 0;
				World.playSoundAtEntity(Player.get(), "random.break", 1);
			}
		}
		Player.setCarriedItem(item.id, item.count, item.data, item.extra);
	}
}

ToolAPI.getBlockMaterialName = function (blockID) {
	var data = this.getBlockData(blockID);
    if (data) {
        return data.material.name;
    }
    return null;
}

Block.setDestroyLevelForID = function (id, level, resetData) {
    Block.registerDropFunctionForID(id, function (blockCoords, blockID, blockData, diggingLevel) {
        if (diggingLevel >= level) {
            return [[blockID, 1, resetData? 0 : blockData]];
        }
		return [];
    }, level);
}

// Materials fix
ToolAPI.blockMaterials["stone"].multiplier = 10/3;
ToolAPI.blockMaterials["wood"].multiplier = 1;
ToolAPI.blockMaterials["dirt"].multiplier = 1;
ToolAPI.blockMaterials["plant"].multiplier = 1;
ToolAPI.blockMaterials["fibre"].multiplier = 1;

ToolAPI.registerBlockMaterial(82, "dirt");
ToolAPI.registerBlockMaterial(120, "unbreaking");
ToolAPI.registerBlockMaterial(138, "stone");
ToolAPI.registerBlockMaterial(175, "plant");

// Drop fix
Block.setDestroyLevelForID(24, 1);
Block.setDestroyLevelForID(61, 1, true);
Block.setDestroyLevelForID(67, 1, true);
Block.setDestroyLevelForID(70, 1, true);
Block.setDestroyLevelForID(108, 1, true);
Block.setDestroyLevelForID(109, 1, true);
Block.setDestroyLevelForID(112, 1);
Block.setDestroyLevelForID(113, 1);
Block.setDestroyLevelForID(114, 1, true);
Block.setDestroyLevelForID(125, 1, true);
Block.setDestroyLevelForID(128, 1, true);
Block.setDestroyLevelForID(147, 1, true);
Block.setDestroyLevelForID(148, 1, true);
Block.setDestroyLevelForID(152, 1);
Block.setDestroyLevelForID(156, 1, true);
Block.setDestroyLevelForID(167, 2, true);
Block.setDestroyLevelForID(180, 1, true);
Block.setDestroyLevelForID(203, 1, true);
Block.setDestroyLevelForID(251, 1, true);

Block.registerDropFunctionForID(13, function(coords, blockID, blockData, level, enchant){ // gravel
	if (Math.random() < [0.1, 0.14, 0.25, 1][enchant.fortune || 0]){
		return [[318, 1, 0]];
	}
	return [[13, 1, 0]];
});
Block.registerDropFunctionForID(78, function(coords, blockID, blockData, level, enchant){ // snow layer
	if (level > 0){
		if(blockData == 7) return [[332, 4, 0]];
		if(blockData >= 5) return [[332, 3, 0]];
		if(blockData >= 3) return [[332, 2, 0]];
		return [[332, 1, 0]];
	}
	return [];
});
Block.registerDropFunctionForID(80, function(coords, blockID, blockData, level, enchant){ // snow block
	if (enchant.silk){
		return [[80, 1, 0]];
	}
	return [[332, 1, 0], [332, 1, 0], [332, 1, 0], [332, 1, 0]];
});
Block.registerDropFunctionForID(110, function(coords, blockID, blockData, level, enchant){ // mycelium
	if (enchant.silk){
		return [[110, 1, 0]];
	}
	return [[3, 1, 0]];
});
Block.registerDropFunctionForID(198, function(coords, blockID, blockData, level, enchant){ // grass path
	if (enchant.silk){
		return [[198, 1, 0]];
	}
	return [[3, 1, 0]];
});
Block.registerDropFunctionForID(243, function(coords, blockID, blockData, level, enchant){ // podzol
	if (enchant.silk){
		return [[243, 1, 0]];
	}
	return [[3, 1, 0]];
});
// glass
Block.registerDropFunctionForID(20, function(coords, blockID, blockData, level, enchant){
	if (enchant.silk){
		return [[20, 1, 0]];
	}
	return [];
});
Block.registerDropFunctionForID(102, function(coords, blockID, blockData, level, enchant){
	if (enchant.silk){
		return [[102, 1, 0]];
	}
	return [];
});
// slabs
Block.registerDropFunctionForID(44, function(coords, id, data, level, enchant){
	if(level > 0){
		return [[id, 1, data%8]];
	}
	return [];
}, 1);
Block.registerDropFunctionForID(182, function(coords, id, data, level, enchant){
	if(level > 0){
		return [[id, 1, data%8]];
	}
	return [];
}, 1);
// ice
Callback.addCallback("DestroyBlock", function(coords, block, player){
	if(block.id == 79 || block.id == 194){
		var item = Player.getCarriedItem();
		var enchant = ToolAPI.getEnchantExtraData(item.extra);
		var toolData = ToolAPI.getToolData(item.id);
		if (toolData && toolData.modifyEnchant) {
			toolData.modifyEnchant(enchant, item);
		}
		if(ToolAPI.getToolLevelViaBlock(item.id, block.id) > 0 && enchant.silk){
			World.destroyBlock(coords.x, coords.y, coords.z);
			World.drop(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5, block.id, 1);
		}
	}
});

// armor fix
Callback.addCallback("tick", function(){
	for(var i = 0; i < 4; i++){
		var armor = Player.getArmorSlot(i);
		if(armor.id == 0 && armor.count > 0){
			Player.setArmorSlot(i, 0, 0, 0);
		}
	}
});

EXPORT("ToolLib", ToolLib);
EXPORT("ToolType", ToolType);
