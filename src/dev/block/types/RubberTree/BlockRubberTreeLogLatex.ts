class BlockRubberTreeLogLatex extends BlockBase {
	constructor() {
		super("rubberTreeLogLatex", {
			extends: "wood",
			flameOdds: 5,
			burnOdds: 5,
		});
		this.addVariation("rubber_tree_log_latex", [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]]);
		this.addVariation("rubber_tree_log_latex", [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]]);
		this.setBlockMaterial("wood");
	}

	createBlock() {
		Block.createBlockWithRotation(this.stringID, this.variations, this.blockType);
		this.isDefined = true;
	}

	getDrop(): ItemInstanceArray[] {
		return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
	}

	onRandomTick(x: number, y: number, z: number, block: Tile, region: BlockSource): void {
		if (block.data < 4 && Math.random() < 1/7) {
			// check that block is part of a grown tree
			let checkY = y - 1;
			while (checkY > 0) {
				const blockId = region.getBlockId(x, checkY, z);
				if (BlockRubberTreeSapling.PLACEABLE_TILES[blockId]) {
					region.setBlock(x, y, z, block.id, block.data + 4);
					break;
				}
				else if (blockId != BlockID.rubberTreeLog && blockId != BlockID.rubberTreeLogLatex) {
					break;
				}
				checkY--;
			}
		}
	}
}