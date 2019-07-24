IDRegistry.genItemID("reactorPlating");
IDRegistry.genItemID("reactorPlatingContainment");
IDRegistry.genItemID("reactorPlatingHeat");
Item.createItem("reactorPlating", "Reactor Plating", {name: "reactor_plating", meta: 0});
Item.createItem("reactorPlatingContainment", "Containment Reactor Plating", {name: "reactor_plating", meta: 1});
Item.createItem("reactorPlatingHeat", "Heat-Capacity Reactor Plating", {name: "reactor_plating", meta: 2});

Recipes.addShapeless({id: ItemID.reactorPlating, count: 1, data: 0}, [{id: ItemID.plateAlloy, data: 0}, {id: ItemID.plateLead, data: 0}]);

Recipes.addShapeless({id: ItemID.reactorPlatingContainment, count: 1, data: 0}, [{id: ItemID.reactorPlating, data: 0}, {id: ItemID.plateAlloy, data: 0}, {id: ItemID.plateAlloy, data: 0}]);

Recipes.addShaped({id: ItemID.reactorPlatingHeat, count: 1, data: 0}, [
	"aaa",
	"axa",
	"aaa"
], ["x", ItemID.reactorPlating, 0, 'a', ItemID.plateCopper, 0]);
