IDRegistry.genItemID("wrenchBronze");
Item.createItem("wrenchBronze", "Wrench", {name: "bronze_wrench", meta: 0}, {stack: 1});
Item.setMaxDamage(ItemID.wrenchBronze, 161);

IDRegistry.genItemID("electricWrench");
Item.createItem("electricWrench", "Electric Wrench", {name: "electric_wrench", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.electricWrench, "Eu", 10000, 100, 1, "tool", true);

Item.registerNameOverrideFunction(ItemID.electricWrench, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.wrenchBronze, count: 1, data: 0}, [
	"a a",
	"aaa",
	" a "
], ['a', ItemID.ingotBronze, 0]);

Recipes.addShapeless({id: ItemID.electricWrench, count: 1, data: Item.getMaxDamage(ItemID.electricWrench)}, [
	{id: ItemID.wrenchBronze, data: 0}, {id: ItemID.powerUnitSmall, data: 0}
]);

ICTool.registerWrench(ItemID.wrenchBronze, 0.8);
ICTool.registerWrench(ItemID.electricWrench, 1, 50);