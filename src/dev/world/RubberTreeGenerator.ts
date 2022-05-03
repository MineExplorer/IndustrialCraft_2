namespace RubberTreeGenerator {
	export let biomeData = {};

	export function getBiomeChance(biomeID: number): number {
		const chance = biomeData[biomeID] || 0;
		return chance / 100;
	}

	export function growRubberTree(region: BlockSource, x: number, y: number, z: number): void {
		const random = new java.util.Random(Debug.sysTime());
		generateRubberTree(region, x, y, z, random, true);
	}

	export function generateRubberTree(region: BlockSource, x: number, y: number, z: number, random: java.util.Random, replacePlants?: boolean): void {
		const minHeight = 3, maxHeight = 8;
		const height = getGrowHeight(region, x, y, z, random.nextInt(maxHeight - minHeight + 1) + minHeight, replacePlants);
		if (height >= minHeight) {
			let treeholeChance = 0.25;
			for (let ys = 0; ys < height; ys++) {
				if (random.nextDouble() < treeholeChance) {
					treeholeChance -= 0.1;
					region.setBlock(x, y + ys, z, BlockID.rubberTreeLogLatex, 4 + random.nextInt(4));
				}
				else {
					region.setBlock(x, y + ys, z, BlockID.rubberTreeLog, 0);
				}
			}

			const leavesStart = Math.floor(height / 2);
			const leavesEnd = height;
			for (let ys = leavesStart; ys <= leavesEnd; ys++) {
				for (let xs = -2; xs <= 2; xs++) {
					for (let zs = -2; zs <= 2; zs++) {
						let radius = 2.5 + random.nextDouble() * 0.5;
						if (ys == leavesEnd) radius /= 2;
						if (Math.sqrt(xs*xs + zs*zs) <= radius) {
							setLeaves(region, x + xs, y + ys, z + zs);
						}
					}
				}
			}

			const pikeHeight = 2 + Math.floor(random.nextDouble()*2);
			for (let ys = 1; ys <= pikeHeight; ys++) {
				setLeaves(region, x, y + ys + height, z);
			}
		}
	}

	export function getGrowHeight(region: BlockSource, x: number, y: number, z: number, max: number, replacePlants: boolean): number {
		let height = 0;
		while (height < max + 2) {
			const blockID = region.getBlockId(x, y + height, z);
			if (!(blockID == 0 || replacePlants && ToolAPI.getBlockMaterialName(blockID) == "plant")) break;
			height++;
		}
		return height > 2 ? height - 2 : 0;
	}

	export function setLeaves(region: BlockSource, x: number, y: number, z: number): void {
		const blockID = region.getBlockId(x, y, z);
		if (blockID == 0 || blockID == 106) {
			region.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
		}
	}

	const ForestBiomeIDs = [4, 18, 27, 28, 132, 155, 156];
	const JungleBiomeIDs = [21, 22, 23, 149, 151];
	const SwampBiomeIDs = [6, 134];

	export function readRubberTreeConfig() {
		let chance = IC2Config.getInt("rubber_tree_gen.plains");
		biomeData[1] = chance;

		chance = IC2Config.getInt("rubber_tree_gen.forest");
		ForestBiomeIDs.forEach(function(id) {
			biomeData[id] = chance;
		});

		chance = IC2Config.getInt("rubber_tree_gen.jungle");
		JungleBiomeIDs.forEach(function(id) {
			biomeData[id] = chance;
		});

		chance = IC2Config.getInt("rubber_tree_gen.swamp");
		SwampBiomeIDs.forEach(function(id) {
			biomeData[id] = chance;
		});
	}

	readRubberTreeConfig();

	World.addGenerationCallback(BlockEngine.getMainGameVersion() == 11 ? "GenerateChunk" : "PreProcessChunk", function(chunkX: number, chunkZ: number, random: java.util.Random) {
		const region = BlockSource.getCurrentWorldGenRegion();
		const biome = region.getBiome((chunkX + 0.5) * 16, (chunkZ + 0.5) * 16);
		if (random.nextDouble() < getBiomeChance(biome)) {
			const treeCount = 1 + random.nextInt(6);
			for (let i = 0; i < treeCount; i++) {
				const coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
				if (region.getBlockId(coords.x, coords.y, coords.z) == 2) {
					generateRubberTree(region, coords.x, coords.y + 1, coords.z, random);
				}
			}
		}
	}, "rubber_tree");
}
