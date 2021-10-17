IDRegistry.genBlockID("rubberTreeLeaves");
Block.createBlock("rubberTreeLeaves", [
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false},
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false},
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: true}
], {
	destroytime: 0.2,
	explosionres: 1,
	renderallfaces: true,
	renderlayer: 1,
	lightopacity: 1,
	translucency: 0.5,
	sound: "grass"
});
Item.setCategory(BlockID.rubberTreeLeaves, ItemCategory.NATURE);

Block.registerDropFunction("rubberTreeLeaves", function(coords: Vector, blockID: number, blockData: number, level: number, enchant: ToolAPI.EnchantData, item: ItemInstance) {
	if (level > 0 || item.id == 359) {
		return [[blockID, 1, 2]];
	}
	let drop = [];
	if (Math.random() < .04) {
		drop.push([BlockID.rubberTreeSapling, 1, 0]);
	}
	if (Math.random() < .02) {
		drop.push([280, 1, 0]);
	}
	return drop;
});

ToolAPI.registerBlockMaterial(BlockID.rubberTreeLeaves, "plant");

function checkLeaves(x: number, y: number, z: number, region: BlockSource, explored: {}): boolean {
	let blockID = region.getBlockId(x, y, z);
	if (blockID == BlockID.rubberTreeLog || blockID == BlockID.rubberTreeLogLatex) {
		return true;
	}
	if (blockID == BlockID.rubberTreeLeaves) {
		explored[x+':'+y+':'+z] = true;
	}
	return false;
}

function checkLeavesFor6Sides(x: number, y: number, z: number, region: BlockSource, explored: {}): boolean {
	return checkLeaves(x-1, y, z, region, explored) ||
	checkLeaves(x+1, y, z, region, explored) ||
	checkLeaves(x, y, z-1, region, explored) ||
	checkLeaves(x, y, z+1, region, explored) ||
	checkLeaves(x, y-1, z, region, explored) ||
	checkLeaves(x, y+1, z, region, explored);
}

function updateLeaves(x: number, y: number, z: number, region: BlockSource): void {
	for (let xx = x - 1; xx <= x + 1; xx++) {
		for (let yy = y - 1; yy <= y + 1; yy++) {
			for (let zz = z - 1; zz <= z + 1; zz++) {
				let block = region.getBlock(xx, yy, zz);
				if (block.id == BlockID.rubberTreeLeaves && block.data == 0) {
					region.setBlock(xx, yy, zz, BlockID.rubberTreeLeaves, 1);
				}
			}
		}
	}
}

Block.setRandomTickCallback(BlockID.rubberTreeLeaves, function(x, y, z, id, data, region) {
	if (data == 1) {
		let explored = {};
		explored[x+':'+y+':'+z] = true;
		for (let i = 0; i < 4; i++) {
			let checkingLeaves = explored;
			explored = {};
			for (let coords in checkingLeaves) {
				let c = coords.split(':');
				if (checkLeavesFor6Sides(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]), region, explored)) {
					region.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
					return;
				}
			}
		}
		region.setBlock(x, y, z, 0, 0);
		updateLeaves(x, y, z, region);
		if (Math.random() < .04) {
			region.spawnDroppedItem(x, y, z, BlockID.rubberTreeSapling, 1, 0);
		}
		if (Math.random() < .02) {
			region.spawnDroppedItem(x, y, z, 280, 1, 0);
		}
	}
});

Callback.addCallback("DestroyBlock", function(coords: Vector, block: Tile, player: number) {
	updateLeaves(coords.x, coords.y, coords.z, BlockSource.getDefaultForActor(player));
});
