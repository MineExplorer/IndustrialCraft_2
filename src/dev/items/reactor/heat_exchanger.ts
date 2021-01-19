/// <reference path="api/HeatExchanger.ts" />

ItemRegistry.createItem("heatExchanger", {name: "heat_exchanger", icon: "heat_exchanger", inCreative: false});
ItemRegistry.createItem("heatExchangerReactor", {name: "reactor_heat_exchanger", icon: "reactor_heat_exchanger", inCreative: false});
ItemRegistry.createItem("heatExchangerComponent", {name: "component_heat_exchanger", icon: "component_heat_exchanger", inCreative: false});
ItemRegistry.createItem("heatExchangerAdv", {name: "advanced_heat_exchanger", icon: "advanced_heat_exchanger", inCreative: false});

Item.addToCreative(ItemID.heatExchanger, 64, 1);
Item.addToCreative(ItemID.heatExchangerReactor, 64, 1);
Item.addToCreative(ItemID.heatExchangerComponent, 64, 1);
Item.addToCreative(ItemID.heatExchangerAdv, 64, 1);

ReactorItem.registerComponent(ItemID.heatExchanger, new ReactorItem.HeatExchanger(2500, 12, 4));
ReactorItem.registerComponent(ItemID.heatExchangerReactor, new ReactorItem.HeatExchanger(5000, 0, 72));
ReactorItem.registerComponent(ItemID.heatExchangerComponent, new ReactorItem.HeatExchanger(5000, 36, 0));
ReactorItem.registerComponent(ItemID.heatExchangerAdv, new ReactorItem.HeatExchanger(10000, 24, 8));

Item.addCreativeGroup("ic2_reactorHeatExchanger", Translation.translate("Reactor Heat Exchangers"), [
	ItemID.heatExchanger,
	ItemID.heatExchangerReactor,
	ItemID.heatExchangerComponent,
	ItemID.heatExchangerAdv
]);

Recipes.addShaped({id: ItemID.heatExchanger, count: 1, data: 1}, [
	"aca",
	"bab",
	"aba"
], ['c', ItemID.circuitBasic, 0, 'a', ItemID.plateCopper, 0, 'b', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.heatExchangerReactor, count: 1, data: 1}, [
	"aaa",
	"axa",
	"aaa"
], ['x', ItemID.heatExchanger, 1, 'a', ItemID.plateCopper, 0]);

Recipes.addShaped({id: ItemID.heatExchangerComponent, count: 1, data: 1}, [
	" a ",
	"axa",
	" a "
], ['x', ItemID.heatExchanger, 1, 'a', ItemID.plateGold, 0]);

Recipes.addShaped({id: ItemID.heatExchangerAdv, count: 1, data: 1}, [
	"pcp",
	"xdx",
	"pcp"
], ['x', ItemID.heatExchanger, 1, 'c', ItemID.circuitBasic, 0, 'd', ItemID.densePlateCopper, 0, 'p', ItemID.plateLapis, 0]);
