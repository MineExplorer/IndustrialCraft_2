ItemRegistry.createItem("casingCopper", {name: "copper_casing", icon: "casing_copper"});
ItemRegistry.createItem("casingTin", {name: "tin_casing", icon: "casing_tin"});
ItemRegistry.createItem("casingBronze", {name: "bronze_casing", icon: "casing_bronze"});
ItemRegistry.createItem("casingIron", {name: "iron_casing", icon: "casing_iron"});
ItemRegistry.createItem("casingSteel", {name: "steel_casing", icon: "casing_steel"});
ItemRegistry.createItem("casingGold", {name: "gold_casing", icon: "casing_gold"});
ItemRegistry.createItem("casingLead", {name: "lead_casing", icon: "casing_lead"});
ItemRegistry.createItem("casingSilver", {name: "silver_casing", icon: "casing_silver"});

// creative group
Item.addCreativeGroup("casingMetal", Translation.translate("Metal Casings"), [
	ItemID.casingCopper,
	ItemID.casingTin,
	ItemID.casingBronze,
	ItemID.casingIron,
	ItemID.casingSteel,
	ItemID.casingGold,
	ItemID.casingLead,
	ItemID.casingSilver
]);

// recipes
Callback.addCallback("PreLoaded", function() {
	ICTool.addRecipe({id: ItemID.casingCopper, count: 2, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingTin, count: 2, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingBronze, count: 2, data: 0}, [{id: ItemID.plateBronze, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingIron, count: 2, data: 0}, [{id: ItemID.plateIron, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingSteel, count: 2, data: 0}, [{id: ItemID.plateSteel, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingGold, count: 2, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingLead, count: 2, data: 0}, [{id: ItemID.plateLead, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingSilver, count: 2, data: 0}, [{id: ItemID.plateSilver, data: 0}], ItemID.craftingHammer);
});