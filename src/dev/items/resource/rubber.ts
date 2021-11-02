ItemRegistry.createItem("latex", {name: "latex", icon: "latex"});
ItemRegistry.createItem("rubber", {name: "rubber", icon: "rubber"});

Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);

VanillaRecipe.addShapedRecipe("alternative_sticky_piston", {
	pattern: [
		"S",
		"P"
	],
	key: {
		"P": { item: "piston" },
		"S": { item: "item:latex" }
	},
	result: {
		item: "sticky_piston"
	}
}, true);

VanillaRecipe.addShapedRecipe("alternative_torch", {
	pattern: [
		"X",
    	"#"
	],
	key: {
		"X": { item: "item:latex" },
		"#": { item: "stick" }
	},
	result: {
		item: "torch",
		count: 4
	}
}, true);
