/// <reference path="api/FuelRod.ts" />
/// <reference path="api/FuelRodMox.ts" />

ItemRegistry.createItem("fuelRod", {name: "fuel_rod", icon: "fuel_rod"});

ItemRegistry.createItem("fuelRodUranium", {name: "uranium_fuel_rod", icon: {name: "fuel_rod_uranium", meta: 0}});
ItemRegistry.createItem("fuelRodUranium2", {name: "dual_uranium_fuel_rod", icon: {name: "fuel_rod_uranium", meta: 1}, stack: 32});
ItemRegistry.createItem("fuelRodUranium4", {name: "quad_uranium_fuel_rod", icon: {name: "fuel_rod_uranium", meta: 2}, stack: 16});

ItemReactor.registerComponent(ItemID.fuelRodUranium, new ItemReactor.FuelRod(1, 20000));
ItemReactor.registerComponent(ItemID.fuelRodUranium2, new ItemReactor.FuelRod(2, 20000));
ItemReactor.registerComponent(ItemID.fuelRodUranium4, new ItemReactor.FuelRod(4, 20000));

RadiationAPI.setRadioactivity(ItemID.fuelRodUranium, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodUranium2, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodUranium4, 10);

ItemRegistry.createItem("fuelRodMOX", {name: "mox_fuel_rod", icon: {name: "fuel_rod_mox", meta: 0}});
ItemRegistry.createItem("fuelRodMOX2", {name: "dual_mox_fuel_rod", icon: {name: "fuel_rod_mox", meta: 1}, stack: 32});
ItemRegistry.createItem("fuelRodMOX4", {name: "quad_mox_fuel_rod", icon: {name: "fuel_rod_mox", meta: 2}, stack: 16});

ItemReactor.registerComponent(ItemID.fuelRodMOX, new ItemReactor.FuelRodMOX(1, 10000));
ItemReactor.registerComponent(ItemID.fuelRodMOX2, new ItemReactor.FuelRodMOX(2, 10000));
ItemReactor.registerComponent(ItemID.fuelRodMOX4, new ItemReactor.FuelRodMOX(4, 10000));

RadiationAPI.setRadioactivity(ItemID.fuelRodMOX, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodMOX2, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodMOX4, 10);

ItemRegistry.createItem("fuelRodDepletedUranium", {name: "depleted_uranium_fuel_rod", icon: {name: "fuel_rod_depleted_uranium", meta: 0}});
ItemRegistry.createItem("fuelRodDepletedUranium2", {name: "depleted_dual_uranium_fuel_rod", icon: {name: "fuel_rod_depleted_uranium", meta: 1}, stack: 32});
ItemRegistry.createItem("fuelRodDepletedUranium4", {name: "depleted_quad_uranium_fuel_rod", icon: {name: "fuel_rod_depleted_uranium", meta: 2}, stack: 16});

RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedUranium, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedUranium2, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedUranium4, 10);

ItemRegistry.createItem("fuelRodDepletedMOX", {name: "depleted_mox_fuel_rod", icon: {name: "fuel_rod_depleted_mox", meta: 0}});
ItemRegistry.createItem("fuelRodDepletedMOX2", {name: "depleted_dual_mox_fuel_rod", icon: {name: "fuel_rod_depleted_mox", meta: 1}, stack: 32});
ItemRegistry.createItem("fuelRodDepletedMOX4", {name: "depleted_quad_mox_fuel_rod", icon: {name: "fuel_rod_depleted_mox", meta: 2}, stack: 16});

RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedMOX, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedMOX2, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedMOX4, 10);

Item.addCreativeGroup("ic2_fuelRod", Translation.translate("Nuclear Fuel Rods"), [
	ItemID.fuelRod,
	ItemID.fuelRodUranium,
	ItemID.fuelRodUranium2,
	ItemID.fuelRodUranium4,
	ItemID.fuelRodMOX,
	ItemID.fuelRodMOX2,
	ItemID.fuelRodMOX4,
	ItemID.fuelRodDepletedUranium,
	ItemID.fuelRodDepletedUranium2,
	ItemID.fuelRodDepletedUranium4,
	ItemID.fuelRodDepletedMOX,
	ItemID.fuelRodDepletedMOX2,
	ItemID.fuelRodDepletedMOX4
]);

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
