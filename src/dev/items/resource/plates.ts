ItemRegistry.createItem("plateCopper", {name: "copper_plate", icon: "plate_copper"});
ItemRegistry.createItem("plateTin", {name: "tin_plate", icon: "plate_tin"});
ItemRegistry.createItem("plateBronze", {name: "bronze_plate", icon: "plate_bronze"});
ItemRegistry.createItem("plateIron", {name: "iron_plate", icon: "plate_iron"});
ItemRegistry.createItem("plateSteel", {name: "steel_plate", icon: "plate_steel"});
ItemRegistry.createItem("plateGold", {name: "gold_plate", icon: "plate_gold"});
ItemRegistry.createItem("plateLead", {name: "lead_plate", icon: "plate_lead"});
ItemRegistry.createItem("plateSilver", {name: "silver_plate", icon: "plate_silver"});
ItemRegistry.createItem("plateLapis", {name: "lapis_plate", icon: "plate_lapis"});

Item.addCreativeGroup("plate", Translation.translate("Plates"), [
	ItemID.plateCopper,
	ItemID.plateTin,
	ItemID.plateBronze,
	ItemID.plateIron,
	ItemID.plateSteel,
	ItemID.plateGold,
	ItemID.plateLead,
	ItemID.plateSilver,
	ItemID.plateLapis
]);

// recipes
Callback.addCallback("PreLoaded", function() {
	ICTool.addRecipe({id: ItemID.plateCopper, count: 1, data: 0}, [{id: ItemID.ingotCopper, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateTin, count: 1, data: 0}, [{id: ItemID.ingotTin, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateBronze, count: 1, data: 0}, [{id: ItemID.ingotBronze, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateIron, count: 1, data: 0}, [{id: 265, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateGold, count: 1, data: 0}, [{id: 266, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateLead, count: 1, data: 0}, [{id: ItemID.ingotLead, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.plateSilver, count: 1, data: 0}, [{id: ItemID.ingotSilver, data: 0}], ItemID.craftingHammer);
});