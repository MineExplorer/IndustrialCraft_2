IDRegistry.genItemID("heatExchanger");
Item.createItem("heatExchanger", "Heat Exchanger", {name: "heat_exchanger", meta: 0});

IDRegistry.genItemID("heatExchangerAdv");
Item.createItem("heatExchangerAdv", "Advanced Heat Exchanger", {name: "heat_exchanger", meta: 1});

IDRegistry.genItemID("heatExchangerComponent");
Item.createItem("heatExchangerComponent", "Component Heat Exchanger", {name: "heat_exchanger", meta: 2});

IDRegistry.genItemID("heatExchangerReactor");
Item.createItem("heatExchangerReactor", "Reactor Heat Exchanger", {name: "heat_exchanger", meta: 3});

Recipes.addShaped({id: ItemID.heatExchanger, count: 1, data: 0}, [
	"aca",
	"bab",
	"aba"
], ['c', ItemID.circuitBasic, 0, 'a', ItemID.plateCopper, 0, 'b', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.heatExchangerAdv, count: 1, data: 0}, [
	"pcp",
	"xdx",
	"pcp"
], ['x', ItemID.heatExchanger, 0, 'c', ItemID.circuitBasic, 0, 'd', ItemID.plateCopper, 0, 'p', ItemID.plateLapis, 0]); // dense copper plate

Recipes.addShaped({id: ItemID.heatExchangerComponent, count: 1, data: 0}, [
	" a ",
	"axa",
	" a "
], ['x', ItemID.heatExchanger, 0, 'a', ItemID.plateGold, 0]);

Recipes.addShaped({id: ItemID.heatExchangerReactor, count: 1, data: 0}, [
	"aaa",
	"axa",
	"aaa"
], ['x', ItemID.heatExchanger, 0, 'a', ItemID.plateCopper, 0]);
