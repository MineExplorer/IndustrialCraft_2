ItemRegistry.createItem("densePlateCopper", {name: "dense_copper_plate", icon: "dense_plate_copper"});
ItemRegistry.createItem("densePlateTin", {name: "dense_tin_plate", icon: "dense_plate_tin"});
ItemRegistry.createItem("densePlateBronze", {name: "dense_bronze_plate", icon: "dense_plate_bronze"});
ItemRegistry.createItem("densePlateIron", {name: "dense_iron_plate", icon: "dense_plate_iron"});
ItemRegistry.createItem("densePlateSteel", {name: "dense_steel_plate", icon: "dense_plate_steel"});
ItemRegistry.createItem("densePlateGold", {name: "dense_gold_plate", icon: "dense_plate_gold"});
ItemRegistry.createItem("densePlateLead", {name: "dense_lead_plate", icon: "dense_plate_lead"});
ItemRegistry.createItem("densePlateSilver", {name: "dense_silver_plate", icon: "dense_plate_silver"});

Item.addCreativeGroup("plateDense", Translation.translate("Desne Plates"), [
	ItemID.densePlateCopper,
	ItemID.densePlateTin,
	ItemID.densePlateBronze,
	ItemID.densePlateIron,
	ItemID.densePlateSteel,
	ItemID.densePlateGold,
	ItemID.densePlateLead,
	ItemID.densePlateSilver
]);