IDRegistry.genBlockID("rubberTreeLeaves");
Block.createBlock("rubberTreeLeaves", [
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false},
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false},
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: true}
]);
Block.registerDropFunction("rubberTreeLeaves", function(coords, blockID, blockData, level, enchant){
	if(level > 0 || Player.getCarriedItem().id == 359){
		return [[blockID, 1, 2]];
	}
	if(Math.random() < .04){
		return [[ItemID.rubberSapling, 1, 0]]
	}
	return [];
});

Block.setDestroyTime(BlockID.rubberTreeLeaves, 0.2);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLeaves, "plant");

function checkLeaves(x, y, z, explored){
	let blockID = World.getBlockID(x, y, z);
	if(blockID == BlockID.rubberTreeLog || blockID == BlockID.rubberTreeLogLatex){
		return true;
	}
	if(blockID == BlockID.rubberTreeLeaves){
		explored[x+':'+y+':'+z] = true;
	}
	return false;
}

function checkLeavesFor6Sides(x, y, z, explored){
	return checkLeaves(x-1, y, z, explored) ||
	checkLeaves(x+1, y, z, explored) ||
	checkLeaves(x, y, z-1, explored) ||
	checkLeaves(x, y, z+1, explored) ||
	checkLeaves(x, y-1, z, explored) ||
	checkLeaves(x, y+1, z, explored);
}

function updateLeaves(x, y, z){
	for(let xx = x - 1; xx <= x + 1; xx++){
		for(let yy = y - 1; yy <= y + 1; yy++){
			for(let zz = z - 1; zz <= z + 1; zz++){
				let block = World.getBlock(xx, yy, zz);
				if(block.id == BlockID.rubberTreeLeaves && block.data == 0){
					World.setBlock(xx, yy, zz, BlockID.rubberTreeLeaves, 1);
				}
			}
		}
	}
}

Block.setRandomTickCallback(BlockID.rubberTreeLeaves, function(x, y, z, id, data){
	if(data == 1){
		let explored = {};
		explored[x+':'+y+':'+z] = true;
		for(let i = 0; i < 4; i++){
			let checkingLeaves = explored;
			explored = {};
			for(let coords in checkingLeaves){
				let c = coords.split(':');
				if(checkLeavesFor6Sides(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]), explored)){
					World.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
					return;
				}
			}
		}
		World.setBlock(x, y, z, 0);
		updateLeaves(x, y, z);
		let dropFunc = Block.dropFunctions[id];
		let drop = dropFunc(null, id, data, 0, {});
		for(let i in drop){
			World.drop(x, y, z, drop[i][0], drop[i][1], drop[i][2]);
		}
	}
});

Callback.addCallback("DestroyBlock", function(coords, block, player){
	updateLeaves(coords.x, coords.y, coords.z);
});
