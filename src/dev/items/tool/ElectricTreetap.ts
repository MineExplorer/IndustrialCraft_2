class ElectricTreetap extends ItemElectric {
	energyPerUse = 50;

	constructor() {
		super("electricTreetap", "electric_treetap", 10000, 100, 1);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		if (block.id == BlockID.rubberTreeLogLatex && block.data >= 4 && block.data == coords.side + 2 && ICTool.useElectricItem(item, this.energyPerUse, player)) {
			const region = WorldRegion.getForActor(player);
			SoundManager.playSoundAt(coords.vec.x, coords.vec.y, coords.vec.z, "Treetap.ogg");
			region.setBlock(coords, BlockID.rubberTreeLogLatex, block.data - 4);
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
