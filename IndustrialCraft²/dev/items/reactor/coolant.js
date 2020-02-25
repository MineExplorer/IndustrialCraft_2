IDRegistry.genItemID("coolantCell");
IDRegistry.genItemID("coolantCell3");
IDRegistry.genItemID("coolantCell6");
Item.createItem("coolantCell", "10k Coolant Cell", {name: "coolant_cell", meta: 0}, {isTech: true});
Item.createItem("coolantCell3", "30k Coolant Cell", {name: "coolant_cell", meta: 1}, {isTech: true});
Item.createItem("coolantCell6", "60k Coolant Cell", {name: "coolant_cell", meta: 2}, {isTech: true});
ReactorAPI.registerComponent(ItemID.coolantCell, new ReactorAPI.heatStorage(10000));
ReactorAPI.registerComponent(ItemID.coolantCell3, new ReactorAPI.heatStorage(30000));
ReactorAPI.registerComponent(ItemID.coolantCell6, new ReactorAPI.heatStorage(60000));

Recipes.addShaped({id: ItemID.coolantCell, count: 1, data: 1}, [
	" a ",
	"axa",
	" a ",
], ['x', 373, 0, 'a', ItemID.plateTin, 0]);

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
