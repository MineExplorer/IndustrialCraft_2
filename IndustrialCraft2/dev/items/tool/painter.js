IDRegistry.genItemID("icPainter");
Item.createItem("icPainter", "Painter", {name: "painter", meta: 0});

Recipes.addShaped({id: ItemID.icPainter, count: 1, data: 0}, [
	" aa",
	" xa",
	"x  "
], ['x', 265, -1, 'a', 35, 0]);