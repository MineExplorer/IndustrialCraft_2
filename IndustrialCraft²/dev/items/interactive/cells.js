IDRegistry.genItemID("cellEmpty");
IDRegistry.genItemID("cellWater");
IDRegistry.genItemID("cellLava");
Item.createItem("cellEmpty", "Cell", {name: "cell_empty"});
Item.createItem("cellWater", "Water Cell", {name: "cell_water"});
Item.createItem("cellLava", "Lava Cell", {name: "cell_lava"});
Item.setLiquidClip(ItemID.cellEmpty, true);
LiquidRegistry.registerItem("water", {id: ItemID.cellEmpty, data: 0}, {id: ItemID.cellWater, data: 0});
LiquidRegistry.registerItem("lava", {id: ItemID.cellEmpty, data: 0}, {id: ItemID.cellLava, data: 0});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.cellEmpty, count: 2, data: 1}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.casingTin, 0]);
});

Item.registerUseFunction("cellEmpty", function(coords, item, block){
	if(block.id==9 || block.id==11){
		World.setBlock(coords.x, coords.y, coords.z, 0);
		var item = Player.getCarriedItem();
		item.count--;
		if(!item.count){item.id = 0;}
		Player.setCarriedItem(item.id, item.count, 1);
		if(block.id==9){Player.addItemToInventory(ItemID.cellWater, 1);}
		else{Player.addItemToInventory(ItemID.cellLava, 1);}
	}
});
/*
Callback.addCallback("ItemUse", function(coords, item, block){
	if(item.id==ItemID.cellWater || item.id==ItemID.cellLava){
		var x = coords.relative.x
		var y = coords.relative.y
		var z = coords.relative.z
		var block = World.getBlockID(x,y,z)
		if(block==0){
			if(item.id==ItemID.cellWater){World.setBlock(x, y, z, 9);}
			else{World.setBlock(x, y, z, 11);}
			var item = Player.getCarriedItem();
			item.count--;
			if(!item.count) item.id = 0;
			Player.setCarriedItem(item.id, item.count, item.data);
			Player.addItemToInventory(ItemID.cellEmpty, 1);
		}
	}
});
*/