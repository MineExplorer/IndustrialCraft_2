ItemRegistry.createItem("mugColdCoffee", {type: "food", name: "mug_cold_coffee", icon: "mug_cold_coffee", stack: 1});
ItemRegistry.createItem("mugDarkCoffee", {type: "food", name: "mug_dark_coffee", icon: "mug_dark_coffee", stack: 1});
ItemRegistry.createItem("mugCoffee", {type: "food", name: "mug_coffee", icon: "mug_coffee", stack: 1});

Item.addCreativeGroup("mug_coffee", Translation.translate("Coffee"), [
	ItemID.mugEmpty,
	ItemID.mugColdCoffee,
	ItemID.mugDarkCoffee,
	ItemID.mugCoffee
]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.mugColdCoffee, count: 1, data: 0}, [
		"x",
		"y",
		"z",
	], ['x', ItemID.coffeePowder, 0, 'y', IDConverter.getID("water_bucket"), IDConverter.getData("water_bucket"), 'z', ItemID.mugEmpty, 0], IC2Coffee.craftFunction);

	Recipes.addShaped({id: ItemID.mugCoffee, count: 1, data: 0}, [
		"x",
		"y",
		"z",
	], ['x', 353, 0, 'y', IDConverter.getID("milk_bucket"), IDConverter.getData("milk_bucket"), 'z', ItemID.mugDarkCoffee, 0], IC2Coffee.craftFunction);

	Recipes.addFurnace(ItemID.mugColdCoffee, ItemID.mugDarkCoffee, 0);
});