IDRegistry.genItemID("fuelRod");
Item.createItem("fuelRod", "Fuel Rod (Empty)", {name: "fuel_rod", meta: 0});

IDRegistry.genItemID("fuelRodUranium");
IDRegistry.genItemID("fuelRodUranium2");
IDRegistry.genItemID("fuelRodUranium4");
Item.createItem("fuelRodUranium", "Fuel Rod (Uranium)", {name: "fuel_rod_uranium", meta: 0});
Item.createItem("fuelRodUranium2", "Dual Fuel Rod (Uranium)", {name: "fuel_rod_uranium", meta: 1}, {stack: 32});
Item.createItem("fuelRodUranium4", "Quad Fuel Rod (Uranium)", {name: "fuel_rod_uranium", meta: 2}, {stack: 16});
ReactorAPI.registerComponent(ItemID.fuelRodUranium, new ReactorAPI.fuelRod(1, 20000, ItemID.fuelRodDepletedUranium));
ReactorAPI.registerComponent(ItemID.fuelRodUranium2, new ReactorAPI.fuelRod(2, 20000, ItemID.fuelRodDepletedUranium2));
ReactorAPI.registerComponent(ItemID.fuelRodUranium4, new ReactorAPI.fuelRod(4, 20000, ItemID.fuelRodDepletedUranium4));
RadiationAPI.regRadioactiveItem(ItemID.fuelRodUranium, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodUranium2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodUranium4, 10);

IDRegistry.genItemID("fuelRodMOX");
IDRegistry.genItemID("fuelRodMOX2");
IDRegistry.genItemID("fuelRodMOX4");
Item.createItem("fuelRodMOX", "Fuel Rod (MOX)", {name: "fuel_rod_mox", meta: 0});
Item.createItem("fuelRodMOX2", "Dual Fuel Rod (MOX)", {name: "fuel_rod_mox", meta: 1}, {stack: 32});
Item.createItem("fuelRodMOX4", "Quad Fuel Rod (MOX)", {name: "fuel_rod_mox", meta: 2}, {stack: 16});
ReactorAPI.registerComponent(ItemID.fuelRodMOX, new ReactorAPI.fuelRodMOX(1, 10000, ItemID.fuelRodDepletedMOX));
ReactorAPI.registerComponent(ItemID.fuelRodMOX2, new ReactorAPI.fuelRodMOX(2, 10000, ItemID.fuelRodDepletedMOX2));
ReactorAPI.registerComponent(ItemID.fuelRodMOX4, new ReactorAPI.fuelRodMOX(4, 10000, ItemID.fuelRodDepletedMOX4));
RadiationAPI.regRadioactiveItem(ItemID.fuelRodMOX, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodMOX2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodMOX4, 10);

IDRegistry.genItemID("fuelRodDepletedUranium");
IDRegistry.genItemID("fuelRodDepletedUranium2");
IDRegistry.genItemID("fuelRodDepletedUranium4");
Item.createItem("fuelRodDepletedUranium", "Fuel Rod (Depleted Uranium)", {name: "fuel_rod_depleted_uranium", meta: 0});
Item.createItem("fuelRodDepletedUranium2", "Dual Fuel Rod (Depleted Uranium)", {name: "fuel_rod_depleted_uranium", meta: 1}, {stack: 32});
Item.createItem("fuelRodDepletedUranium4", "Quad Fuel Rod (Depleted Uranium)", {name: "fuel_rod_depleted_uranium", meta: 2}, {stack: 16});
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedUranium, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedUranium2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedUranium4, 10);

IDRegistry.genItemID("fuelRodDepletedMOX");
IDRegistry.genItemID("fuelRodDepletedMOX2");
IDRegistry.genItemID("fuelRodDepletedMOX4");
Item.createItem("fuelRodDepletedMOX", "Fuel Rod (Depleted MOX)", {name: "fuel_rod_depleted_mox", meta: 0});
Item.createItem("fuelRodDepletedMOX2", "Dual Fuel Rod (Depleted MOX)", {name: "fuel_rod_depleted_mox", meta: 1}, {stack: 32});
Item.createItem("fuelRodDepletedMOX4", "Quad Fuel Rod (Depleted MOX)", {name: "fuel_rod_depleted_mox", meta: 2}, {stack: 16});
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedMOX, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedMOX2, 10);
RadiationAPI.regRadioactiveItem(ItemID.fuelRodDepletedMOX4, 10);

Recipes.addShaped({id: ItemID.fuelRodUranium2, count: 1, data: 0}, [
	"fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodUranium, 0]);

Recipes.addShaped({id: ItemID.fuelRodUranium4, count: 1, data: 0}, [
	" f ",
	"bab",
	" f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium2, 0]);

Recipes.addShaped({id: ItemID.fuelRodUranium4, count: 1, data: 0}, [
	"faf",
	"bab",
	"faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium, 0]);

Recipes.addShaped({id: ItemID.fuelRodMOX2, count: 1, data: 0}, [
	"fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodMOX, 0]);

Recipes.addShaped({id: ItemID.fuelRodMOX4, count: 1, data: 0}, [
	" f ",
	"bab",
	" f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX2, 0]);

Recipes.addShaped({id: ItemID.fuelRodMOX4, count: 1, data: 0}, [
	"faf",
	"bab",
	"faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX, 0]);
