IDRegistry.genItemID("coffeeBeans");
Item.createItem("coffeeBeans", "Coffee Beans", {name: "coffee_beans"});

IDRegistry.genItemID("coffeePowder");
Item.createItem("coffeePowder", "Coffee Powder", {name: "coffee_powder"});
addShapelessRecipe({id: ItemID.coffeePowder, count: 1, data: 0}, [{id: ItemID.coffeeBeans, count: 1, data: 0}]);