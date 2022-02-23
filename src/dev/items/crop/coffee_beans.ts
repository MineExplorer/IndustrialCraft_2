ItemRegistry.createItem("coffeeBeans", {name: "coffee_beans", icon: "coffee_beans"});
ItemRegistry.createItem("coffeePowder", {name: "coffee_powder", icon: "coffee_powder"});

Recipes.addShapeless({id: ItemID.coffeePowder, count: 1, data: 0}, [{id: ItemID.coffeeBeans, data: 0}]);