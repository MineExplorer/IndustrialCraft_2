ItemRegistry.createItem("iridiumChunk", {name: "iridium_chunk", icon: "iridium_chunk", rarity: EnumRarity.RARE});
ItemRegistry.createItem("plateReinforcedIridium", {name: "iridium_reinforced_plate", icon: "plate_reinforced_iridium", rarity: EnumRarity.RARE});
ItemRegistry.createItem("plateAlloy", {name: "alloy_plate", icon: "plate_alloy"});
ItemRegistry.createItem("carbonFibre", {name: "carbon_fibre", icon: "carbon_fibre"});
ItemRegistry.createItem("carbonMesh", {name: "carbon_mesh", icon: "carbon_mesh"});
ItemRegistry.createItem("carbonPlate", {name: "carbon_plate", icon: "carbon_plate"});
ItemRegistry.createItem("coalBall", {name: "coal_ball", icon: "coal_ball"});
ItemRegistry.createItem("coalBlock", {name: "coal_block", icon: "coal_block"});
ItemRegistry.createItem("coalChunk", {name: "coal_chunk", icon: "coal_chunk"});

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
	VanillaRecipe.addShapedRecipe("carbon_fibre", {
		pattern: [
			"XX",
			"XX"
		],
		key: {
			"X": { item: "item:dustCoal" }
		},
		result: {
			item: "item:carbonFibre"
		}
	}, true);

	VanillaRecipe.addShapedRecipe("carbon_mesh", {
		pattern: [
			"X",
			"X"
		],
		key: {
			"X": { item: "item:carbonFibre" }
		},
		result: {
			item: "item:carbonMesh"
		}
	}, true);

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