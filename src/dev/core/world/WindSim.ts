namespace WindSim {
	// Biome category sets for Bedrock Edition
	const OCEAN_BIOMES = new Set<number>([
		0,   // ocean
		10,  // legacy_frozen_ocean
		24,  // deep_ocean
		40,  // warm_ocean
		41,  // deep_warm_ocean
		42,  // lukewarm_ocean
		43,  // deep_lukewarm_ocean
		44,  // cold_ocean
		45,  // deep_cold_ocean
		46,  // frozen_ocean
		47,  // deep_frozen_ocean
	]);

	const FLAT_BIOMES = new Set<number>([
		1,   // plains
		2,   // desert
		6,   // swampland
		12,  // ice_plains
		14,  // mushroom_island
		15,  // mushroom_island_shore
		16,  // beach
		17,  // desert_hills
		25,  // stone_beach
		26,  // cold_beach
		35,  // savanna
		36,  // savanna_plateau
		129, // sunflower_plains
		130, // desert_mutated
		134, // swampland_mutated
		140, // ice_plains_spikes
	]);

	const RIVER_BIOMES = new Set<number>([
		7,   // river
		11,  // frozen_river
	]);

	const FOREST_BIOMES = new Set<number>([
		4,   // forest
		5,   // taiga
		18,  // forest_hills
		19,  // taiga_hills
		27,  // birch_forest
		28,  // birch_forest_hills
		29,  // roofed_forest
		30,  // cold_taiga
		31,  // cold_taiga_hills
		34,  // extreme_hills_plus_trees
		132, // flower_forest
		133, // taiga_mutated
		155, // birch_forest_mutated
		156, // birch_forest_hills_mutated
		157, // roofed_forest_mutated
		158, // cold_taiga_mutated
		162, // extreme_hills_plus_trees_mutated
	]);

	const TALL_FOREST_BIOMES = new Set<number>([
		21,  // jungle
		22,  // jungle_hills
		23,  // jungle_edge
		32,  // mega_taiga
		33,  // mega_taiga_hills
		48,  // bamboo_jungle
		49,  // bamboo_jungle_hills
		149, // jungle_mutated
		151, // jungle_edge_mutated
		160, // redwood_taiga_mutated
		161, // redwood_taiga_hills_mutated
	]);

	const MOUNTAIN_BIOMES = new Set<number>([
		3,   // extreme_hills
		13,  // ice_mountains
		20,  // extreme_hills_edge
		37,  // mesa
		38,  // mesa_plateau_stone
		39,  // mesa_plateau
		131, // extreme_hills_mutated
		163, // savanna_mutated
		164, // savanna_plateau_mutated
		165, // mesa_bryce
		166, // mesa_plateau_stone_mutated
		167, // mesa_plateau_mutated
	]);

	/**
	 * Returns the height with maximum wind strength based on biome ID
	 * @param biomeId - The biome ID from Bedrock Edition
	 * @returns Height with maximum wind strength
	 */
	export function getMaxWindHeightByBiome(biomeId: number): number {
		if (OCEAN_BIOMES.has(biomeId)) return 120;
        if (FLAT_BIOMES.has(biomeId) || RIVER_BIOMES.has(biomeId)) return 140;
        if (FOREST_BIOMES.has(biomeId)) return 160;
        if (TALL_FOREST_BIOMES.has(biomeId)) return 180;
        if (MOUNTAIN_BIOMES.has(biomeId)) return 200;
		
		// Default value
		return 160;
	}

	export let windStrength = MathUtil.randomInt(5, 25);

	export function getWindAt(blockSource: BlockSource, x: number, y: number, z: number): number {
		if (blockSource.getDimension() != 0) return 0;
		const windStreamHeight = getWindStreamHeight(blockSource, x, z);
		return getWindByHeight(y, windStreamHeight);
	}

	export function getWindStreamHeight(blockSource: BlockSource, x: number, z: number): number {
		// Chunk pos
		const baseX = Math.floor(x / 16) * 16;
		const baseZ = Math.floor(z / 16) * 16;
		
		// Relative position within a chunk (0-1)
		const tx = (x - baseX) / 16;
		const ty = (z - baseZ) / 16;
		
		// Get height for 4 corners
		const h00 = getMaxWindHeightByBiome(blockSource.getBiome(baseX, baseZ));
		const h10 = getMaxWindHeightByBiome(blockSource.getBiome(baseX + 15, baseZ));
		const h01 = getMaxWindHeightByBiome(blockSource.getBiome(baseX, baseZ + 15));
		const h11 = getMaxWindHeightByBiome(blockSource.getBiome(baseX + 15, baseZ + 15));
		
		// Bilinear interpolation
		return h00 * (1 - tx) * (1 - ty) +
			h10 * tx * (1 - ty) +
			h01 * (1 - tx) * ty +
			h11 * tx * ty;
	}

	/**
	 * Returns global wind strength, modified by height and wethear.
	 * At heights below windStreamHeight returned value gradually declines towards 0 at sea level
	 * @param height height where wind is measured
	 * @param windStreamHeight height with maximal wind strenght, must be greater than 64
	 */
	export function getWindByHeight(height: number, windStreamHeight: number): number {
		if (windStreamHeight <= 64) {
			Debug.error(`windStreamHeight must be value greater than 64`);
			return 0;
		}
		let windMultiplier = Math.max(1 - Math.abs((windStreamHeight - height)/(windStreamHeight - 64)) ** 2, 0);
		const wether = World.getWeather();
		if (wether.thunder)
			windMultiplier *= 1.5;
		else if (wether.rain)
			windMultiplier *= 1.25;
		return windStrength * windMultiplier;
	}

	function updateWind(): void {
		if (World.getThreadTime() % 128 != 0) return;

		let upChance = 10;
		let downChance = 10;
		if (windStrength > 20) {
			upChance -= windStrength - 20;
		} else if (windStrength < 10) {
			downChance -= 10 - windStrength;
		}
		if (Math.random()*100 < upChance) {
			windStrength++;
		} else if (Math.random()*100 < downChance) {
			windStrength--;
		}
	}

	Callback.addCallback("tick", function () {
		updateWind();
	});

	Saver.addSavesScope("windSim",
		function read(scope: {strength: number}) {
			windStrength = scope.strength || MathUtil.randomInt(5, 25);
		},
		function save() {
			return {strength: windStrength};
		}
	);
}
