IDRegistry.genItemID("bronzeHelmet");
IDRegistry.genItemID("bronzeChestplate");
IDRegistry.genItemID("bronzeLeggings");
IDRegistry.genItemID("bronzeBoots");

Item.createArmorItem("bronzeHelmet", "Bronze Helmet", {name: "bronze_helmet"}, {type: "helmet", armor: 2, durability: 149, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeChestplate", "Bronze Chestplate", {name: "bronze_chestplate"}, {type: "chestplate", armor: 6, durability: 216, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeLeggings", "Bronze Leggings", {name: "bronze_leggings"}, {type: "leggings", armor: 5, durability: 203, texture: "armor/bronze_2.png"});
Item.createArmorItem("bronzeBoots", "Bronze Boots", {name: "bronze_boots"}, {type: "boots", armor: 2, durability: 176, texture: "armor/bronze_1.png"});

Item.setEnchantType(ItemID.bronzeHelmet, EnchantType.helmet, 14);
Item.setEnchantType(ItemID.bronzeChestplate, EnchantType.chestplate, 14);
Item.setEnchantType(ItemID.bronzeLeggings, EnchantType.leggings, 14);
Item.setEnchantType(ItemID.bronzeBoots, EnchantType.boots, 14);

Item.addRepairItemIds(ItemID.bronzeHelmet, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeChestplate, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeLeggings, [ItemID.ingotBronze]);
Item.addRepairItemIds(ItemID.bronzeBoots, [ItemID.ingotBronze]);

/*Item.addCreativeGroup("armorBronze", "Bronze Armor", [
	ItemID.bronzeHelmet,
	ItemID.bronzeChestplate,
	ItemID.bronzeLeggings,
	ItemID.bronzeBoots
]);*/

Recipes.addShaped({id: ItemID.bronzeHelmet, count: 1, data: 0}, [
	"xxx",
	"x x"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeChestplate, count: 1, data: 0}, [
	"x x",
	"xxx",
	"xxx"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeLeggings, count: 1, data: 0}, [
	"xxx",
	"x x",
	"x x"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeBoots, count: 1, data: 0}, [
	"x x",
	"x x"
], ['x', ItemID.ingotBronze, 0]);