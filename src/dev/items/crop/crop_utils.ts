ItemRegistry.createItem("fertilizer", {name: "fertilizer", icon: "fertilizer"});
ItemRegistry.createItem("weedEx", {name: "weed_ex", icon: "weed_ex", stack: 1, maxDamage: 64});

Callback.addCallback("PreLoaded", function() {
	Recipes.addShapeless({id: ItemID.fertilizer, count: 2, data: 0}, [
		{id: ItemID.scrap, data: 0},
		IDConverter.getIDData("bone_meal")
	]);
	Recipes.addShapeless({id: ItemID.fertilizer, count: 2, data: 0}, [
		{id: ItemID.scrap, data: 0},
		{id: ItemID.ashes, data: 0}
	]);
	Recipes.addShapeless({id: ItemID.fertilizer, count: 2, data: 0}, [
		{id: ItemID.scrap, data: 0},
		{id: ItemID.scrap, data: 0},
		{id: ItemID.fertilizer, data: 0}
	]);

	Recipes.addShaped({id: ItemID.weedEx, count: 1, data: 0}, [
		"z",
		"x",
		"c"
	], ['z', 331, 0, 'x', ItemID.grinPowder, 0, 'c', ItemID.cellEmpty, 0]);
});
