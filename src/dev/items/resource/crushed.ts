// Crushed Ore
ItemRegistry.createItem("crushedCopper", {name: "crushed_copper_ore", icon: "crushed_copper_ore"});
ItemRegistry.createItem("crushedTin", {name: "crushed_tin_ore", icon: "crushed_tin_ore"});
ItemRegistry.createItem("crushedIron", {name: "crushed_iron_ore", icon: "crushed_iron_ore"});
ItemRegistry.createItem("crushedLead", {name: "crushed_lead_ore", icon: "crushed_lead_ore"});
ItemRegistry.createItem("crushedGold", {name: "crushed_gold_ore", icon: "crushed_gold_ore"});
ItemRegistry.createItem("crushedSilver", {name: "crushed_silver_ore", icon: "crushed_silver_ore"});
ItemRegistry.createItem("crushedUranium", {name: "crushed_uranium_ore", icon: "crushed_uranium_ore"});

Item.addCreativeGroup("oreCrushed", Translation.translate("Crushed Ores"), [
	ItemID.crushedCopper,
	ItemID.crushedTin,
	ItemID.crushedIron,
	ItemID.crushedLead,
	ItemID.crushedGold,
	ItemID.crushedSilver,
	ItemID.crushedUranium
]);

// Purified Crushed Ore
ItemRegistry.createItem("crushedPurifiedCopper", {name: "purified_copper_ore", icon: "purified_copper_ore"});
ItemRegistry.createItem("crushedPurifiedTin", {name: "purified_tin_ore", icon: "purified_tin_ore"});
ItemRegistry.createItem("crushedPurifiedIron", {name: "purified_iron_ore", icon: "purified_iron_ore"});
ItemRegistry.createItem("crushedPurifiedLead", {name: "purified_lead_ore", icon: "purified_lead_ore"});
ItemRegistry.createItem("crushedPurifiedGold", {name: "purified_gold_ore", icon: "purified_gold_ore"});
ItemRegistry.createItem("crushedPurifiedSilver", {name: "purified_silver_ore", icon: "purified_silver_ore"});
ItemRegistry.createItem("crushedPurifiedUranium", {name: "purified_uranium_ore", icon: "purified_uranium_ore"});

Item.addCreativeGroup("oreCrushedPurified", Translation.translate("Purified Crushed Ores"), [
	ItemID.crushedPurifiedCopper,
	ItemID.crushedPurifiedTin,
	ItemID.crushedPurifiedIron,
	ItemID.crushedPurifiedLead,
	ItemID.crushedPurifiedGold,
	ItemID.crushedPurifiedSilver,
	ItemID.crushedPurifiedUranium
]);