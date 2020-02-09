IDRegistry.genItemID("coffeeBeans");
Item.createItem("coffeeBeans", "Coffee Beans", {name: "coffee_beans"});

IDRegistry.genItemID("coffeePowder");
Item.createItem("coffeePowder", "Coffee Powder", {name: "coffee_powder"});
Recipes.addShapeless({id: ItemID.coffeePowder, count: 1, data: 0}, [{id: ItemID.coffeeBeans, data: 0}]);