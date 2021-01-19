/// <reference path="api/Plating.ts" />

ItemRegistry.createItem("reactorPlating", {name: "reactor_plating", icon: "reactor_plating"});
ItemRegistry.createItem("reactorPlatingContainment", {name: "containment_reactor_plating", icon: "containment_reactor_plating"});
ItemRegistry.createItem("reactorPlatingHeat", {name: "heat_reactor_plating", icon: "heat_reactor_plating"});

ReactorItem.registerComponent(ItemID.reactorPlating, new ReactorItem.Plating(1000, 0.95));
ReactorItem.registerComponent(ItemID.reactorPlatingContainment, new ReactorItem.Plating(500, 0.9));
ReactorItem.registerComponent(ItemID.reactorPlatingHeat, new ReactorItem.Plating(2000, 0.99));

Item.addCreativeGroup("ic2_reactorPlating", Translation.translate("Reactor Platings"), [
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
