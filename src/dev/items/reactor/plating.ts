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

VanillaRecipe.addShapelessRecipe("reactor_plating", {
	ingredients: [
		{ item: "item:plateAlloy" },
		{ item: "item:plateLead" }
	],
	result: {
		item: "item:reactorPlating"
	}
}, true);

VanillaRecipe.addShapelessRecipe("containment_reactor_plating", {
	ingredients: [
		{ item: "item:reactorPlating" },
		{ item: "item:plateAlloy" },
		{ item: "item:plateAlloy" }
	],
	result: {
		item: "item:reactorPlatingContainment"
	}
}, true);

Recipes.addShaped({id: ItemID.reactorPlatingHeat, count: 1, data: 0}, [
	"aaa",
	"axa",
	"aaa"
], ['x', ItemID.reactorPlating, 0, 'a', ItemID.plateCopper, 0]);
