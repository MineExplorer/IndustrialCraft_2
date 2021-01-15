namespace RubberTreeGenerator {
	export let biomeData = {};

	export function getBiomeChance(biomeID: number): number {
		let chance = biomeData[biomeID] || 0;
		return chance / 100;
	}

	export function generateRubberTree(x: number, y: number, z: number, region: BlockSource, random?: java.util.Random): void {
		if (!random) random = new java.util.Random(Debug.sysTime());

		const minHeight = 3, maxHeight = 8;
		let height = getGrowHeight(x, y, z, random.nextInt(maxHeight - minHeight + 1) + minHeight, region);
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

			let leavesStart = Math.floor(height / 2);
			let leavesEnd = height;
			for (let ys = leavesStart; ys <= leavesEnd; ys++) {
				for (let xs = -2; xs <= 2; xs++) {
					for (let zs = -2; zs <= 2; zs++) {
						let radius = 2.5 + random.nextDouble() * 0.5;
						if (ys == leavesEnd) radius /= 2;
						if (Math.sqrt(xs*xs + zs*zs) <= radius) {
							setLeaves(x + xs, y + ys, z + zs, region);
						}
					}
				}
			}

			let pikeHeight = 2 + Math.floor(random.nextDouble()*2);
			for (let ys = 1; ys <= pikeHeight; ys++) {
				setLeaves(x, y + ys + height, z, region);
			}
		}
	}

	export function getGrowHeight(x: number, y: number, z: number, max: number, region: BlockSource): number {
		let height = 0;
		while(height < max + 2) {
			let blockID = region.getBlockId(x, y + height, z);
			if (blockID != 0) break;
			height++;
		}
		return height > 2 ? height - 2 : 0;
	}

	export function setLeaves(x: number, y: number, z: number, region: BlockSource): void {
		let blockID = region.getBlockId(x, y, z);
		if (blockID == 0 || blockID == 106) {
			region.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
		}
	}
}


const ForestBiomeIDs = [4, 18, 27, 28, 132, 155, 156];
const JungleBiomeIDs = [21, 22, 23, 149, 151];
const SwampBiomeIDs = [6, 134];

let chance = __config__.getNumber("rubber_tree_gen.plains");
RubberTreeGenerator.biomeData[1] = chance;

chance = __config__.getNumber("rubber_tree_gen.forest");
ForestBiomeIDs.forEach(function(id) {
	RubberTreeGenerator.biomeData[id] = chance;
});

chance = __config__.getNumber("rubber_tree_gen.jungle");
JungleBiomeIDs.forEach(function(id) {
	RubberTreeGenerator.biomeData[id] = chance;
});

chance = __config__.getNumber("rubber_tree_gen.swamp");
SwampBiomeIDs.forEach(function(id) {
	RubberTreeGenerator.biomeData[id] = chance;
});

World.addGenerationCallback("GenerateChunk", function(chunkX: number, chunkZ: number, random: java.util.Random) {
	let region = BlockSource.getCurrentWorldGenRegion();
	let biome = region.getBiome((chunkX + 0.5) * 16, (chunkZ + 0.5) * 16);
	if (random.nextDouble() < RubberTreeGenerator.getBiomeChance(biome)) {
		let treeCount = 1 + random.nextInt(6);
		for (let i = 0; i < treeCount; i++) {
			let coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
			if (region.getBlockId(coords.x, coords.y, coords.z) == 2) {
				RubberTreeGenerator.generateRubberTree(coords.x, coords.y + 1, coords.z, region, random)
			}
		}
	}
}, "rubber_tree");