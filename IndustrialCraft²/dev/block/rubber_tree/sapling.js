var DIRT_TILES = {
	2: true,
	3: true,
	60: true
};

IDRegistry.genItemID("rubberSapling");
Item.createItem("rubberSapling", "Rubber Tree Sapling", {name: "rubber_tree_sapling", data: 0});

Item.registerUseFunction("rubberSapling", function(coords, item, block){
	var place = coords.relative;
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (canTileBeReplaced(tile1.id, tile1.data) && DIRT_TILES[tile2.id]) {
		World.setBlock(place.x, place.y, place.z, BlockID.rubberTreeSapling);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

IDRegistry.genBlockID("rubberTreeSapling");
Block.createBlock("rubberTreeSapling", [
	{name: "Rubber Tree Sapling", texture: [["rubber_tree_sapling", 0]], inCreative: false}
]);
Block.setDestroyTime(BlockID.rubberTreeSapling, 0);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeSapling, "plant");
TileRenderer.setPlantModel(BlockID.rubberTreeSapling, 0, "rubber_tree_sapling", 0);

Block.registerDropFunction("rubberTreeSapling", function(){
	return [[ItemID.rubberSapling, 1, 0]];
});

Block.setRandomTickCallback(BlockID.rubberTreeSapling, function(x, y, z){
	if(!DIRT_TILES[World.getBlockID(x, y-1, z)]){
		World.destroyBlock(x, y, z, true);
	}
	else if(Math.random() < 0.05 && World.getLightLevel(x, y, z) >= 9){
		RubberTreeGenerationHelper.generateRubberTree(x, y, z);
	}
});

// bone use
Callback.addCallback("ItemUse", function(coords, item, block){
	if(item.id == 351 && item.data == 15 && block.id == BlockID.rubberTreeSapling){
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		for(var i = 0; i < 16; i++){
			var px = coords.x + Math.random();
			var pz = coords.z + Math.random();
			var py = coords.y + Math.random(); 
			Particles.addFarParticle(ParticleType.happyVillager, px, py, pz, 0, 0, 0);
		}
		if(Math.random() < 0.25){
			RubberTreeGenerationHelper.generateRubberTree(coords.x, coords.y, coords.z);
		}
	}
});

Callback.addCallback("DestroyBlock", function(coords, block, player){
	if(World.getBlockID(coords.x, coords.y+1, coords.z) == BlockID.rubberTreeSapling){
		World.destroyBlock(coords.x, coords.y+1, coords.z, true);
	}
});
