IDRegistry.genItemID("fertilizer");
Item.createItem("fertilizer", "Fertilizer", {name: "fertilizer"});

IDRegistry.genItemID("weedEx");
Item.createItem("weedEx", "Weed EX", {name: "weed_ex"}, {stack: 1});
Item.setMaxDamage(ItemID.weedEx, 10);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShapeless({id: ItemID.fertilizer, count: 2, data: 0}, [{id: ItemID.scrap, data: 0}, {id: 351, data: 15}]);
	Recipes.addShapeless({id: ItemID.fertilizer, count: 2, data: 0}, [{id: ItemID.scrap, data: 0}, {id: ItemID.ashes, data: 0}]);
	Recipes.addShapeless({id: ItemID.fertilizer, count: 2, data: 0}, [{id: ItemID.scrap, data: 0}, {id: ItemID.scrap, data: 0}, {id: ItemID.fertilizer, data: 0}]);
	
	Recipes.addShaped({id: ItemID.weedEx, count: 1, data: 0}, [
        "z",
        "x",
        "c"
    ], ['z', 331, 0, 'x', ItemID.grinPowder, 0, 'c', ItemID.cellEmpty, 0]);
});