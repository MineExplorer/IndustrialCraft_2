/// <reference path="api/HeatVent.ts" />

ItemRegistry.createItem("heatVent", {name: "heat_vent", icon: "heat_vent", inCreative: false});
ItemRegistry.createItem("heatVentReactor", {name: "reactor_heat_vent", icon: "reactor_heat_vent", inCreative: false});
ItemRegistry.createItem("heatVentComponent", {name: "component_heat_vent", icon: "component_heat_vent", inCreative: false});
ItemRegistry.createItem("heatVentAdv", {name: "advanced_heat_vent", icon: "advanced_heat_vent", inCreative: false});
ItemRegistry.createItem("heatVentOverclocked", {name: "overclocked_heat_vent", icon: "overclocked_heat_vent", inCreative: false});

Item.addToCreative(ItemID.heatVent, 64, 1);
Item.addToCreative(ItemID.heatVentReactor, 64, 1);
Item.addToCreative(ItemID.heatVentComponent, 64, 1);
Item.addToCreative(ItemID.heatVentAdv, 64, 1);
Item.addToCreative(ItemID.heatVentOverclocked, 64, 1);

ItemReactor.registerComponent(ItemID.heatVent, new ItemReactor.HeatVent(1000, 6, 0));
ItemReactor.registerComponent(ItemID.heatVentReactor, new ItemReactor.HeatVent(1000, 5, 5));
ItemReactor.registerComponent(ItemID.heatVentComponent, new ItemReactor.HeatVentSpread(4));
ItemReactor.registerComponent(ItemID.heatVentAdv, new ItemReactor.HeatVent(1000, 12, 0));
ItemReactor.registerComponent(ItemID.heatVentOverclocked, new ItemReactor.HeatVent(1000, 20, 36));

Item.addCreativeGroup("ic2_reactorHeatVent", Translation.translate("Reactor Heat Vents"), [
	ItemID.heatVent,
	ItemID.heatVentReactor,
	ItemID.heatVentComponent,
    ItemID.heatVentAdv,
	ItemID.heatVentOverclocked
]);

Recipes.addShaped({id: ItemID.heatVent, count: 1, data: 1}, [
	"bab",
	"axa",
	"bab"
], ['x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 101, -1]);

Recipes.addShaped({id: ItemID.heatVentReactor, count: 1, data: 1}, [
	"a",
	"x",
	"a"
], ['x', ItemID.heatVent, 1, 'a', ItemID.densePlateCopper, 0]);

Recipes.addShaped({id: ItemID.heatVentComponent, count: 1, data: 0}, [
	"bab",
	"axa",
	"bab"
], ['x', ItemID.heatVent, 1, 'a', ItemID.plateTin, 0, 'b', 101, -1]);

Recipes.addShaped({id: ItemID.heatVentAdv, count: 1, data: 1}, [
	"bxb",
	"bdb",
	"bxb"
], ['x', ItemID.heatVent, 1, 'd', 264, 0, 'b', 101, -1]);

Recipes.addShaped({id: ItemID.heatVentOverclocked, count: 1, data: 1}, [
	"a",
	'x',
	"a"
], ['x', ItemID.heatVentReactor, 1, 'a', ItemID.plateGold, 0]);
