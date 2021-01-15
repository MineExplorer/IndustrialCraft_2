class ElectricTreetap
extends ItemElectric {
	constructor() {
		super("electricTreetap", "electric_treetap", 10000, 100, 1);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void {
		if (block.id == BlockID.rubberTreeLogLatex && block.data >= 4 && block.data == coords.side + 2 && ICTool.useElectricItem(item, 50, player)) {
			let region = WorldRegion.getForActor(player);
			SoundManager.playSoundAt(coords.vec.x, coords.vec.y, coords.vec.z, "Treetap.ogg");
			region.setBlock(coords, BlockID.rubberTreeLogLatex, block.data - 4);
			Entity.setVelocity(
				region.dropItem(
					coords.relative.x + 0.5,
					coords.relative.y + 0.5,
					coords.relative.z + 0.5,
					ItemID.latex, randomInt(1, 3), 0
				),
				(coords.relative.x - coords.x) * 0.25,
				(coords.relative.y - coords.y) * 0.25,
				(coords.relative.z - coords.z) * 0.25
			);
		}
	}
}
