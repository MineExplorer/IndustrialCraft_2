IDRegistry.genItemID("drill");
IDRegistry.genItemID("diamondDrill");
IDRegistry.genItemID("iridiumDrill");
Item.createItem("drill", "Mining Drill", {name: "drill", meta: 0}, {stack: 1});
Item.createItem("diamondDrill", "Diamond Drill", {name: "drill", meta: 1}, {stack: 1});
Item.createItem("iridiumDrill", "Iridium Drill", {name: "drill", meta: 2}, {stack: 1});
//Item.setGlint(ItemID.iridiumDrill, true);
ChargeItemRegistry.registerItem(ItemID.drill, 30000, 0, true, true);
ChargeItemRegistry.registerItem(ItemID.diamondDrill, 30000, 0, true, true);
ChargeItemRegistry.registerItem(ItemID.iridiumDrill, 1000000, 2, true, true);

Item.registerNameOverrideFunction(ItemID.drill, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.diamondDrill, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.iridiumDrill, function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = Math.min(energyStorage - item.data + 1, energyStorage);
	if(energyStored==0){return "§b" + name;}
	name = "§b" + name + "\n§7" + energyStored + "/" + energyStorage + " Eu";
	switch(IDrillMode){
		case 0:
			name += "\nFortune III mode";
		break;
		case 1:
			name += "\nSilk Touch mode";
		break;
		case 2:
			name += "\nc3x3 Fortune III mode";
		break;
		case 3:
			name += "\n3x3 Silk Touch mode";
		break;
	}
	return name;
});

ToolType.drill = {
    damage: 0,
    blockTypes: ["stone", "dirt"],
    onDestroy: function(item){
        item.data = Math.min(item.data + this.toolMaterial.energyConsumption - 1, Item.getMaxDamage(item.id));
    },
    onBroke: function(item){return true;},
    onAttack: function(item, mob){
        item.data = Math.min(item.data + this.toolMaterial.energyConsumption, Item.getMaxDamage(item.id));
    },
    calcDestroyTime: function(item, block, coords, params, destroyTime, enchant){
        if(item.data + this.toolMaterial.energyConsumption <= Item.getMaxDamage(item.id)){
            return destroyTime;
        }
        else{
            return params.base;
        }
    }
}

var IDrillMode = 0;
var dirtBlocksDrop = {13:318, 60:3, 110:3, 198:3, 243:3};
ToolAPI.setTool(ItemID.drill, {energyConsumption: 50, level: 3, efficiency: 8, damage: 3},  ToolType.drill);
ToolAPI.setTool(ItemID.diamondDrill, {energyConsumption: 80, level: 4, efficiency: 16, damage: 4}, ToolType.drill);
ToolAPI.setTool(ItemID.iridiumDrill, {energyConsumption: 800, level: 5, efficiency: 24, damage: 5}, {
    enchantType: Native.EnchantType.pickaxe,
    damage: 0,
    blockTypes: ["stone", "dirt"],
	modifyEnchant: function(enchant){
		if(IDrillMode%2){enchant.silk = 1;}
		else{enchant.fortune = 3;}
	},
	onDestroy: function(item){
        item.data = Math.min(item.data + this.toolMaterial.energyConsumption - 1, Item.getMaxDamage(item.id));
    },
    onBroke: function(item){return true;},
    onAttack: function(item, mob){
        item.data = Math.min(item.data + this.toolMaterial.energyConsumption, Item.getMaxDamage(item.id));
    },
    calcDestroyTime: function(item, block, coords, params, destroyTime, enchant){
        if(item.data + this.toolMaterial.energyConsumption <= Item.getMaxDamage(item.id)){
			var material = ToolAPI.getBlockMaterial(block.id) || {};
			material = material.name;
			if(IDrillMode > 1 && (material == "dirt" || material == "stone")){
				destroyTime = 0;
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
							var material = ToolAPI.getBlockMaterial(blockID) || {};
							if(material.name == "dirt" || material.name == "stone"){
								destroyTime += Block.getDestroyTime(blockID) / material.multiplier * 1.5;
							}
						}
					}
				}
				destroyTime /= 24;
			}
            return destroyTime;
        }
        else{
            return params.base;
        }
    },
    destroyBlock: function(coords, side, item, block){
        if(IDrillMode > 1 && item.data + 800 <= Item.getMaxDamage(item.id)){
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
                        blockID = World.getBlockID(xx, yy, zz);
                        var material = ToolAPI.getBlockMaterial(blockID) || {};
                        if(material.name == "dirt" || material.name == "stone"){
                            item.data += 800;
                            if(IDrillMode==3 || material == "stone"){
                                World.destroyBlock(xx, yy, zz, true);
                            }else{
                                drop = dirtBlocksDrop[blockID];
                                if(drop){
                                    World.destroyBlock(xx, yy, zz, false);
                                    World.drop(xx+0.5, yy+0.5, zz+0.5, drop, 1);
                                }
                                else{World.destroyBlock(xx, yy, zz, true);}
                            }
                        }
                        if(item.data + 800 >= Item.getMaxDamage(item.id)){
                            Player.setCarriedItem(item.id, 1, item.data, item.enchant);
                            return;
                        }
                    }
                }
            }
            Player.setCarriedItem(item.id, 1, item.data, item.enchant);
        }
    },
    useItem: function(coords, item, block){
        if(Entity.getSneaking(player)){
            IDrillMode = (IDrillMode+1)%4;
            switch(IDrillMode){
            case 0:
                //var enchant = {type: Enchantment.FORTUNE, level: 3};
                Game.message("§eFortune III mode");
            break;
            case 1:
                //var enchant = {type: Enchantment.SILK_TOUCH, level: 1};
                Game.message("§9Silk Touch mode");
            break;
            case 2:
                //var enchant = {type: Enchantment.FORTUNE, level: 3};
                Game.message("§c3x3 Fortune III mode");
            break;
            case 3:
                //var enchant = {type: Enchantment.SILK_TOUCH, level: 1};
                Game.message("§23x3 Silk Touch mode");
            break;
            }
            //Player.setCarriedItem(item.id, 1, item.data, enchant);
            Player.setCarriedItem(item.id, 1, item.data);
        }
    }
});


Recipes.addShaped({id: ItemID.drill, count: 1, data: Item.getMaxDamage(ItemID.drill)}, [
    " p ",
    "ppp",
    "pxp"
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShaped({id: ItemID.diamondDrill, count: 1, data: Item.getMaxDamage(ItemID.diamondDrill)}, [
    " a ",
    "ada"
], ['d', ItemID.drill, -1, 'a', 264, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.iridiumDrill, count: 1, data: Item.getMaxDamage(ItemID.iridiumDrill)}, [
    " a ",
    "ada",
    " e "
], ['d', ItemID.diamondDrill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], RECIPE_FUNC_TRANSPORT_ENERGY);