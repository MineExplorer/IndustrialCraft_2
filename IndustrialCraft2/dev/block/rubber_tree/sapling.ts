let DIRT_TILES = {
	2: true,
	3: true,
	60: true
};

function placeRubberSapling(coords: Callback.ItemUseCoordinates, item: ItemInstance, region: BlockSource) {
	let place = coords.relative;
	let tile1 = region.getBlock(place.x, place.y, place.z);
	let tile2 = region.getBlock(place.x, place.y - 1, place.z);

	if (World.canTileBeReplaced(tile1.id, tile1.data) && DIRT_TILES[tile2.id]) {
		region.setBlock(place.x, place.y, place.z, BlockID.rubberTreeSapling, 0);
		if (Game.isItemSpendingAllowed(player)) {
			Entity.setCarriedItem(player, BlockID.rubberTreeSapling, item.count - 1, 0);
		}
		World.playSound(place.x, place.y, place.z, "dig.grass", 1, 0.8);
	}
}

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

Block.registerNeighbourChangeFunction("rubberTreeSapling", function(coords, block, changeCoords, region) {
	if (changeCoords.y < coords.y && !DIRT_TILES[region.getBlockId(coords.x, coords.y - 1, coords.z)]) {
		region.destroyBlock(coords.x, coords.y, coords.z, true);
	}
});

Block.setRandomTickCallback(BlockID.rubberTreeSapling, function(x, y, z, id, data, region) {
	if (!DIRT_TILES[region.getBlockId(x, y-1, z)]) {
		region.destroyBlock(x, y, z, true);
	}
	else if (Math.random() < 0.05 && region.getLightLevel(x, y, z) >= 9) {
		RubberTreeGenerator.generateRubberTree(x, y, z, region);
	}
});

Item.registerUseFunctionForID(BlockID.rubberTreeSapling, function(coords, item, block, player) {
	placeRubberSapling(coords, item, BlockSource.getDefaultForActor(player));
});

// bone use
Callback.addCallback("ItemUse", function(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal: boolean, player: number) {
	if (item.id == 351 && item.data == 15 && block.id == BlockID.rubberTreeSapling) {
		Entity.setCarriedItem(player, item.id, item.count - 1, item.data);
		for (let i = 0; i < 16; i++) {
			let px = coords.x + Math.random();
			let pz = coords.z + Math.random();
			let py = coords.y + Math.random();
			Particles.addParticle(ParticleType.happyVillager, px, py, pz, 0, 0, 0);
		}
		if (Math.random() < 0.25 || !Game.isItemSpendingAllowed(player)) {
			let region = BlockSource.getDefaultForActor(player);
			RubberTreeGenerator.generateRubberTree(coords.x, coords.y, coords.z, region);
		}
	}
});

// legacy
IDRegistry.genItemID("rubberSapling");
Item.createItem("rubberSapling", "Rubber Tree Sapling", {name: "rubber_tree_sapling", data: 0}, {isTech: true});

Item.registerUseFunction("rubberSapling", function(coords, item, block, player) {
	placeRubberSapling(coords, item, BlockSource.getDefaultForActor(player));
});