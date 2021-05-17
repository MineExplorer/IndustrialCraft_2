ItemRegistry.createItem("mugColdCoffee", {name: "mug_cold_coffee", icon: "mug_cold_coffee", stack: 1});
ItemRegistry.createItem("mugDarkCoffee", {name: "mug_dark_coffee", icon: "mug_dark_coffee", stack: 1});
ItemRegistry.createItem("mugCoffee", {name: "mug_coffee", icon: "mug_coffee", stack: 1});

Item.addCreativeGroup("mug_coffee", Translation.translate("Coffee"), [
	ItemID.mugEmpty,
	ItemID.mugColdCoffee,
	ItemID.mugDarkCoffee,
	ItemID.mugCoffee
]);

Callback.addCallback("FoodEaten", IC2Coffee.foodEaten);
Callback.addCallback("ServerPlayerTick", IC2Coffee.serverPlayerTick);
Callback.addCallback("EntityDeath", IC2Coffee.onDeath);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.mugColdCoffee, count: 1, data: 0}, [
		"x",
		"y",
		"z",
	], ['x', ItemID.coffeePowder, 0, 'y', 325, 8, 'z', ItemID.mugEmpty, 0], IC2Coffee.craftFunction);

	Recipes.addShaped({id: ItemID.mugCoffee, count: 1, data: 0}, [
		"x",
		"y",
		"z",
	], ['x', 353, 0, 'y', 325, 1, 'z', ItemID.mugDarkCoffee, 0], IC2Coffee.craftFunction);

	Recipes.addFurnace(ItemID.mugColdCoffee, ItemID.mugDarkCoffee, 0);
});
