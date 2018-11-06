LIBRARY({
	name: "ToolType",
	version: 3,
	shared: true,
	api: "CoreEngine"
});

var ToolType = {
	sword: {
		isWeapon: true,
		enchantType: Native.EnchantType.weapon,
		damage: 4,
		blockTypes: ["fibre", "plant"],
		onAttack: function(item){
			if(item.data > Item.getMaxDamage(item.id)){
				item.id = item.data = item.count = 0;
			}
		},
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
		onAttack: function(item){
			if(item.data > Item.getMaxDamage(item.id)){
				item.id = item.data = item.count = 0;
			}
		},
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
		onAttack: function(item){
			if(item.data > Item.getMaxDamage(item.id)){
				item.id = item.data = item.count = 0;
			}
		}
	},
	
	axe: {
		enchantType: Native.EnchantType.axe,
		damage: 3,
		blockTypes: ["wood"],
		onAttack: function(item){
			if(item.data > Item.getMaxDamage(item.id)){
				item.id = item.data = item.count = 0;
			}
		}
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
	item.data += damage;
	if(item.data > Item.getMaxDamage(item.id)){
		item.id = item.data = item.count = 0;
	}
	Player.setCarriedItem(item.id, item.count, item.data, item.extra);
}

ToolAPI.setTool = function(id, toolMaterial, toolType, brokenId){
	Item.setToolRender(id, true);
	toolMaterial = ToolAPI.toolMaterials[toolMaterial] || toolMaterial;
	if(toolType.blockTypes){
		toolProperties = {brokenId: brokenId || 0};
		for(var i in toolType){
		toolProperties[i] = toolType[i];}
		if(!toolMaterial.durability){
			var maxDmg = Item.getMaxDamage(id)
			toolMaterial.durability = maxDmg;
		}
		ToolAPI.registerTool(id, toolMaterial, toolType.blockTypes, toolProperties);
	}
	else{
		Item.setMaxDamage(id, toolMaterial.durability);
	}
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
Block.setDestroyLevel = function(id, lvl){
	Block.registerDropFunction(id, function(coords, blockID, blockData, level, enchant){
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
