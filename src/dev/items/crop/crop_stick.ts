ItemRegistry.createItem("cropStick", {name: "crop_stick", icon: "crop_stick"});

Recipes.addShaped({id: ItemID.cropStick , count: 2 , data: 0}, [
	"x x",
	"x x"
], ['x', 280, 0]);

Item.registerUseFunction("cropStick", function(coords, item, block, player) {
    if (block.id == 60 && coords.side == 1) {
		let region = WorldRegion.getForActor(player);
		let place = coords.relative;
		let tile = region.getBlock(place);
		if (World.canTileBeReplaced(tile.id, tile.data)) {
			region.setBlock(place, BlockID.crop, 0);
			region.addTileEntity(place);
			Entity.setCarriedItem(player, item.id, item.count - 1, 0);
		}
    }
});
