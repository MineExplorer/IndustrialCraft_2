ItemRegistry.createItem("latex", {name: "Latex", icon: "latex"});
ItemRegistry.createItem("rubber", {name: "Rubber", icon: "rubber"});

Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);

Recipes.addShaped({id: 50, count: 4, data: 0}, [
	"x",
	"#"
], ['x', ItemID.latex, 0, '#', 280, 0]);

Recipes.addShaped({id: 29, count: 1, data: 0}, [
	"x",
	"p"
], ['x', ItemID.latex, 0, 'p', 33, 0]);