ItemRegistry.createItem("coffeeBeans", {name: "Coffee Beans", icon: "coffee_beans"});
ItemRegistry.createItem("coffeePowder", {name: "Coffee Powder", icon: "coffee_powder"});

Recipes.addShapeless({id: ItemID.coffeePowder, count: 1, data: 0}, [{id: ItemID.coffeeBeans, data: 0}]);
