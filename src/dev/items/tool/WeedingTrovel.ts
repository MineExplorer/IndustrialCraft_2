class ItemWeedingTrowel extends ItemCommon {
    constructor() {
        super("weedingTrowel", "weeding_trowel", "weeding_trowel");
        this.setMaxStack(1);
        this.setCategory(ItemCategory.EQUIPMENT);
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        let region = WorldRegion.getForActor(player);
        let te = region.getTileEntity(coords) as Agriculture.CropTile;
        if (block.id == BlockID.crop && te.crop && te.crop.getID() == "weed") {
            region.dropAtBlock(coords.x, coords.y, coords.z, ItemID.weed, te.data.currentSize, 0);
            te.reset();
            te.updateRender();
        }
    }
}
