IDRegistry.genItemID("heatVent");
Item.createItem("heatVent", "Heat Vent", {name: "heat_vent", meta: 0}, {isTech: true});

IDRegistry.genItemID("heatVentReactor");
Item.createItem("heatVentReactor", "Reactor Heat Vent", {name: "heat_vent", meta: 1}, {isTech: true});

IDRegistry.genItemID("heatVentComponent");
Item.createItem("heatVentComponent", "Component Heat Vent", {name: "heat_vent", meta: 2});

IDRegistry.genItemID("heatVentAdv");
Item.createItem("heatVentAdv", "Advanced Heat Vent", {name: "heat_vent", meta: 3}, {isTech: true});

IDRegistry.genItemID("heatVentOverclocked");
Item.createItem("heatVentOverclocked", "Overclocked Heat Vent", {name: "heat_vent", meta: 4}, {isTech: true});

ReactorAPI.registerComponent(ItemID.heatVent, new ReactorAPI.heatVent(1000, 6, 0));
ReactorAPI.registerComponent(ItemID.heatVentReactor, new ReactorAPI.heatVent(1000, 5, 5));
ReactorAPI.registerComponent(ItemID.heatVentComponent, new ReactorAPI.heatVentSpread(4));
ReactorAPI.registerComponent(ItemID.heatVentAdv, new ReactorAPI.heatVent(1000, 12, 0));
ReactorAPI.registerComponent(ItemID.heatVentOverclocked, new ReactorAPI.heatVent(1000, 20, 36));

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
