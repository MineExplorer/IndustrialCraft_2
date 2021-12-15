BlockRegistry.createBlock("oreCopper", [
	{name: "Copper Ore", texture: [["ore_copper", 0]], inCreative: true}
], "ore");
BlockRegistry.setBlockMaterial(BlockID.oreCopper, "stone", 2);
BlockRegistry.setDestroyLevel("oreCopper", 2);

BlockRegistry.createBlock("oreTin", [
	{name: "Tin Ore", texture: [["ore_tin", 0]], inCreative: true}
], "ore");
BlockRegistry.setBlockMaterial(BlockID.oreTin, "stone", 2);
BlockRegistry.setDestroyLevel("oreTin", 2);

BlockRegistry.createBlock("oreLead", [
	{name: "Lead Ore", texture: [["ore_lead", 0]], inCreative: true}
], "ore");
BlockRegistry.setBlockMaterial(BlockID.oreLead, "stone", 2);
BlockRegistry.setDestroyLevel("oreLead", 2);

BlockRegistry.createBlock("oreUranium", [
	{name: "Uranium Ore", texture: [["ore_uranium", 0]], inCreative: true}
], "ore");
BlockRegistry.setBlockMaterial(BlockID.oreUranium, "stone", 3);
BlockRegistry.setDestroyLevel("oreUranium", 3);

BlockRegistry.createBlock("oreIridium", [
	{name: "Iridium Ore", texture: [["ore_iridium", 0]], inCreative: true}
], "ore");
BlockRegistry.setBlockMaterial(BlockID.oreIridium, "stone", 4);
BlockRegistry.registerDrop("oreIridium", function(coords, blockID, blockData, level, enchant) {
	if (level > 3) {
		if (enchant.silk) {
			return [[blockID, 1, 0]];
		}
		let drop: ItemInstanceArray[] = [[ItemID.iridiumChunk, 1, 0]];
		if (Math.random() < enchant.fortune/6) drop.push(drop[0]);
		ToolAPI.dropOreExp(coords, 12, 28, enchant.experience);
		return drop;
	}
	return [];
});

Item.addCreativeGroup("ores", Translation.translate("Ores"), [
	BlockID.oreCopper,
	BlockID.oreTin,
	BlockID.oreLead,
	BlockID.oreUranium,
	BlockID.oreIridium
]);

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
			let flag = !Flags.addFlag(flagName)
			if (disableOre) this[oreName].enabled = flag;
		}
	}

	export function randomCoords(random: java.util.Random, chunkX: number, chunkZ: number, minHeight: number = 0, maxHeight: number = 128): Vector {
		let x = chunkX*16 + random.nextInt(16);
		let z = chunkZ*16 + random.nextInt(16);
		let y = random.nextInt(maxHeight - minHeight + 1) + minHeight;
		return {x: x, y: y, z: z};
	}

	export function generateOre(chunkX: number, chunkZ: number, blockID: number, properties: OreProperties, random: java.util.Random): void {
		for (let i = 0; i < properties.count; i++) {
			let coords = randomCoords(random, chunkX, chunkZ, properties.minHeight, properties.maxHeight);
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
		let coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.iridium.minHeight, OreGenerator.iridium.maxHeight);
		if (World.getBlockID(coords.x, coords.y, coords.z) == 1)
			World.setBlock(coords.x, coords.y, coords.z, BlockID.oreIridium, 0);
	}
});