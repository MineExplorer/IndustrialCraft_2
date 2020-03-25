IDRegistry.genItemID("electricHoe");
Item.createItem("electricHoe", "Electric Hoe", {name: "electric_hoe", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.electricHoe, "Eu", 10000, 100, 1, "tool", true, true);
Item.setToolRender(ItemID.electricHoe, true);
Item.registerNameOverrideFunction(ItemID.electricHoe, ItemName.showItemStorage);

IDRegistry.genItemID("electricTreetap");
Item.createItem("electricTreetap", "Electric Treetap", {name: "electric_treetap", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.electricTreetap, "Eu", 10000, 100, 1, "tool", true, true);
Item.registerNameOverrideFunction(ItemID.electricTreetap, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.electricHoe, count: 1, data: 27}, [
	"pp",
	" p",
	" x"
], ['x', ItemID.powerUnitSmall, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShapeless({id: ItemID.electricTreetap, count: 1, data: 27}, [{id: ItemID.powerUnitSmall, data: 0}, {id: ItemID.treetap, data: 0}]);

ICTool.registerElectricHoe("electricHoe");
ICTool.registerElectricTreerap("electricTreetap");
