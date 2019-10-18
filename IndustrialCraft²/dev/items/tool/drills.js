IDRegistry.genItemID("drill");
IDRegistry.genItemID("diamondDrill");
IDRegistry.genItemID("iridiumDrill");
Item.createItem("drill", "Mining Drill", {name: "drill"}, {stack: 1, isTech: true});
Item.createItem("diamondDrill", "Diamond Drill", {name: "drill_diamond"}, {stack: 1, isTech: true});
Item.createItem("iridiumDrill", "Iridium Drill", {name: "drill_iridium"}, {stack: 1, isTech: true});
Item.setGlint(ItemID.iridiumDrill, true);
ItemName.setRarity(ItemID.iridiumDrill, 2);

ChargeItemRegistry.registerItem(ItemID.drill, "Eu", 30000, 1, "tool", true);
ChargeItemRegistry.registerItem(ItemID.diamondDrill, "Eu", 30000, 1, "tool", true);
ChargeItemRegistry.registerItem(ItemID.iridiumDrill, "Eu", 1000000, 3, "tool", true);

Item.registerNameOverrideFunction(ItemID.drill, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.diamondDrill, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.iridiumDrill, function(item, name){
	name = ItemName.showItemStorage(item, name);
	var mode = item.extra? item.extra.getInt("mode") : 0;
	switch(mode){
		case 0:
			name += "\n" + Translation.translate("Mode: ") + Translation.translate("Fortune III");
		break;
		case 1:
			name += "\n" + Translation.translate("Mode: ") + Translation.translate("Silk Touch");
		break;
		case 2:
			name += "\n" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Fortune III");
		break;
		case 3:
			name += "\n" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Silk Touch");
		break;
	}
	
	return name;
});


