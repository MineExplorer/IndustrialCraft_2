IDRegistry.genItemID("compositeHelmet");
IDRegistry.genItemID("compositeChestplate");
IDRegistry.genItemID("compositeLeggings");
IDRegistry.genItemID("compositeBoots");

Item.createArmorItem("compositeHelmet", "Composite Helmet", {name: "composite_helmet"}, {type: "helmet", armor: 3, durability: 550, texture: "armor/composite_1.png"});
Item.createArmorItem("compositeChestplate", "Composite Chestplate", {name: "composite_chestplate"}, {type: "chestplate", armor: 8, durability: 800, texture: "armor/composite_1.png"});
Item.createArmorItem("compositeLeggings", "Composite Leggings", {name: "composite_leggings"}, {type: "leggings", armor: 6, durability: 750, texture: "armor/composite_2.png"});
Item.createArmorItem("compositeBoots", "Composite Boots", {name: "composite_boots"}, {type: "boots", armor: 3, durability: 650, texture: "armor/composite_1.png"});

Item.setEnchantType(ItemID.compositeHelmet, EnchantType.helmet, 8);
Item.setEnchantType(ItemID.compositeChestplate, EnchantType.chestplate, 8);
Item.setEnchantType(ItemID.compositeLeggings, EnchantType.leggings, 8);
Item.setEnchantType(ItemID.compositeBoots, EnchantType.boots, 8);

Item.addRepairItemIds(ItemID.compositeHelmet, [ItemID.plateAlloy]);
Item.addRepairItemIds(ItemID.compositeChestplate, [ItemID.plateAlloy]);
Item.addRepairItemIds(ItemID.compositeLeggings, [ItemID.plateAlloy]);
Item.addRepairItemIds(ItemID.compositeBoots, [ItemID.plateAlloy]);

Recipes.addShaped({id: ItemID.compositeHelmet, count: 1, data: 0}, [
	"xax",
	"x x"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_helmet, 0]);

Recipes.addShaped({id: ItemID.compositeChestplate, count: 1, data: 0}, [
	"x x",
	"xax",
	"xxx"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_chestplate, 0]);

Recipes.addShaped({id: ItemID.compositeLeggings, count: 1, data: 0}, [
	"xax",
	"x x",
	"x x"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_leggings, 0]);

Recipes.addShaped({id: ItemID.compositeBoots, count: 1, data: 0}, [
	"x x",
	"xax"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_boots, 0]);