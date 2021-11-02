ItemRegistry.createItem("fertilizer", {name: "fertilizer", icon: "fertilizer"});
ItemRegistry.createItem("weedEx", {name: "weed_ex", icon: "weed_ex", stack: 1, maxDamage: 64});

Callback.addCallback("PreLoaded", function() {
	const boneMeal: [string, number] = BlockEngine.getMainGameVersion() == 11 ? ["dye", 15] : ["bone_meal", 0];
	VanillaRecipe.addShapelessRecipe("fertilizer", {
		ingredients: [
			{ item: "item:scrap" },
			{ item: boneMeal[0], data: boneMeal[1] }
		],
		result: {
			item: "item:fertilizer",
			count: 2
		}
	}, true);

	VanillaRecipe.addShapelessRecipe("fertilizer_from_scrap", {
		ingredients: [
			{ item: "item:scrap" },
			{ item: "item:scrap" },
			{ item: "item:fertilizer" }
		],
		result: {
			item: "item:fertilizer",
			count: 2
		}
	}, true);

	VanillaRecipe.addShapelessRecipe("fertilizer_from_ashes", {
		ingredients: [
			{ item: "item:scrap" },
			{ item: "item:ashes" }
		],
		result: {
			item: "item:fertilizer",
			count: 2
		}
	}, true);

	Recipes.addShaped({id: ItemID.weedEx, count: 1, data: 0}, [
        "z",
        "x",
        "c"
    ], ['z', 331, 0, 'x', ItemID.grinPowder, 0, 'c', ItemID.cellEmpty, 0]);
});
