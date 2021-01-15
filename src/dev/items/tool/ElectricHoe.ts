class ElectricHoe
extends ItemElectric {
	constructor() {
		super("electricHoe", "electric_hoe", 10000, 100, 1);
		this.setHandEquipped(true);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void {
		if ((block.id == 2 || block.id == 3 || block.id == 110 || block.id == 243) && coords.side == 1 && ICTool.useElectricItem(item, 50, player)) {
			let region = WorldRegion.getForActor(player);
			region.setBlock(coords, 60, 0);
			region.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.gravel", 1, 0.8);
		}
	}
}
