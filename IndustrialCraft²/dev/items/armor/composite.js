IDRegistry.genItemID("compositeHelmet");
IDRegistry.genItemID("compositeChestplate");
IDRegistry.genItemID("compositeLeggings");
IDRegistry.genItemID("compositeBoots");

Item.createArmorItem("compositeHelmet", "Composite Helmet", {name: "composite_helmet"}, {type: "helmet", armor: 3, durability: 330, texture: "armor/composite_1.png"});
Item.createArmorItem("compositeChestplate", "Composite Chestplate", {name: "composite_chestplate"}, {type: "chestplate", armor: 8, durability: 480, texture: "armor/composite_1.png"});
Item.createArmorItem("compositeLeggings", "Composite Leggings", {name: "composite_leggings"}, {type: "leggings", armor: 6, durability: 450, texture: "armor/composite_2.png"});
Item.createArmorItem("compositeBoots", "Composite Boots", {name: "composite_boots"}, {type: "boots", armor: 3, durability: 390, texture: "armor/composite_1.png"});

Recipes.addShaped({id: ItemID.compositeHelmet, count: 1, data: 0}, [
	"xxx",
	"x x"
], ['x', ItemID.plateAlloy, 0]);

Recipes.addShaped({id: ItemID.compositeChestplate, count: 1, data: 0}, [
	"x x",
	"xxx",
	"xxx"
], ['x', ItemID.plateAlloy, 0]);

Recipes.addShaped({id: ItemID.compositeLeggings, count: 1, data: 0}, [
	"xxx",
	"x x",
	"x x"
], ['x', ItemID.plateAlloy, 0]);

Recipes.addShaped({id: ItemID.compositeBoots, count: 1, data: 0}, [
	"x x",
	"x x"
], ['x', ItemID.plateAlloy, 0]);