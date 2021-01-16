class ItemWeedingTrowel
extends ItemCommon {
    constructor() {
        super("weedingTrowel", "weeding_trowel", "weeding_trowel");
        this.setMaxStack(1);
        this.setCategory(ItemCategory.EQUIPMENT);
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        let region = WorldRegion.getForActor(player);
        let te = region.getTileEntity(coords);
        if (block.id == BlockID.crop && te.crop && te.crop.id == "weed") {
            region.dropItem(coords.x + .5, coords.y + .5, coords.z + .5, ItemID.weed, te.data.currentSize, 0);
            te.reset();
            te.updateRender();
        }
    }
}
