ItemRegistry.createItem("casingCopper", {name: "copper_casing", icon: "casing_copper"});
ItemRegistry.createItem("casingTin", {name: "tin_casing", icon: "casing_tin"});
ItemRegistry.createItem("casingBronze", {name: "bronze_casing", icon: "casing_bronze"});
ItemRegistry.createItem("casingIron", {name: "iron_casing", icon: "casing_iron"});
ItemRegistry.createItem("casingSteel", {name: "steel_casing", icon: "casing_steel"});
ItemRegistry.createItem("casingGold", {name: "gold_casing", icon: "casing_gold"});
ItemRegistry.createItem("casingLead", {name: "lead_casing", icon: "casing_lead"});

// creative group
Item.addCreativeGroup("casingMetal", Translation.translate("Metal Casings"), [
	ItemID.casingCopper,
	ItemID.casingLead,
	ItemID.casingGold,
	ItemID.casingSteel,
	ItemID.casingIron,
	ItemID.casingBronze,
	ItemID.casingTin
]);

// recipes
Callback.addCallback("PreLoaded", function() {
	ICTool.addRecipe({id: ItemID.casingCopper, count: 2, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingTin, count: 2, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingBronze, count: 2, data: 0}, [{id: ItemID.plateBronze, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingIron, count: 2, data: 0}, [{id: ItemID.plateIron, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingGold, count: 2, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingLead, count: 2, data: 0}, [{id: ItemID.plateLead, data: 0}], ItemID.craftingHammer);
});