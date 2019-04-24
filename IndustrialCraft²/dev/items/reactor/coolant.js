IDRegistry.genItemID("coolantCell");
IDRegistry.genItemID("coolantCell3");
IDRegistry.genItemID("coolantCell6");
Item.createItem("coolantCell", "10k Coolant Cell", {name: "coolant_cell", meta: 0});
Item.createItem("coolantCell3", "30k Coolant Cell", {name: "coolant_cell", meta: 1});
Item.createItem("coolantCell6", "60k Coolant Cell", {name: "coolant_cell", meta: 2});

Recipes.addShaped({id: ItemID.coolantCell, count: 1, data: 0}, [
	" a ",
	"axa",
	" a ",
], ['x', 373, 0, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell, count: 1, data: 0}, [
	" a ",
	"axa",
	" a ",
], ['x', ItemID.cellWater, 0, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell3, count: 1, data: 0}, [
	"aaa",
	"xxx",
	"aaa",
], ['x', ItemID.coolantCell, 0, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell3, count: 1, data: 0}, [
	"axa",
	"axa",
	"axa",
], ['x', ItemID.coolantCell, 0, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell6, count: 1, data: 0}, [
	"aaa",
	"xbx",
	"aaa",
], ['x', ItemID.coolantCell3, 0, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);

Recipes.addShaped({id: ItemID.coolantCell6, count: 1, data: 0}, [
	"axa",
	"aba",
	"axa",
], ['x', ItemID.coolantCell3, 0, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);
