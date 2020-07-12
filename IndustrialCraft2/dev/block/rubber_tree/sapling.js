var DIRT_TILES = {
	2: true,
	3: true,
	60: true
};

function placeRubberSapling(coords, item){
	var place = coords.relative;
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (World.canTileBeReplaced(tile1.id, tile1.data) && DIRT_TILES[tile2.id]) {
		World.setBlock(place.x, place.y, place.z, BlockID.rubberTreeSapling);
		if (Game.isItemSpendingAllowed()) {
			Player.setCarriedItem(BlockID.rubberTreeSapling, item.count - 1, 0);
		}
		World.playSound(place.x, place.y, place.z, "dig.grass", 1, 0.8);
	}
}

// legacy
IDRegistry.genItemID("rubberSapling");
Item.createItem("rubberSapling", "Rubber Tree Sapling", {name: "rubber_tree_sapling", data: 0}, {isTech: true});

Item.registerUseFunction("rubberSapling", function(coords, item, block) {
	placeRubberSapling(coords, item);
});

IDRegistry.genBlockID("rubberTreeSapling");
Block.createBlock("rubberTreeSapling", [
	{name: "Rubber Tree Sapling", texture: [["rubber_tree_sapling", 0]], inCreative: true}
], {rendertype: 1, sound: "grass"});
Block.setDestroyTime(BlockID.rubberTreeSapling, 0);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeSapling, "plant");
Block.setShape(BlockID.rubberTreeSapling, 1/8, 0, 1/8, 7/8, 1, 7/8);
TileRenderer.setEmptyCollisionShape(BlockID.rubberTreeSapling);

Recipes.addFurnaceFuel(BlockID.rubberTreeSapling, -1, 100);

Block.registerDropFunction("rubberTreeSapling", function() {
	return [[BlockID.rubberTreeSapling, 1, 0]];
});

Item.registerUseFunctionForID(BlockID.rubberTreeSapling, function(coords, item, block) {
	placeRubberSapling(coords, item);
});

Block.setRandomTickCallback(BlockID.rubberTreeSapling, function(x, y, z) {
	if (!DIRT_TILES[World.getBlockID(x, y-1, z)]) {
		World.destroyBlock(x, y, z, true);
	}
	else if (Math.random() < 0.05 && World.getLightLevel(x, y, z) >= 9) {
		RubberTreeGenerator.generateRubberTree(x, y, z);
	}
});

// bone use
Callback.addCallback("ItemUse", function(coords, item, block) {
	if (item.id == 351 && item.data == 15 && block.id == BlockID.rubberTreeSapling) {
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		for (var i = 0; i < 16; i++) {
			var px = coords.x + Math.random();
			var pz = coords.z + Math.random();
			var py = coords.y + Math.random();
			Particles.addParticle(ParticleType.happyVillager, px, py, pz, 0, 0, 0);
		}
		if (Math.random() < 0.25 || !Game.isItemSpendingAllowed()) {
			RubberTreeGenerator.generateRubberTree(coords.x, coords.y, coords.z);
		}
	}
});

Callback.addCallback("DestroyBlock", function(coords, block, player) {
	if (World.getBlockID(coords.x, coords.y + 1, coords.z) == BlockID.rubberTreeSapling) {
		World.destroyBlock(coords.x, coords.y + 1, coords.z, true);
	}
});
