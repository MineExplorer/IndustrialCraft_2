class ItemReinforcedDoor extends ItemCommon
implements ItemBehavior {
	constructor(stringID: string, name: string, texture: string | Item.TextureData = name) {
		super(stringID, name, texture);
        this.setCategory(ItemCategory.BUILDING);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        const region = WorldRegion.getForActor(player);
        const tileBelow = region.getBlock(coords.relative.x, coords.relative.y - 1, coords.relative.z);
        const tile1 = region.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
        const tile2 = region.getBlock(coords.relative.x, coords.relative.y + 1, coords.relative.z);
        if (Block.isSolid(tileBelow.id) && 
            World.canTileBeReplaced(tile1.id, tile1.data) && 
            World.canTileBeReplaced(tile2.id, tile2.data)
        ) {
            const doorBlockId = Block.getNumericId(this.stringID);
            const rotation = BlockRegistry.getBlockRotation(player) - 2;
            region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, doorBlockId, rotation);
            region.setBlock(coords.relative.x, coords.relative.y + 1, coords.relative.z, doorBlockId, rotation + 8);
            if (Game.isItemSpendingAllowed(player)) {
                Entity.setCarriedItem(player, item.id, item.count - 1, item.data, item.extra);
            }
        }
	}
}

ItemRegistry.registerItem(new ItemReinforcedDoor("reinforcedDoor", "reinforced_door"));