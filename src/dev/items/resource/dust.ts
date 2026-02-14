// Dust
ItemRegistry.createItem("dustCopper", {name: "copper_dust", icon: "dust_copper"});
ItemRegistry.createItem("dustTin", {name: "tin_dust", icon: "dust_tin"});
ItemRegistry.createItem("dustBronze", {name: "bronze_dust", icon: "dust_bronze"});
ItemRegistry.createItem("dustIron", {name: "iron_dust", icon: "dust_iron"});
ItemRegistry.createItem("dustSteel", {name: "steel_dust", icon: "dust_steel"});
ItemRegistry.createItem("dustLead", {name: "lead_dust", icon: "dust_lead"});
ItemRegistry.createItem("dustGold", {name: "gold_dust", icon: "dust_gold"});
ItemRegistry.createItem("dustSilver", {name: "silver_dust", icon: "dust_silver"});
ItemRegistry.createItem("dustStone", {name: "stone_dust", icon: "dust_stone"});
ItemRegistry.createItem("dustCoal", {name: "coal_dust", icon: "dust_coal"});
ItemRegistry.createItem("dustSulfur", {name: "sulfur_dust", icon: "dust_sulfur"});
ItemRegistry.createItem("dustLapis", {name: "lapis_dust", icon: "dust_lapis"});
ItemRegistry.createItem("dustDiamond", {name: "diamond_dust", icon: "dust_diamond"});
ItemRegistry.createItem("dustEnergium", {name: "energium_dust", icon: "dust_energium"});

Item.addCreativeGroup("dust", Translation.translate("Dusts"), [
	ItemID.dustCopper,
	ItemID.dustTin,
	ItemID.dustBronze,
	ItemID.dustIron,
	ItemID.dustSteel,
	ItemID.dustLead,
	ItemID.dustGold,
	ItemID.dustSilver,
	ItemID.dustStone,
	ItemID.dustCoal,
	ItemID.dustSulfur,
	ItemID.dustLapis,
	ItemID.dustDiamond,
	ItemID.dustEnergium
]);

// Small Dust
ItemRegistry.createItem("dustSmallCopper", {name: "small_copper_dust", icon: "dust_small_copper"});
ItemRegistry.createItem("dustSmallTin", {name: "small_tin_dust", icon: "dust_small_tin"});
ItemRegistry.createItem("dustSmallBronze", {name: "small_bronze_dust", icon: "dust_small_bronze"});
ItemRegistry.createItem("dustSmallIron", {name: "small_iron_dust", icon: "dust_small_iron"});
ItemRegistry.createItem("dustSmallSteel", {name: "small_steel_dust", icon: "dust_small_steel"});
ItemRegistry.createItem("dustSmallLead", {name: "small_lead_dust", icon: "dust_small_lead"});
ItemRegistry.createItem("dustSmallGold", {name: "small_gold_dust", icon: "dust_small_gold"});
ItemRegistry.createItem("dustSmallSilver", {name: "small_silver_dust", icon: "dust_small_silver"});
ItemRegistry.createItem("dustSmallSulfur", {name: "small_sulfur_dust", icon: "dust_small_sulfur"});

Item.addCreativeGroup("dustSmall", Translation.translate("Small Dusts"), [
	ItemID.dustSmallCopper,
	ItemID.dustSmallTin,
	ItemID.dustSmallBronze,
	ItemID.dustSmallIron,
	ItemID.dustSmallSteel,
	ItemID.dustSmallLead,
	ItemID.dustSmallGold,
	ItemID.dustSmallSilver,
	ItemID.dustSmallSulfur
]);

// Recipes
Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.dustEnergium, count: 9, data: 0}, [
		"xax",
		"axa",
		"xax",
	], ['x', 331, 0, 'a', ItemID.dustDiamond, 0]);

	Recipes.addShapeless({id: ItemID.dustBronze, count: 4, data: 0}, [
		{id: ItemID.crushedCopper, data: 0},
		{id: ItemID.crushedCopper, data: 0},
		{id: ItemID.crushedCopper, data: 0},
		{id: ItemID.crushedTin, data: 0}
	]);

	Recipes.addShapeless({id: ItemID.dustBronze, count: 4, data: 0}, [
		{id: ItemID.crushedPurifiedCopper, data: 0},
		{id: ItemID.crushedPurifiedCopper, data: 0},
		{id: ItemID.crushedPurifiedCopper, data: 0},
		{id: ItemID.crushedPurifiedTin, data: 0}
	]);

	Recipes.addShapeless({id: ItemID.dustBronze, count: 4, data: 0}, [
		{id: ItemID.dustCopper, data: 0},
		{id: ItemID.dustCopper, data: 0},
		{id: ItemID.dustCopper, data: 0},
		{id: ItemID.dustTin, data: 0}
	]);

	const dustNames = ["Copper", "Tin", "Bronze", "Iron", "Steel", "Lead", "Gold", "Silver", "Sulfur"];

	for (const name of dustNames) {
		Recipes.addShaped({id: ItemID["dust" + name], count: 1, data: 0}, [
			"xxx",
			"xxx",
			"xxx",
		], ['x', ItemID["dustSmall" + name], 0]);
	}

	// alternative
	Recipes.addShaped({id: 348, count: 1, data: 0}, [
		"xax",
		"axa",
		"xax",
	], ['x', 331, 0, 'a', ItemID.dustGold, 0]);

	Recipes.addShaped({id: 289, count: 3, data: 0}, [
		"xax",
		"axa",
		"xax",
	], ['x', 331, 0, 'a', ItemID.dustCoal, 0]);
});