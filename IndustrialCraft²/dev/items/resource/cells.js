IDRegistry.genItemID("cellEmpty");
Item.createItem("cellEmpty", "Cell", {name: "cell_empty"});
Item.setLiquidClip(ItemID.cellEmpty, true);

IDRegistry.genItemID("cellWater");
IDRegistry.genItemID("cellLava");
IDRegistry.genItemID("cellMatter");
IDRegistry.genItemID("cellBiomass");
IDRegistry.genItemID("cellBiogas");
IDRegistry.genItemID("cellAir");
Item.createItem("cellWater", "Water Cell", {name: "cell_water"});
Item.createItem("cellLava", "Lava Cell", {name: "cell_lava"});
Item.createItem("cellBiomass", "Biomass Cell", {name: "cell_biomass"});
Item.createItem("cellBiogas", "Biogas Cell", {name: "cell_biogas"});
//Item.createItem("cellMatter", "UU-Matter Cell", {name: "cell_uu_matter"});
Item.createItem("cellAir", "Compressed Air Cell", {name: "cell_air"});

LiquidRegistry.registerItem("water", {id: ItemID.cellEmpty, data: 0}, {id: ItemID.cellWater, data: 0});
LiquidRegistry.registerItem("lava", {id: ItemID.cellEmpty, data: 0}, {id: ItemID.cellLava, data: 0});
LiquidRegistry.registerItem("biomass", {id: ItemID.cellEmpty, data: 0}, {id: ItemID.cellBiomass, data: 0});
LiquidRegistry.registerItem("biogas", {id: ItemID.cellEmpty, data: 0}, {id: ItemID.cellBiogas, data: 0});

Recipes.addShaped({id: ItemID.cellEmpty, count: 1, data: 0}, [
	" x ",
	"xgx",
	" x "
], ['x', ItemID.casingTin, 0, 'g', 102, 0]);

Recipes.addShaped({id: 49, count: 1, data: 0}, [
	"aa",
	"bb"
], ['a', ItemID.cellLava, 0, 'b', ItemID.cellWater, 0]);

Item.registerUseFunction("cellEmpty",function(coords, item, block){
	if(block.id > 7 && block.id < 12 && block.data == 0){
		World.setBlock(coords.x, coords.y, coords.z, 0);
		if(block.id == 8 || block.id == 9){
		Player.addItemToInventory(ItemID.cellWater, 1);}
		else{
		Player.addItemToInventory(ItemID.cellLava, 1);}
		Player.decreaseCarriedItem(1);
	}
});

Item.registerUseFunction("cellWater", function(coords, item, block){
	var x = coords.relative.x
	var y = coords.relative.y
	var z = coords.relative.z
	var block = World.getBlockID(x,y,z)
	if(block == 0 || block > 7 && block < 12){
		World.setBlock(x, y, z, 8);
		Player.addItemToInventory(ItemID.cellEmpty, 1);
		Player.decreaseCarriedItem(1);
	}
});

Item.registerUseFunction("cellLava", function(coords, item, block){
	var x = coords.relative.x
	var y = coords.relative.y
	var z = coords.relative.z
	var block = World.getBlockID(x,y,z)
	if(block == 0 || block > 7 && block < 12){
		World.setBlock(x, y, z, 10);
		Player.addItemToInventory(ItemID.cellEmpty, 1);
		Player.decreaseCarriedItem(1);
	}
});