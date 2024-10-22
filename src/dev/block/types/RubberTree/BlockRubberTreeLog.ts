class BlockRubberTreeLog extends BlockBase {
	constructor() {
		super("rubberTreeLog", "wood");
		const name = "rubber_tree_log";
		const texture_side: [string, number] = ["rubber_wood", 0];
		const texture_side2: [string, number] = ["rubber_wood", 2];
		const texture_top: [string, number] = ["rubber_wood", 1];
		this.addVariation(name, [texture_top, texture_top, texture_side, texture_side, texture_side, texture_side], true);
		this.addVariation(name, [texture_side, texture_side, texture_top, texture_top, texture_side2, texture_side2]);
		this.addVariation(name, [texture_side2, texture_side2, texture_side2, texture_side2, texture_top, texture_top]);
		this.setCategory(ItemCategory.NATURE);
		this.setBlockMaterial("wood");
	}

	getDrop(coords: Vector, block: Tile, level: number): ItemInstanceArray[] {
		return [[block.id, 1, 0]];
	}

	onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void {
		if (World.canTileBeReplaced(block.id, block.data)) {
			var place = coords as Vector;
			var rotation = 0;
		} else {
			var place = coords.relative;
			var rotation = Math.floor(coords.side / 2);
		}

		region.setBlock(place.x, place.y, place.z, item.id, rotation);
		//World.playSound(place.x + .5, place.y + .5, place.z + .5, "dig.wood", 1, 0.8)
	}
}
