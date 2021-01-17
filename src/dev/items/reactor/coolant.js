IDRegistry.genItemID("coolantCell");
IDRegistry.genItemID("coolantCell3");
IDRegistry.genItemID("coolantCell6");
Item.createItem("coolantCell", "10k Coolant Cell", {name: "coolant_cell", meta: 0}, {isTech: true});
Item.createItem("coolantCell3", "30k Coolant Cell", {name: "coolant_cell", meta: 1}, {isTech: true});
Item.createItem("coolantCell6", "60k Coolant Cell", {name: "coolant_cell", meta: 2}, {isTech: true});
ItemReactor.registerComponent(ItemID.coolantCell, new ItemReactor.HeatStorage(10000));
ItemReactor.registerComponent(ItemID.coolantCell3, new ItemReactor.HeatStorage(30000));
ItemReactor.registerComponent(ItemID.coolantCell6, new ItemReactor.HeatStorage(60000));

Item.addCreativeGroup("ic2_reactorCoolant", Translation.translate("Reactor Coolants"), [
	ItemID.coolantCell,
	ItemID.coolantCell3,
	ItemID.coolantCell6
]);

Recipes.addShaped({id: ItemID.coolantCell, count: 1, data: 1}, [
	" a ",
	"axa",
	" a ",
], ['x', ItemID.cellCoolant, 0, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell3, count: 1, data: 1}, [
	"aaa",
	"xxx",
	"aaa",
], ['x', ItemID.coolantCell, 1, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell3, count: 1, data: 1}, [
	"axa",
	"axa",
	"axa",
], ['x', ItemID.coolantCell, 1, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell6, count: 1, data: 1}, [
	"aaa",
	"xbx",
	"aaa",
], ['x', ItemID.coolantCell3, 1, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);

Recipes.addShaped({id: ItemID.coolantCell6, count: 1, data: 1}, [
	"axa",
	"aba",
	"axa",
], ['x', ItemID.coolantCell3, 1, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);
