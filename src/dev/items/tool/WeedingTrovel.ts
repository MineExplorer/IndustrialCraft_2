class ItemWeedingTrowel
extends ItemIC2 {
    constructor() {
        super("weedingTrowel", "weeding_trowel");
        this.setMaxStack(1);
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void {
        let region = WorldRegion.getForActor(player);
        let te = region.getTileEntity(coords);
        if (block.id == BlockID.crop && te.crop && te.crop.id == "weed") {
            region.dropItem(coords.x + .5, coords.y + .5, coords.z + .5, ItemID.weed, te.data.currentSize, 0);
            te.reset();
            te.updateRender();
        }
    }
}

new ItemWeedingTrowel();

Callback.addCallback("PostLoaded", function() {
	Recipes.addShaped({id: ItemID.weedingTrowel , count: 1 , data: 0}, [
		"c c",
		" c ",
		"zcz"
	], ['c', 265, 0, 'z', ItemID.rubber, 0]);
});