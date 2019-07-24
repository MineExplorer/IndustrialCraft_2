LIBRARY({
	name: "ToolLib",
	version: 4,
	shared: true,
	api: "CoreEngine"
});

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
			if(block.id==2&&coords.side==1){ 
				World.setBlock(coords.x, coords.y, coords.z, 198);
				World.playSoundAtEntity(Player.get(), "step.grass", 0.5, 0.75);
				ToolAPI.breakCarriedTool(1);
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
				World.playSoundAtEntity(Player.get(), "step.grass", 0.5, 0.75);
				ToolAPI.breakCarriedTool(1);
			}
		}
	}
}


ToolAPI.breakCarriedTool = function(damage){
	var item = Player.getCarriedItem();
	var tool = this.getToolData(item.id);
	var enchant = this.getEnchantExtraData(item.extra);
	if(Math.random() < 1 / (enchant.unbreaking + 1)){
		item.data += damage;
	}
	if(item.data >= Item.getMaxDamage(item.id)){
		item.id = tool.brokenId;
		item.count = 1;
		item.data = 0;
	}
	Player.setCarriedItem(item.id, item.count, item.data, item.extra);
}

ToolAPI.setTool = function(id, toolMaterial, toolType, brokenId){
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
				toolType.destroyBlock(coords, coords.side, item, block);
			}
		});
	}
}

// bug fixes
ToolAPI.playerAttackHook = function(attacker, mob, item) {
	var tool = this.getToolData(item.id);
	var enchant = this.getEnchantExtraData(item.extra);
	var time = World.getThreadTime();
	if(this.LastAttackTime + 10 < time && tool && !tool.isNative && Entity.getHealth(mob) > 0) {
		if(tool.modifyEnchant){
			tool.modifyEnchant(enchant, item);
		}
		if(Math.random() < 1 / (enchant.unbreaking + 1)){
			item.data++;
			if(!tool.isWeapon) item.data++;
		}
		if (tool.onAttack){
			tool.onAttack(item, mob);
		}
		if(item.data >= Item.getMaxDamage(item.id)){
			if(tool.onBroke){
				tool.onBroke(item);
			}
			else{
				item.id = tool.brokenId; item.count = 1; item.data = 0;
			}
		}
		var damage = tool.damage + tool.toolMaterial.damage;
		damage = Math.floor(damage) + (Math.random() < damage - Math.floor(damage) ? 1 : 0);
		Entity.damageEntity(mob, damage, 2, {attacker: Player.get(), bool1: true});
		Player.setCarriedItem(item.id, item.count, item.data, item.enchant, item.name);
		this.LastAttackTime = time;
	}
}

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

Block.setDestroyLevel = function(id, lvl){
	Block.registerDropFunction(id, function(coords, blockID, blockData, level){
		if(level >= lvl){
			return [[blockID, 1, blockData]];
		}
		return [];
	}, lvl);
}
function registerStandardDrop(id, lvl){
	Block.registerDropFunctionForID(id, function(coords, blockID, blockData, level){
		if(level >= lvl) return [[id, 1, 0]];
		return [];
	}, lvl);
}

// Material multipliers fix
ToolAPI.blockMaterials["stone"].multiplier = 10/3;
ToolAPI.blockMaterials["wood"].multiplier = 1;
ToolAPI.blockMaterials["dirt"].multiplier = 1;
ToolAPI.blockMaterials["plant"].multiplier = 1;
ToolAPI.blockMaterials["fibre"].multiplier = 1;

ToolAPI.registerBlockMaterial(79, "stone");
ToolAPI.registerBlockMaterial(82, "dirt");
ToolAPI.registerBlockMaterial(120, "unbreaking");
ToolAPI.registerBlockMaterial(138, "stone");
ToolAPI.registerBlockMaterial(159, "stone");
ToolAPI.registerBlockMaterial(174, "stone");

Block.setDestroyLevelForID(24, 1);
registerStandardDrop(61, 1);
registerStandardDrop(67, 1);
registerStandardDrop(70, 1);
registerStandardDrop(108, 1);
registerStandardDrop(109, 1);
registerStandardDrop(114, 1);
registerStandardDrop(125, 1);
registerStandardDrop(128, 1);
registerStandardDrop(147, 2);
registerStandardDrop(148, 2);
registerStandardDrop(156, 1);
registerStandardDrop(167, 2);
registerStandardDrop(180, 1);
registerStandardDrop(203, 1);
registerStandardDrop(251, 1);

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

Block.registerDropFunctionForID(79, function(coords, id, data, level, enchant){
	if(level > 0 && enchant.silk){
		return [[id, 1, data]];
	}
	return [];
}, 1);
Block.registerDropFunctionForID(174, function(coords, id, data, level, enchant){
	if(level > 0 && enchant.silk){
		return [[id, 1, data]];
	}
	return [];
}, 1);

EXPORT("ToolType", ToolType);
