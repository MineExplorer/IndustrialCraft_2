IDRegistry.genItemID("iridiumChunk");
Item.createItem("iridiumChunk", "Iridium", {name: "iridium"});
ItemName.setRarity(ItemID.iridiumChunk, 2, true);

IDRegistry.genItemID("plateReinforcedIridium");
Item.createItem("plateReinforcedIridium", "Iridium Reinforced Plate", {name: "plate_reinforced_iridium"});
ItemName.setRarity(ItemID.plateReinforcedIridium, 2, true);

IDRegistry.genItemID("plateAlloy");
Item.createItem("plateAlloy", "Alloy Plate", {name: "plate_alloy"});

IDRegistry.genItemID("carbonFibre");
Item.createItem("carbonFibre", "Carbon Fibre", {name: "carbon_fibre"});

IDRegistry.genItemID("carbonMesh");
Item.createItem("carbonMesh", "Carbon Mesh", {name: "carbon_mesh"});

IDRegistry.genItemID("carbonPlate");
Item.createItem("carbonPlate", "Carbon Plate", {name: "carbon_plate"});

IDRegistry.genItemID("coalBall");
Item.createItem("coalBall", "Coal Ball", {name: "coal_ball"});

IDRegistry.genItemID("coalBlock");
Item.createItem("coalBlock", "Coal Block", {name: "coal_block"});

IDRegistry.genItemID("coalChunk");
Item.createItem("coalChunk", "Coal Chunk", {name: "coal_chunk"});

Item.addCreativeGroup("ic2_material", Translation.translate("Materials"), [
	ItemID.iridiumChunk,
	ItemID.plateReinforcedIridium,
	ItemID.plateAlloy,
	ItemID.carbonFibre,
	ItemID.carbonMesh,
	ItemID.carbonPlate,
	ItemID.coalBall,
	ItemID.coalBlock,
	ItemID.coalChunk
]);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.carbonFibre, count: 1, data: 0}, [
		"xx",
		"xx"
	], ['x', ItemID.dustCoal, 0]);
	
	Recipes.addShaped({id: ItemID.carbonMesh, count: 1, data: 0}, [
		"x",
		"x"
	], ['x', ItemID.carbonFibre, 0]);
	
	Recipes.addShaped({id: ItemID.coalBall, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xxx"
	], ['x', ItemID.dustCoal, 0, '#', 318, 0]);
	
	Recipes.addShaped({id: ItemID.coalChunk, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xxx"
	], ['x', ItemID.coalBlock, -1, '#', 49, -1]);
	
	Recipes.addShaped({id: ItemID.plateReinforcedIridium, count: 1, data: 0}, [
		"xax",
		"a#a",
		"xax"
	], ['x', ItemID.iridiumChunk, 0, '#', 264, 0, 'a', ItemID.plateAlloy, 0]);
});