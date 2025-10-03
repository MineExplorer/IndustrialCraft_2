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
            const rotation = BlockRegistry.getBlockRotation(player);
            let placeData = rotation - 2;
            const vec = World.getVectorByBlockSide(rotation);
            const posLeft = new Vector3(coords.relative.x - vec.z, coords.relative.y, coords.relative.z + vec.x);
            const posRight = new Vector3(coords.relative.x + vec.z, coords.relative.y, coords.relative.z - vec.x);
            const leftBlockId = region.getBlockId(posLeft);
            const leftSolidBlocks= (+Block.isSolid(leftBlockId)) + (+Block.isSolid(region.getBlockId(posLeft.x, posLeft.y + 1, posLeft.z)));
            const rightSolidBlocks = (+Block.isSolid(region.getBlockId(posRight))) + (+Block.isSolid(region.getBlockId(posRight.x, posRight.y + 1, posRight.z)));
            if (leftBlockId == BlockID.reinforcedDoor || rightSolidBlocks > leftSolidBlocks) {
                placeData += 4;
            }
            region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, doorBlockId, placeData);
            region.setBlock(coords.relative.x, coords.relative.y + 1, coords.relative.z, doorBlockId, placeData + 8);
            if (Game.isItemSpendingAllowed(player)) {
                Entity.setCarriedItem(player, item.id, item.count - 1, item.data, item.extra);
            }
            region.playSound(coords.relative.x + 0.5, coords.relative.y + 0.5, coords.relative.z + 0.5, "dig.stone", 1, MathUtil.randomFloat(0.8, 1));
        }
	}
}

ItemRegistry.registerItem(new ItemReinforcedDoor("reinforcedDoor", "reinforced_door"));

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.reinforcedDoor, count: 1, data: 0}, [
		"aba",
		"aba",
		"aba"
	], ['a', ItemID.plateIron, 0, 'b', ItemID.plateLead, 0]);
});