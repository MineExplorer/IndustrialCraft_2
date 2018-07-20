IDRegistry.genItemID("coolantCell");
Item.createItem("coolantCell", "Coolant Cell", {name: "coolant_cell"});

Recipes.addShaped({id: ItemID.coolantCell, count: 1, data: 0}, [
	" a ",
	"axa",
	" a ",
], ['x', 373, 0, 'a', ItemID.plateTin, 0]);

Recipes.addShaped({id: ItemID.coolantCell, count: 1, data: 0}, [
	" a ",
	"axa",
	" a ",
], ['x', ItemID.cellWater, 0, 'a', ItemID.plateTin, 0]);