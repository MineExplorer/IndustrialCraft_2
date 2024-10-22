class BlockRubberTreeLeaves extends BlockBase {
	constructor() {
		super("rubberTreeLeaves", "leaves");
		const name = "rubber_tree_leaves";
		for (let i = 0; i < 3; i++) {
			this.addVariation(name, [[name, 0]], i == 2);
		}
		this.setCategory(ItemCategory.NATURE);
		this.setBlockMaterial("plant");
	}

	getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
		if (level > 0 || enchant.silk || item?.id == 359) {
			return [[block.id, 1, 2]];
		}
		const drop = [];
		if (Math.random() < .04) {
			drop.push([BlockID.rubberTreeSapling, 1, 0]);
		}
		if (Math.random() < .02) {
			drop.push([280, 1, 0]);
		}
		return drop;
	}

	checkLeaves(x: number, y: number, z: number, region: BlockSource, explored: {}): boolean {
		const blockID = region.getBlockId(x, y, z);
		if (blockID == BlockID.rubberTreeLog || blockID == BlockID.rubberTreeLogLatex) {
			return true;
		}
		if (blockID == BlockID.rubberTreeLeaves) {
			explored[x+':'+y+':'+z] = true;
		}
		return false;
	}

	checkLeavesFor6Sides(x: number, y: number, z: number, region: BlockSource, explored: {}): boolean {
		return this.checkLeaves(x-1, y, z, region, explored) ||
			this.checkLeaves(x+1, y, z, region, explored) ||
			this.checkLeaves(x, y, z-1, region, explored) ||
			this.checkLeaves(x, y, z+1, region, explored) ||
			this.checkLeaves(x, y-1, z, region, explored) ||
			this.checkLeaves(x, y+1, z, region, explored);
	}

	updateLeaves(x: number, y: number, z: number, region: BlockSource): void {
		for (let xx = x - 1; xx <= x + 1; xx++) {
			for (let yy = y - 1; yy <= y + 1; yy++) {
				for (let zz = z - 1; zz <= z + 1; zz++) {
					const block = region.getBlock(xx, yy, zz);
					if (block.id == BlockID.rubberTreeLeaves && block.data == 0) {
						region.setBlock(xx, yy, zz, BlockID.rubberTreeLeaves, 1);
					}
				}
			}
		}
	}

	onRandomTick(x: number, y: number, z: number, block: Tile, region: BlockSource): void {
		if (block.data == 1) {
			let explored = {};
			explored[x+':'+y+':'+z] = true;
			for (let i = 0; i < 4; i++) {
				const checkingLeaves = explored;
				explored = {};
				for (let coords in checkingLeaves) {
					const coordArray = coords.split(':').map((c) => parseInt(c));
					if (this.checkLeavesFor6Sides(coordArray[0], coordArray[1], coordArray[2], region, explored)) {
						region.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
						return;
					}
				}
			}
			region.setBlock(x, y, z, 0, 0);
			this.updateLeaves(x, y, z, region);
			const drop = this.getDrop(new Vector3(x, y, z), block, 0, ToolAPI.getEnchantExtraData(), null, region);
			for (let item of drop) {
				region.spawnDroppedItem(x, y, z, item[0], item[1], item[2]);
			}
		}
	}

	onDestroy(coords: Vector, block: Tile, region: BlockSource, player: number): void {
		this.updateLeaves(coords.x, coords.y, coords.z, region);
	}

	onBreak(coords: Vector, block: Tile, region: BlockSource) {
		super.onBreak(coords, block, region);
		this.updateLeaves(coords.x, coords.y, coords.z, region);
	}
}
