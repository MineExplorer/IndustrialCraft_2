IDRegistry.genItemID("cropStick");
Item.createItem("cropStick", "Crop", {name: "crop_stick"});

Recipes.addShaped({id: ItemID.cropStick , count: 2 , data: 0}, [
	"x x",
	"x x"
], ['x', 280, 0]);

Item.registerUseFunction("cropStick", function(coords, item, block){
    if(block.id == 60 && coords.side == 1){
		var place = coords.relative;
		var tile = World.getBlock(place.x, place.y, place.z);
		if(canTileBeReplaced(tile.id, tile.data)){
			World.setBlock(place.x, place.y, place.z, BlockID.crop, 0);
			World.addTileEntity(place.x, place.y, place.z);
			Player.decreaseCarriedItem(1);
		}
    }
});