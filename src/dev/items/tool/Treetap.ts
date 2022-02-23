class ItemTreetap extends ItemCommon {
	constructor() {
		super("treetap", "treetap", "treetap");
		this.setMaxStack(1);
		this.setMaxDamage(17);
		this.setCategory(ItemCategory.EQUIPMENT);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		if (block.id == BlockID.rubberTreeLogLatex && block.data >= 4 && block.data == coords.side + 2) {
			let region = WorldRegion.getForActor(player);
			SoundManager.playSoundAt(coords.vec.x, coords.vec.y, coords.vec.z, "Treetap.ogg");
			region.setBlock(coords, BlockID.rubberTreeLogLatex, block.data - 4);
			Entity.setCarriedItem(player, item.id, ++item.data < 17 ? item.count : 0, item.data);
			const entity = region.dropAtBlock(
				coords.relative.x,
				coords.relative.y,
				coords.relative.z,
				ItemID.latex, MathUtil.randomInt(1, 3), 0
			);
			Entity.setVelocity(entity,
				(coords.relative.x - coords.x) * 0.25,
				(coords.relative.y - coords.y) * 0.25,
				(coords.relative.z - coords.z) * 0.25
			);
		}
	}
}
