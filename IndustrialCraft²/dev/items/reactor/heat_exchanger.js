IDRegistry.genItemID("heatExchanger");
Item.createItem("heatExchanger", "Heat Exchanger", {name: "heat_exchanger", meta: 0}, {isTech: true});

IDRegistry.genItemID("heatExchangerReactor");
Item.createItem("heatExchangerReactor", "Reactor Heat Exchanger", {name: "heat_exchanger", meta: 1}, {isTech: true});

IDRegistry.genItemID("heatExchangerComponent");
Item.createItem("heatExchangerComponent", "Component Heat Exchanger", {name: "heat_exchanger", meta: 2}, {isTech: true});

IDRegistry.genItemID("heatExchangerAdv");
Item.createItem("heatExchangerAdv", "Advanced Heat Exchanger", {name: "heat_exchanger", meta: 3}, {isTech: true});

ReactorAPI.registerComponent(ItemID.heatExchanger, new ReactorAPI.heatExchanger(2500, 12, 4));
ReactorAPI.registerComponent(ItemID.heatExchangerReactor, new ReactorAPI.heatExchanger(5000, 0, 72));
ReactorAPI.registerComponent(ItemID.heatExchangerComponent, new ReactorAPI.heatExchanger(5000, 36, 0));
ReactorAPI.registerComponent(ItemID.heatExchangerAdv, new ReactorAPI.heatExchanger(10000, 24, 8));

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
