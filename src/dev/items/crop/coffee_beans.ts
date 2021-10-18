ItemRegistry.createItem("coffeeBeans", {name: "coffee_beans", icon: "coffee_beans"});
ItemRegistry.createItem("coffeePowder", {name: "coffee_powder", icon: "coffee_powder"});

addSingleItemRecipe("coffee_powder", "item:coffeeBeans", "item:coffeePowder");