class BlockRubberTreeLogLatex extends BlockBase {
	constructor() {
		super("rubberTreeLogLatex", "wood");
		this.addVariation("tile.rubberTreeLogLatex.name", [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]]);
		this.addVariation("tile.rubberTreeLogLatex.name", [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]]);
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
			region.setBlock(x, y, z, block.id, block.data + 4);
		}
	}
}