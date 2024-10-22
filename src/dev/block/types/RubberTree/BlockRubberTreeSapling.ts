class BlockRubberTreeSapling extends BlockBase
implements BlockItemBehavior {
	PLACEABLE_TILES = {
		2: true,
		3: true,
		60: true
	}

	constructor() {
		super("rubberTreeSapling", {
			renderType: 1,
			destroyTime: 0,
			sound: "grass"
		});
		this.addVariation("rubber_tree_sapling", [["rubber_tree_sapling", 0]], true);
		this.setCategory(ItemCategory.NATURE);
		this.setBlockMaterial("plant");
		this.setShape(1/8, 0, 1/8, 7/8, 1, 7/8);
		TileRenderer.setEmptyCollisionShape(this.id);
		Recipes.addFurnaceFuel(this.id, -1, 100);
		ItemRegistry.registerItemFuncs(this.id, this);
	}

	getDrop(): ItemInstanceArray[] {
		return [[BlockID.rubberTreeSapling, 1, 0]];
	}

	onNeighbourChange(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void {
		if (changeCoords.y < coords.y && !this.PLACEABLE_TILES[region.getBlockId(coords.x, coords.y - 1, coords.z)]) {
			region.destroyBlock(coords.x, coords.y, coords.z, true);
		}
	}

	onRandomTick(x: number, y: number, z: number, block: Tile, region: BlockSource): void {
		if (!this.PLACEABLE_TILES[region.getBlockId(x, y-1, z)]) {
			region.destroyBlock(x, y, z, true);
		}
		else if (Math.random() < 0.05 && region.getLightLevel(x, y, z) >= 9) {
			RubberTreeGenerator.growRubberTree(region, x, y, z);
		}
	}

	onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, playerUid: number): void {
		const boneMeal = IDConverter.getIDData("bone_meal");
		if (item.id == boneMeal.id && item.data == boneMeal.data) {
			Game.prevent();
			const region = WorldRegion.getForActor(playerUid);
			const player = new PlayerEntity(playerUid);
			if (player.getGameMode() != 1) {
				player.setCarriedItem(item.id, item.count - 1, item.data);
			}
			if (player.getGameMode() == 1 || Math.random() < 0.25) {
				RubberTreeGenerator.growRubberTree(region.blockSource, coords.x, coords.y, coords.z);
			}
			region.sendPacketInRadius(coords, 64, "ic2.growPlantParticles", {x: coords.x, y: coords.y, z: coords.z});
		}
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		const region = BlockSource.getDefaultForActor(player);
		const place = coords.relative;
		const tile1 = region.getBlock(place.x, place.y, place.z);
		const tile2 = region.getBlock(place.x, place.y - 1, place.z);

		if (!World.canTileBeReplaced(tile1.id, tile1.data) || !this.PLACEABLE_TILES[tile2.id]) {
			Game.prevent();
		}
	}
}

Network.addClientPacket("ic2.growPlantParticles", function(data: {x: number, y: number, z: number}) {
	for (let i = 0; i < 16; i++) {
		const px = data.x + Math.random();
		const pz = data.z + Math.random();
		const py = data.y + Math.random();
		Particles.addParticle(ParticleType.happyVillager, px, py, pz, 0, 0, 0);
	}
});
