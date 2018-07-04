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
	Recipes.addShaped({id: ItemID.cellEmpty, count: 2, data: 0}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.casingTin, 0]);
	
	Recipes.addShaped({id: 49, count: 1, data: 0}, [
		"aa",
		"bb"
	], ['a', ItemID.cellLava, 0, 'b', ItemID.cellWater, 0]);
});

Item.registerUseFunction("cellEmpty", function(coords, item, block){
	if(block.id >= 8 && block.id <= 11 && block.data == 0){
		World.setBlock(coords.x, coords.y, coords.z, 0);
		item.count--;
		if(!item.count){item.id = 0;}
		Player.setCarriedItem(item.id, item.count);
		if(block.id==8 || block.id==9){Player.addItemToInventory(ItemID.cellWater, 1);}
		else{Player.addItemToInventory(ItemID.cellLava, 1);}
	}
});

Item.registerUseFunction("cellWater", function(coords, item, block){
	var x = coords.relative.x
	var y = coords.relative.y
	var z = coords.relative.z
	var block = World.getBlockID(x,y,z)
	if(block==0){
		World.setBlock(x, y, z, 8);
		item.count--;
		if(!item.count) item.id = 0;
		Player.setCarriedItem(item.id, item.count, item.data);
		Player.addItemToInventory(ItemID.cellEmpty, 1);
	}
});

Item.registerUseFunction("cellLava", function(coords, item, block){
	var x = coords.relative.x
	var y = coords.relative.y
	var z = coords.relative.z
	var block = World.getBlockID(x,y,z)
	if(block==0){
		World.setBlock(x, y, z, 10);
		item.count--;
		if(!item.count) item.id = 0;
		Player.setCarriedItem(item.id, item.count, item.data);
		Player.addItemToInventory(ItemID.cellEmpty, 1);
	}
});
