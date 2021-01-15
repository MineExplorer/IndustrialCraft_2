ItemRegistry.createItem("iridiumChunk", {name: "Iridium", icon: "iridium", rarity: EnumRarity.RARE});
ItemRegistry.createItem("plateReinforcedIridium", {name: "Iridium Reinforced Plate", icon: "plate_reinforced_iridium", rarity: EnumRarity.RARE});
ItemRegistry.createItem("plateAlloy", {name: "Alloy Plate", icon: "plate_alloy"});
ItemRegistry.createItem("carbonFibre", {name: "Carbon Fibre", icon: "carbon_fibre"});
ItemRegistry.createItem("carbonMesh", {name: "Carbon Mesh", icon: "carbon_mesh"});
ItemRegistry.createItem("carbonPlate", {name: "Carbon Plate", icon: "carbon_plate"});
ItemRegistry.createItem("coalBall", {name: "Coal Ball", icon: "coal_ball"});
ItemRegistry.createItem("coalBlock", {name: "Coal Block", icon: "coal_block"});
ItemRegistry.createItem("coalChunk", {name: "Coal Chunk", icon: "coal_chunk"});

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

Callback.addCallback("PreLoaded", function() {
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