IDRegistry.genItemID("weeding_trowel");
Item.createItem("weeding_trowel", "Weeding Trowel", {name: "weeding_trowel"}, {stack: 1});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.weeding_trowel , count: 1 , data: 0}, [
		"c c",
		" c ",
		"zcz"
	], ['c', 265, 0, 'z', ItemID.rubber, 0]);
});

Item.registerUseFunction("weeding_trowel",function(coords, item, block){
    var te = World.getTileEntity(coords.x, coords.y, coords.z);
    if(block.id == BlockID.crop && te.crop && te.crop.id == "weed"){
        World.drop(coords.x, coords.y, coords.z, ItemID.weed, te.data.currentSize, 0);
        te.reset();
        te.updateRender();
    }
});