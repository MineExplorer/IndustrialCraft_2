let DIRT_TILES = {
	2: true,
	3: true,
	60: true
};

IDRegistry.genBlockID("rubberTreeSapling");
Block.createBlock("rubberTreeSapling", [
	{name: "Rubber Tree Sapling", texture: [["rubber_tree_sapling", 0]], inCreative: true}
], {rendertype: 1, sound: "grass"});
Item.setCategory(BlockID.rubberTreeSapling, ItemCategory.NATURE);
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
		RubberTreeGenerator.growRubberTree(region, x, y, z);
	}
});

Item.registerUseFunctionForID(BlockID.rubberTreeSapling, function(coords, item, block, player) {
	let place = coords.relative;
	let region = BlockSource.getDefaultForActor(player);
	let tile1 = region.getBlock(place.x, place.y, place.z);
	let tile2 = region.getBlock(place.x, place.y - 1, place.z);

	if (!World.canTileBeReplaced(tile1.id, tile1.data) || !DIRT_TILES[tile2.id]) {
		Game.prevent();
	}
});

// bone use
Callback.addCallback("ItemUse", function(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal: boolean, playerUid: number) {
	const boneMeal = IDConverter.getIDData("bone_meal");
	if (block.id == BlockID.rubberTreeSapling && item.id == boneMeal.id && item.data == boneMeal.data) {
		Game.prevent();
		let region = WorldRegion.getForActor(playerUid);
		let player = new PlayerEntity(playerUid);
		if (player.getGameMode() != 1) {
			player.setCarriedItem(item.id, item.count - 1, item.data);
		}
		if (player.getGameMode() == 1 || Math.random() < 0.25) {
			RubberTreeGenerator.growRubberTree(region.blockSource, coords.x, coords.y, coords.z);
		}
		if (BlockEngine.getMainGameVersion() == 11) {
			region.sendPacketInRadius(coords, 64, "ic2.growPlantParticles", {x: coords.x, y: coords.y, z: coords.z});
		}
	}
});

Network.addClientPacket("ic2.growPlantParticles", function(data: {x: number, y: number, z: number}) {
	for (let i = 0; i < 16; i++) {
		let px = data.x + Math.random();
		let pz = data.z + Math.random();
		let py = data.y + Math.random();
		// TODO: fix particle type in new version
		Particles.addParticle(ParticleType.happyVillager, px, py, pz, 0, 0, 0);
	}
});
