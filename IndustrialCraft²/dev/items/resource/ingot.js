IDRegistry.genItemID("ingotCopper");
Item.createItem("ingotCopper", "Copper Ingot", {name: "ingot_copper"});

IDRegistry.genItemID("ingotTin");
Item.createItem("ingotTin", "Tin Ingot", {name: "ingot_tin"});

IDRegistry.genItemID("ingotBronze");
Item.createItem("ingotBronze", "Bronze Ingot", {name: "ingot_bronze"});

IDRegistry.genItemID("ingotSteel");
Item.createItem("ingotSteel", "Steel Ingot", {name: "ingot_steel"});

IDRegistry.genItemID("ingotLead");
Item.createItem("ingotLead", "Lead Ingot", {name: "ingot_lead"});

IDRegistry.genItemID("ingotSilver");
Item.createItem("ingotSilver", "Silver Ingot", {name: "ingot_silver"});

Callback.addCallback("PreLoaded", function(){
	// from ore
	Recipes.addFurnace(BlockID.oreCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(BlockID.oreTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(BlockID.oreLead, ItemID.ingotLead, 0);
	// from crushed ore
	Recipes.addFurnace(ItemID.crushedIron, 265, 0);
	Recipes.addFurnace(ItemID.crushedGold, 266, 0);
	Recipes.addFurnace(ItemID.crushedCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.crushedTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.crushedLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.crushedSilver, ItemID.ingotSilver, 0);
	// from purified ore
	Recipes.addFurnace(ItemID.crushedPurifiedIron, 265, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedGold, 266, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.crushedPurifiedSilver, ItemID.ingotSilver, 0);
	// from dust
	Recipes.addFurnace(ItemID.dustCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.dustTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.dustLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.dustBronze, ItemID.ingotBronze, 0);
	Recipes.addFurnace(ItemID.dustSteel, ItemID.ingotSteel, 0);
	Recipes.addFurnace(ItemID.dustIron, 265, 0);
	Recipes.addFurnace(ItemID.dustGold, 266, 0);
	Recipes.addFurnace(ItemID.dustSilver, ItemID.ingotSilver, 0);
	// from plates
	Recipes.addFurnace(ItemID.plateCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.plateTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.plateBronze, ItemID.ingotBronze, 0);
	Recipes.addFurnace(ItemID.plateSteel, ItemID.ingotSteel, 0);
	Recipes.addFurnace(ItemID.plateIron, 265, 0);
	Recipes.addFurnace(ItemID.plateGold, 266, 0);
	Recipes.addFurnace(ItemID.plateLead, ItemID.ingotLead, 0);
	
	// alternative
	Recipes.addShaped({id: 66, count: 12, data: 0}, [
		"a a",
		"axa",
		"a a"
	], ['x', 280, 0, 'a', ItemID.ingotBronze, 0]);
	
	Recipes.addShaped({id: 33, count: 1, data: 0}, [
		"ppp",
		"cbc",
		"cxc"
	], ['x', 331, 0, 'b', ItemID.ingotBronze, 0, 'c', 4, -1, 'p', 5, -1]);
});