Recipes.addShaped({id: ItemID.drill, count: 1, data: Item.getMaxDamage(ItemID.drill)}, [
	" p ",
	"ppp",
	"pxp"
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShaped({id: ItemID.diamondDrill, count: 1, data: Item.getMaxDamage(ItemID.diamondDrill)}, [
	" a ",
	"ada"
], ['d', ItemID.drill, -1, 'a', 264, 0], ChargeItemRegistry.transportEnergy);

Recipes.addShaped({id: ItemID.iridiumDrill, count: 1, data: Item.getMaxDamage(ItemID.iridiumDrill)}, [
	" a ",
	"ada",
	" e "
], ['d', ItemID.diamondDrill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], ChargeItemRegistry.transportEnergy);

UIbuttons.setToolButton(ItemID.iridiumDrill, "button_switch");

UIbuttons.registerSwitchFunction(ItemID.iridiumDrill, function(item){
	var extra = item.extra;
	if(!extra){
		extra = new ItemExtraData();
	}
	var mode = (extra.getInt("mode")+1)%4;
	extra.putInt("mode", mode);
	switch(mode){
	case 0:
		Game.message("§e" + Translation.translate("Mode: ") + Translation.translate("Fortune III"));
	break;
	case 1:
		Game.message("§9" + Translation.translate("Mode: ") + Translation.translate("Silk Touch"));
	break;
	case 2:
		Game.message("§c" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Fortune III"));
	break;
	case 3:
		Game.message("§2" + Translation.translate("Mode: ") + "3x3 " + Translation.translate("Silk Touch"));
	break;
	}
	Player.setCarriedItem(item.id, 1, item.data, extra);
});

ToolType.drill = {
	damage: 0,
	blockTypes: ["stone", "dirt"],
	onDestroy: function(item, coords, block){
		if(Block.getDestroyTime(block.id) > 0){
			ICTool.dischargeItem(item, this.toolMaterial.energyConsumption);
		}
		return true;
	},
	onBroke: function(item){return true;},
	onAttack: function(item, mob){
		ICTool.dischargeItem(item, this.toolMaterial.energyConsumption);
		return true;
	},
	calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
		if(item.data + this.toolMaterial.energyConsumption <= Item.getMaxDamage(item.id)){
			return destroyTime;
		}
		return params.base;
	},
	useItem: function(coords, item, block){
		var place = coords.relative;
		var blockID = World.getBlockID(place.x, place.y, place.z);
		if(canTileBeReplaced(blockID)){
			for(var i = 9; i < 45; i++){
				var slot = Player.getInventorySlot(i);
				if(slot.id==50){
					slot.count--;
					if(!slot.count) slot.id = 0;
					Player.setInventorySlot(i, slot.id, slot.count, 0);
					if(block.id >= 8192 || !GenerationUtils.isTransparentBlock(block.id)){
						World.setBlock(place.x, place.y, place.z, 50, (6 - coords.side)%6);
					} else {
						block = World.getBlock(place.x, place.y - 1, place.z);
						if(!GenerationUtils.isTransparentBlock(block.id) || ((block.id == 44 || block.id == 158 || block.id == 182) && block.data > 7)){
							World.setBlock(place.x, place.y, place.z, 50, 5);
						}
					}
					break;
				}
			}
		}
	}
}

ToolAPI.setTool(ItemID.drill, {energyConsumption: 50, level: 3, efficiency: 8, damage: 3},  ToolType.drill);
ToolAPI.setTool(ItemID.diamondDrill, {energyConsumption: 80, level: 4, efficiency: 16, damage: 4}, ToolType.drill);
ToolAPI.setTool(ItemID.iridiumDrill, {energyConsumption: 800, level: 5, efficiency: 24, damage: 5}, {
	damage: 0,
	blockTypes: ["stone", "dirt"],
	modifyEnchant: function(enchant, item){
		var mode = item.extra? item.extra.getInt("mode") : 0;
		if(mode%2){
		enchant.silk = true;}
		else{
		enchant.fortune = 3;}
	},
	onDestroy: ToolType.drill.onDestroy,
	onBroke: function(item){return true;},
	onAttack: ToolType.drill.onAttack,
	calcDestroyTime: function(item, coords, block, params, destroyTime){
		if(item.data + 800 <= Item.getMaxDamage(item.id)){
			var mode = item.extra? item.extra.getInt("mode") : 0;
			var material = ToolAPI.getBlockMaterialName(block.id);
			if(mode >= 2 && (material == "dirt" || material == "stone")){
				var side = coords.side;
				var X = 1;
				var Y = 1;
				var Z = 1;
				if(side==BlockSide.EAST || side==BlockSide.WEST){
				X = 0;}
				if(side==BlockSide.UP || side==BlockSide.DOWN){
				Y = 0;}
				if(side==BlockSide.NORTH || side==BlockSide.SOUTH){
				Z = 0;}
				for(var xx = coords.x - X; xx <= coords.x + X; xx++){
					for(var yy = coords.y - Y; yy <= coords.y + Y; yy++){
						for(var zz = coords.z - Z; zz <= coords.z + Z; zz++){
							var blockID = World.getBlockID(xx, yy, zz);
							var material = ToolAPI.getBlockMaterialName(blockID);
							if(material == "dirt" || material == "stone"){
								destroyTime = Math.max(destroyTime, Block.getDestroyTime(blockID) / material.multiplier / 24);
							}
						}
					}
				}
			}
			return destroyTime;
		}
		return params.base;
	},
	destroyBlock: function(coords, side, item, block){
		var mode = item.extra? item.extra.getInt("mode") : 0;
		var material = ToolAPI.getBlockMaterialName(block.id);
		if(mode >= 2 && (material == "dirt" || material == "stone") && item.data + 800 <= Item.getMaxDamage(item.id)){
			var X = 1;
			var Y = 1;
			var Z = 1;
			if(side==BlockSide.EAST || side==BlockSide.WEST){
			X = 0;}
			if(side==BlockSide.UP || side==BlockSide.DOWN){
			Y = 0;}
			if(side==BlockSide.NORTH || side==BlockSide.SOUTH){
			Z = 0;}
			for(var xx = coords.x - X; xx <= coords.x + X; xx++){
				for(var yy = coords.y - Y; yy <= coords.y + Y; yy++){
					for(var zz = coords.z - Z; zz <= coords.z + Z; zz++){
						if(xx == coords.x && yy == coords.y && zz == coords.z){
							continue;
						}
						blockID = World.getBlockID(xx, yy, zz);
						var material = ToolAPI.getBlockMaterialName(blockID);
						if(material == "dirt" || material == "stone"){
							item.data += 800;
							World.destroyBlock(xx, yy, zz, true);
							if(item.data + 800 >= Item.getMaxDamage(item.id)){
								Player.setCarriedItem(item.id, 1, item.data, item.extra);
								return;
							}
						}
					}
				}
			}
			Player.setCarriedItem(item.id, 1, item.data, item.extra);
		}
	},
	useItem: ToolType.drill.useItem
});
