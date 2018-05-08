IDRegistry.genItemID("latex");
Item.createItem("latex", "Latex", {name: "latex", data: 0});

IDRegistry.genItemID("rubber");
Item.createItem("rubber", "Rubber", {name: "rubber", data: 0});

Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);

Recipes.addShaped({id: 50, count: 4, data: 0}, [
	"a",
	"b"
], ['a', ItemID.latex, 0, 'b', 280, 0]);

Recipes.addShaped({id: 29, count: 1, data: 0}, [
	"a",
	"b"
], ['a', ItemID.latex, 0, 'b', 33, 0]);