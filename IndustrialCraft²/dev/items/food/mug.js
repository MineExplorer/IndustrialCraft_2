IDRegistry.genItemID("mugEmpty");
Item.createItem("mugEmpty", "Empty Mug", {name: "mug_empty"}, {stack: 1});
Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.mugEmpty, count: 1, data: 0}, [
		"xx ",
		"xxx",
		"xx ",
	], ['x', 1, -1]);
});