Block.createSpecialType({
	base: 1,
	solid: true,
	destroytime: 3,
	explosionres: 15,
	lightopacity: 15,
	renderlayer: 2,
	translucency: 0,
	sound: "stone"
}, "ore");

IDRegistry.genBlockID("oreCopper");
Block.createBlock("oreCopper", [
	{name: "Copper Ore", texture: [["ore_copper", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreCopper, "stone", 2, true);
Block.setDestroyLevel("oreCopper", 2);
ToolLib.addBlockDropOnExplosion("oreCopper");

IDRegistry.genBlockID("oreTin");
Block.createBlock("oreTin", [
	{name: "Tin Ore", texture: [["ore_tin", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreTin, "stone", 2, true);
Block.setDestroyLevel("oreTin", 2);
ToolLib.addBlockDropOnExplosion("oreTin");

IDRegistry.genBlockID("oreLead");
Block.createBlock("oreLead", [
	{name: "Lead Ore", texture: [["ore_lead", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreLead, "stone", 2, true);
Block.setDestroyLevel("oreLead", 2);
ToolLib.addBlockDropOnExplosion("oreLead");

IDRegistry.genBlockID("oreUranium");
Block.createBlock("oreUranium", [
	{name: "Uranium Ore", texture: [["ore_uranium", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreUranium, "stone", 3, true);
Block.setDestroyLevel("oreUranium", 3);
ToolLib.addBlockDropOnExplosion("oreUranium");

IDRegistry.genBlockID("oreIridium");
Block.createBlock("oreIridium", [
	{name: "Iridium Ore", texture: [["ore_iridium", 0]], inCreative: true}
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreIridium, "stone", 4, true);
Block.registerDropFunction("oreIridium", function(coords, blockID, blockData, level, enchant) {
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
ToolLib.addBlockDropOnExplosion("oreIridium");

Item.addCreativeGroup("ores", Translation.translate("Ores"), [
	BlockID.oreCopper,
	BlockID.oreTin,
	BlockID.oreLead,
	BlockID.oreUranium,
	BlockID.oreIridium
]);

namespace OreGenerator {
	export let copper = {
		enabled: IC2Config.getBool("copper_ore.enabled"),
		count: IC2Config.getInt("copper_ore.count"),
		size: IC2Config.getInt("copper_ore.size"),
		minHeight: IC2Config.getInt("copper_ore.minHeight"),
		maxHeight: IC2Config.getInt("copper_ore.maxHeight")
	}
	export let tin = {
		enabled: IC2Config.getBool("tin_ore.enabled"),
		count: IC2Config.getInt("tin_ore.count"),
		size: IC2Config.getInt("tin_ore.size"),
		minHeight: IC2Config.getInt("tin_ore.minHeight"),
		maxHeight: IC2Config.getInt("tin_ore.maxHeight")
	}
	export let lead = {
		enabled: IC2Config.getBool("lead_ore.enabled"),
		count: IC2Config.getInt("lead_ore.count"),
		size: IC2Config.getInt("lead_ore.size"),
		minHeight: IC2Config.getInt("lead_ore.minHeight"),
		maxHeight: IC2Config.getInt("lead_ore.maxHeight")
	}
	export let uranium = {
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

	export function addFlag(oreName: string, flagName: string, disableOre?: boolean) {
		if (this[oreName].enabled) {
			let flag = !Flags.addFlag(flagName)
			if (disableOre) this[oreName].enabled = flag;
		}
	}

	export function randomCoords(random: java.util.Random, chunkX: number, chunkZ: number, minHeight: number = 0, maxHeight: number = 128) {
		let x = chunkX*16 + random.nextInt(16);
		let z = chunkZ*16 + random.nextInt(16);
		let y = random.nextInt(maxHeight - minHeight + 1) - minHeight;
		return {x: x, y: y, z: z};
	}
}

OreGenerator.addFlag("copper", "oreGenCopper");
OreGenerator.addFlag("tin", "oreGenTin");
OreGenerator.addFlag("lead", "oreGenLead", true);
OreGenerator.addFlag("uranium", "oreGenUranium", true);

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ, random) {
	if (OreGenerator.copper.enabled) {
		for (let i = 0; i < OreGenerator.copper.count; i++) {
			let coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.copper.minHeight, OreGenerator.copper.maxHeight);
			GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreCopper, 0, OreGenerator.copper.size, false, random.nextInt());
		}
	}

	if (OreGenerator.tin.enabled) {
		for (let i = 0; i < OreGenerator.tin.count; i++) {
			let coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.tin.minHeight, OreGenerator.tin.maxHeight);
			GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreTin, 0, OreGenerator.tin.size, false, random.nextInt());
		}
	}

	if (OreGenerator.lead.enabled) {
		for (let i = 0; i < OreGenerator.lead.count; i++) {
			let coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.lead.minHeight, OreGenerator.lead.maxHeight);
			GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreLead, 0, OreGenerator.lead.size, false, random.nextInt());
		}
	}

	if (OreGenerator.uranium.enabled) {
		for (let i = 0; i < OreGenerator.uranium.count; i++) {
			let coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.uranium.minHeight, OreGenerator.uranium.maxHeight);
			GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreUranium, 0, OreGenerator.uranium.size, false, random.nextInt());
		}
	}

	if (random.nextDouble() < OreGenerator.iridium.chance) {
		let coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.iridium.minHeight, OreGenerator.iridium.maxHeight);
		if (World.getBlockID(coords.x, coords.y, coords.z) == 1)
			World.setBlock(coords.x, coords.y, coords.z, BlockID.oreIridium, 0);
	}
});