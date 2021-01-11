class ItemElectricHoe
extends ItemElectric {
	constructor(stringID: string, name: string, maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, maxCharge, transferLimit, tier);
		this.setHandEquipped(true);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
		if ((block.id == 2 || block.id == 3 || block.id == 110 || block.id == 243) && coords.side == 1 && ICTool.useElectricItem(item, 50)) {
			let region = WorldRegion.getForActor(player);
			region.setBlock(coords, 60, 0);
			World.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.gravel", 1, 0.8);
		}
	}
}

new ItemElectricHoe("electricHoe", "electric_hoe", 10000, 100, 1);

Recipes.addShaped({id: ItemID.electricHoe, count: 1, data: 27}, [
	"pp",
	" p",
	" x"
], ['x', ItemID.powerUnitSmall, 0, 'p', ItemID.plateIron, 0]);
