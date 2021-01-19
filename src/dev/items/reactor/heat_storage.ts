/// <reference path="api/HeatStorage.ts" />

ItemRegistry.createItem("coolantCell", {name: "heat_storage", icon: {name: "heat_storage", meta: 0}, inCreative: false});
ItemRegistry.createItem("coolantCell3", {name: "tri_heat_storage", icon: {name: "heat_storage", meta: 1}, inCreative: false});
ItemRegistry.createItem("coolantCell6", {name: "six_heat_storage", icon: {name: "heat_storage", meta: 2}, inCreative: false});

Item.addToCreative(ItemID.coolantCell, 64, 1);
Item.addToCreative(ItemID.coolantCell3, 64, 1);
Item.addToCreative(ItemID.coolantCell6, 64, 1);

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
