IDRegistry.genItemID("casingCopper");
Item.createItem("casingCopper", "Copper Casing", {name: "casing_copper"});

IDRegistry.genItemID("casingTin");
Item.createItem("casingTin", "Tin Casing", {name: "casing_tin"});

IDRegistry.genItemID("casingBronze");
Item.createItem("casingBronze", "Bronze Casing", {name: "casing_bronze"});

IDRegistry.genItemID("casingIron");
Item.createItem("casingIron", "Iron Casing", {name: "casing_iron"});

IDRegistry.genItemID("casingSteel");
Item.createItem("casingSteel", "Steel Casing", {name: "casing_steel"});

IDRegistry.genItemID("casingGold");
Item.createItem("casingGold", "Gold Casing", {name: "casing_gold"});

IDRegistry.genItemID("casingLead");
Item.createItem("casingLead", "Lead Casing", {name: "casing_lead"});

// recipes
Callback.addCallback("PreLoaded", function(){
	ICTool.addRecipe({id: ItemID.casingCopper, count: 2, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingTin, count: 2, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingBronze, count: 2, data: 0}, [{id: ItemID.plateBronze, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingIron, count: 2, data: 0}, [{id: ItemID.plateIron, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingGold, count: 2, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.craftingHammer);
	ICTool.addRecipe({id: ItemID.casingLead, count: 2, data: 0}, [{id: ItemID.plateLead, data: 0}], ItemID.craftingHammer);
});