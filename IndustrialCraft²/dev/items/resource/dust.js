//Dust
IDRegistry.genItemID("dustCopper");
Item.createItem("dustCopper", "Copper Dust", {name: "dust_copper"});

IDRegistry.genItemID("dustTin");
Item.createItem("dustTin", "Tin Dust", {name: "dust_tin"});

IDRegistry.genItemID("dustBronze");
Item.createItem("dustBronze", "Bronze Dust", {name: "dust_bronze"});

IDRegistry.genItemID("dustIron");
Item.createItem("dustIron", "Iron Dust", {name: "dust_iron"});

IDRegistry.genItemID("dustSteel");
Item.createItem("dustSteel", "Steel Dust", {name: "dust_steel"});

IDRegistry.genItemID("dustLead");
Item.createItem("dustLead", "Lead Dust", {name: "dust_lead"});

IDRegistry.genItemID("dustGold");
Item.createItem("dustGold", "Gold Dust", {name: "dust_gold"});

IDRegistry.genItemID("dustSilver");
Item.createItem("dustSilver", "Silver Dust", {name: "dust_silver"});

IDRegistry.genItemID("dustStone");
Item.createItem("dustStone", "Stone Dust", {name: "dust_stone"});

IDRegistry.genItemID("dustCoal");
Item.createItem("dustCoal", "Coal Dust", {name: "dust_coal"});

IDRegistry.genItemID("dustSulfur");
Item.createItem("dustSulfur", "Sulfur Dust", {name: "dust_sulfur"});

IDRegistry.genItemID("dustLapis");
Item.createItem("dustLapis", "Lapis Dust", {name: "dust_lapis"});

IDRegistry.genItemID("dustDiamond");
Item.createItem("dustDiamond", "Diamond Dust", {name: "dust_diamond"});

IDRegistry.genItemID("dustEnergium");
Item.createItem("dustEnergium", "Energium Dust", {name: "dust_energium"});

// Small Dust
IDRegistry.genItemID("dustSmallCopper");
Item.createItem("dustSmallCopper", "Tiny Pile of Copper Dust", {name: "dust_copper_small"});

IDRegistry.genItemID("dustSmallTin");
Item.createItem("dustSmallTin", "Tiny Pile of Tin Dust", {name: "dust_tin_small"});

IDRegistry.genItemID("dustSmallIron");
Item.createItem("dustSmallIron", "Tiny Pile of Iron Dust", {name: "dust_iron_small"});

IDRegistry.genItemID("dustSmallLead");
Item.createItem("dustSmallLead", "Tiny Pile of Lead Dust", {name: "dust_lead_small"});

IDRegistry.genItemID("dustSmallGold");
Item.createItem("dustSmallGold", "Tiny Pile of Gold Dust", {name: "dust_gold_small"});

IDRegistry.genItemID("dustSmallSilver");
Item.createItem("dustSmallSilver", "Tiny Pile of Silver Dust", {name: "dust_silver_small"});

IDRegistry.genItemID("dustSmallSulfur");
Item.createItem("dustSmallSulfur", "Tiny Pile of Sulfur Dust", {name: "dust_sulfur_small"});

// Recipe
Recipes.addShaped({id: ItemID.dustEnergium, count: 9, data: 0}, [
	"xax",
	"axa",
	"xax",
], ['x', 331, 0, 'a', ItemID.dustDiamond, 0]);

addShapelessRecipe({id: ItemID.dustBronze, count: 4, data: 0}, [{id: ItemID.crushedCopper, count: 3, data: 0}, {id: ItemID.crushedTin, count: 1, data: 0}]);
addShapelessRecipe({id: ItemID.dustBronze, count: 4, data: 0}, [{id: ItemID.crushedPurifiedCopper, count: 3, data: 0}, {id: ItemID.crushedPurifiedTin, count: 1, data: 0}]);
addShapelessRecipe({id: ItemID.dustBronze, count: 4, data: 0}, [{id: ItemID.dustCopper, count: 3, data: 0}, {id: ItemID.dustTin, count: 1, data: 0}]);

Recipes.addShaped({id: ItemID.dustCopper, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallCopper, 0]);

Recipes.addShaped({id: ItemID.dustTin, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallTin, 0]);

Recipes.addShaped({id: ItemID.dustIron, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallIron, 0]);

Recipes.addShaped({id: ItemID.dustLead, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallLead, 0]);

Recipes.addShaped({id: ItemID.dustGold, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallGold, 0]);

Recipes.addShaped({id: ItemID.dustSilver, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallSilver, 0]);

Recipes.addShaped({id: ItemID.dustSulfur, count: 1, data: 0}, [
	"xxx",
	"xxx",
	"xxx",
], ['x', ItemID.dustSmallSulfur, 0]);

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
