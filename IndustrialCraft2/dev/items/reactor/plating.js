IDRegistry.genItemID("reactorPlating");
IDRegistry.genItemID("reactorPlatingContainment");
IDRegistry.genItemID("reactorPlatingHeat");
Item.createItem("reactorPlating", "Reactor Plating", {name: "reactor_plating", meta: 0});
Item.createItem("reactorPlatingContainment", "Containment Reactor Plating", {name: "reactor_plating", meta: 1});
Item.createItem("reactorPlatingHeat", "Heat-Capacity Reactor Plating", {name: "reactor_plating", meta: 2});
ReactorAPI.registerComponent(ItemID.reactorPlating, new ReactorAPI.plating(1000, 0.95));
ReactorAPI.registerComponent(ItemID.reactorPlatingContainment, new ReactorAPI.plating(500, 0.9));
ReactorAPI.registerComponent(ItemID.reactorPlatingHeat, new ReactorAPI.plating(2000, 0.99));

Item.addCreativeGroup("ic2_reactorPlating", Translation.translate("Reactor Plating"), [
	ItemID.reactorPlating,
	ItemID.reactorPlatingContainment,
    ItemID.reactorPlatingHeat
]);

Recipes.addShapeless({id: ItemID.reactorPlating, count: 1, data: 0}, [{id: ItemID.plateAlloy, data: 0}, {id: ItemID.plateLead, data: 0}]);

Recipes.addShapeless({id: ItemID.reactorPlatingContainment, count: 1, data: 0}, [{id: ItemID.reactorPlating, data: 0}, {id: ItemID.plateAlloy, data: 0}, {id: ItemID.plateAlloy, data: 0}]);

Recipes.addShaped({id: ItemID.reactorPlatingHeat, count: 1, data: 0}, [
	"aaa",
	"axa",
	"aaa"
], ['x', ItemID.reactorPlating, 0, 'a', ItemID.plateCopper, 0]);
