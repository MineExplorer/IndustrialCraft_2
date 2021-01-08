class ItemTreetap
extends ItemIC2 {
	constructor() {
		super("treetap", "Treetap", "treetap");
		this.setMaxStack(1);
		this.setMaxDamage(17);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
		if (block.id == BlockID.rubberTreeLogLatex && block.data >= 4 && block.data == coords.side + 2) {
			let region = WorldRegion.getForActor(player);
			SoundManager.playSoundAt(coords.vec.x, coords.vec.y, coords.vec.z, "Treetap.ogg");
			region.setBlock(coords, BlockID.rubberTreeLogLatex, block.data - 4);
			Entity.setCarriedItem(player, item.id, ++item.data < 17 ? item.count : 0, item.data);
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

new ItemTreetap();

Recipes.addShaped({id: ItemID.treetap, count: 1, data: 0}, [
	" x ",
	"xxx",
	"x  "
], ['x', 5, -1]);