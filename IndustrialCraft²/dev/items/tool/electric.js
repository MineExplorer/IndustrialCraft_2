IDRegistry.genItemID("electricHoe");
IDRegistry.genItemID("electricTreetap");
Item.createItem("electricHoe", "Electric Hoe", {name: "electric_hoe", meta: 0}, {stack: 1, isTech: true});
Item.createItem("electricTreetap", "Electric Treetap", {name: "electric_treetap", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.electricHoe, "Eu", 10000, 100, 1, "tool", true);
ChargeItemRegistry.registerItem(ItemID.electricTreetap, "Eu", 10000, 100, 1, "tool", true);
Item.setToolRender(ItemID.electricHoe, true);

Item.registerNameOverrideFunction(ItemID.electricHoe, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.electricTreetap, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.electricHoe, count: 1, data: Item.getMaxDamage(ItemID.electricHoe)}, [
	"pp",
	" p",
	" x"
], ['x', ItemID.powerUnitSmall, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShapeless({id: ItemID.electricTreetap, count: 1, data: Item.getMaxDamage(ItemID.electricTreetap)}, [{id: ItemID.powerUnitSmall, data: 0}, {id: ItemID.treetap, data: 0}]);

ICTool.registerElectricHoe("electricHoe");
ICTool.registerElectricTreerap("electricTreetap");
