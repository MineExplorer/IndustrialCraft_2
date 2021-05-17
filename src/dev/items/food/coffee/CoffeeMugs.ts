ItemRegistry.createItem("mugColdCoffee", {type: "food", name: "mug_cold_coffee", icon: "mug_cold_coffee", stack: 1});
ItemRegistry.createItem("mugDarkCoffee", {type: "food", name: "mug_dark_coffee", icon: "mug_dark_coffee", stack: 1});
ItemRegistry.createItem("mugCoffee", {type: "food", name: "mug_coffee", icon: "mug_coffee", stack: 1});

Item.addCreativeGroup("mug_coffee", Translation.translate("Coffee"), [
	ItemID.mugEmpty,
	ItemID.mugColdCoffee,
	ItemID.mugDarkCoffee,
	ItemID.mugCoffee
]);
