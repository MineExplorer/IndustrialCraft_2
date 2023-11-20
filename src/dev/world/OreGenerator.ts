namespace OreGenerator {
	type OreProperties = {enabled: boolean, count: number, size: number, minHeight?: number, maxHeight?: number};

	export let copper: OreProperties = {
		enabled: IC2Config.getBool("copper_ore.enabled"),
		count: IC2Config.getInt("copper_ore.count"),
		size: IC2Config.getInt("copper_ore.size"),
		minHeight: IC2Config.getInt("copper_ore.minHeight"),
		maxHeight: IC2Config.getInt("copper_ore.maxHeight")
	}
	export let tin: OreProperties = {
		enabled: IC2Config.getBool("tin_ore.enabled"),
		count: IC2Config.getInt("tin_ore.count"),
		size: IC2Config.getInt("tin_ore.size"),
		minHeight: IC2Config.getInt("tin_ore.minHeight"),
		maxHeight: IC2Config.getInt("tin_ore.maxHeight")
	}
	export let lead: OreProperties = {
		enabled: IC2Config.getBool("lead_ore.enabled"),
		count: IC2Config.getInt("lead_ore.count"),
		size: IC2Config.getInt("lead_ore.size"),
		minHeight: IC2Config.getInt("lead_ore.minHeight"),
		maxHeight: IC2Config.getInt("lead_ore.maxHeight")
	}
	export let uranium: OreProperties = {
		enabled: IC2Config.getBool("uranium_ore.enabled"),
		count: IC2Config.getInt("uranium_ore.count"),
		size: IC2Config.getInt("uranium_ore.size"),
		minHeight: IC2Config.getInt("uranium_ore.minHeight"),
		maxHeight: IC2Config.getInt("uranium_ore.maxHeight")
	}
	export let iridium = {
		chance: IC2Config.getInt("iridium_ore.chance"),
		minHeight: IC2Config.getInt("iridium_ore.minHeight"),
		maxHeight: IC2Config.getInt("iridium_ore.maxHeight")
	}

	export function addFlag(oreName: string, flagName: string, disableOre?: boolean): void {
		if (this[oreName].enabled) {
			const flag = !Flags.addFlag(flagName)
			if (disableOre) this[oreName].enabled = flag;
		}
	}

	export function randomCoords(random: java.util.Random, chunkX: number, chunkZ: number, minHeight: number = 0, maxHeight: number = 128): Vector {
		const x = chunkX*16 + random.nextInt(16);
		const z = chunkZ*16 + random.nextInt(16);
		const y = random.nextInt(maxHeight - minHeight + 1) + minHeight;
		return {x: x, y: y, z: z};
	}

	export function generateOre(chunkX: number, chunkZ: number, blockID: number, properties: OreProperties, random: java.util.Random): void {
		for (let i = 0; i < properties.count; i++) {
			const coords = randomCoords(random, chunkX, chunkZ, properties.minHeight, properties.maxHeight);
			GenerationUtils.generateOre(coords.x, coords.y, coords.z, blockID, 0, properties.size, false, random.nextInt());
		}
	}
}

OreGenerator.addFlag("copper", "oreGenCopper");
OreGenerator.addFlag("tin", "oreGenTin");
OreGenerator.addFlag("lead", "oreGenLead", true);
OreGenerator.addFlag("uranium", "oreGenUranium", true);

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ, random) {
	if (OreGenerator.copper.enabled) {
		OreGenerator.generateOre(chunkX, chunkZ, BlockID.oreCopper, OreGenerator.copper, random);
	}
	if (OreGenerator.tin.enabled) {
		OreGenerator.generateOre(chunkX, chunkZ, BlockID.oreTin, OreGenerator.tin, random);
	}
	if (OreGenerator.lead.enabled) {
		OreGenerator.generateOre(chunkX, chunkZ, BlockID.oreLead, OreGenerator.lead, random);
	}
	if (OreGenerator.uranium.enabled) {
		OreGenerator.generateOre(chunkX, chunkZ, BlockID.oreUranium, OreGenerator.uranium, random);
	}
	if (random.nextDouble() < OreGenerator.iridium.chance) {
		const coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.iridium.minHeight, OreGenerator.iridium.maxHeight);
		if (World.getBlockID(coords.x, coords.y, coords.z) == 1)
			World.setBlock(coords.x, coords.y, coords.z, BlockID.oreIridium, 0);
	}
});
