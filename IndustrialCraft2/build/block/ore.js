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
    { name: "Copper Ore", texture: [["ore_copper", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreCopper, "stone", 2, true);
Block.setDestroyLevel("oreCopper", 2);
ToolLib.addBlockDropOnExplosion("oreCopper");
IDRegistry.genBlockID("oreTin");
Block.createBlock("oreTin", [
    { name: "Tin Ore", texture: [["ore_tin", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreTin, "stone", 2, true);
Block.setDestroyLevel("oreTin", 2);
ToolLib.addBlockDropOnExplosion("oreTin");
IDRegistry.genBlockID("oreLead");
Block.createBlock("oreLead", [
    { name: "Lead Ore", texture: [["ore_lead", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreLead, "stone", 2, true);
Block.setDestroyLevel("oreLead", 2);
ToolLib.addBlockDropOnExplosion("oreLead");
IDRegistry.genBlockID("oreUranium");
Block.createBlock("oreUranium", [
    { name: "Uranium Ore", texture: [["ore_uranium", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreUranium, "stone", 3, true);
Block.setDestroyLevel("oreUranium", 3);
ToolLib.addBlockDropOnExplosion("oreUranium");
IDRegistry.genBlockID("oreIridium");
Block.createBlock("oreIridium", [
    { name: "Iridium Ore", texture: [["ore_iridium", 0]], inCreative: true }
], "ore");
ToolAPI.registerBlockMaterial(BlockID.oreIridium, "stone", 4, true);
Block.registerDropFunction("oreIridium", function (coords, blockID, blockData, level, enchant) {
    if (level > 3) {
        if (enchant.silk) {
            return [[blockID, 1, 0]];
        }
        var drop = [[ItemID.iridiumChunk, 1, 0]];
        if (Math.random() < enchant.fortune / 6)
            drop.push(drop[0]);
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
var OreGenerator = {
    copper: {
        enabled: __config__.getBool("copper_ore.enabled"),
        count: __config__.getNumber("copper_ore.count"),
        size: __config__.getNumber("copper_ore.size"),
        minHeight: __config__.getNumber("copper_ore.minHeight"),
        maxHeight: __config__.getNumber("copper_ore.maxHeight")
    },
    tin: {
        enabled: __config__.getBool("tin_ore.enabled"),
        count: __config__.getNumber("tin_ore.count"),
        size: __config__.getNumber("tin_ore.size"),
        minHeight: __config__.getNumber("tin_ore.minHeight"),
        maxHeight: __config__.getNumber("tin_ore.maxHeight")
    },
    lead: {
        enabled: __config__.getBool("lead_ore.enabled"),
        count: __config__.getNumber("lead_ore.count"),
        size: __config__.getNumber("lead_ore.size"),
        minHeight: __config__.getNumber("lead_ore.minHeight"),
        maxHeight: __config__.getNumber("lead_ore.maxHeight")
    },
    uranium: {
        enabled: __config__.getBool("uranium_ore.enabled"),
        count: __config__.getNumber("uranium_ore.count"),
        size: __config__.getNumber("uranium_ore.size"),
        minHeight: __config__.getNumber("uranium_ore.minHeight"),
        maxHeight: __config__.getNumber("uranium_ore.maxHeight")
    },
    iridium: {
        chance: __config__.getNumber("iridium_ore.chance"),
        minHeight: __config__.getNumber("iridium_ore.minHeight"),
        maxHeight: __config__.getNumber("iridium_ore.maxHeight")
    },
    addFlag: function (name, flag, disableOre) {
        if (this[name].enabled) {
            var flag = !Flags.addFlag(flag);
            if (disableOre)
                this[name].enabled = flag;
        }
    },
    randomCoords: function (random, chunkX, chunkZ, minHeight, maxHeight) {
        minHeight = minHeight || 0;
        maxHeight = maxHeight || 128;
        var x = chunkX * 16 + random.nextInt(16);
        var z = chunkZ * 16 + random.nextInt(16);
        var y = random.nextInt(maxHeight - minHeight + 1) - minHeight;
        return { x: x, y: y, z: z };
    }
};
OreGenerator.addFlag("copper", "oreGenCopper");
OreGenerator.addFlag("tin", "oreGenTin");
OreGenerator.addFlag("lead", "oreGenLead", true);
OreGenerator.addFlag("uranium", "oreGenUranium", true);
Callback.addCallback("GenerateChunkUnderground", function (chunkX, chunkZ, random) {
    if (OreGenerator.copper.enabled) {
        for (var i = 0; i < OreGenerator.copper.count; i++) {
            var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.copper.minHeight, OreGenerator.copper.maxHeight);
            GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreCopper, 0, OreGenerator.copper.size, false, random.nextInt());
        }
    }
    if (OreGenerator.tin.enabled) {
        for (var i = 0; i < OreGenerator.tin.count; i++) {
            var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.tin.minHeight, OreGenerator.tin.maxHeight);
            GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreTin, 0, OreGenerator.tin.size, false, random.nextInt());
        }
    }
    if (OreGenerator.lead.enabled) {
        for (var i = 0; i < OreGenerator.lead.count; i++) {
            var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.lead.minHeight, OreGenerator.lead.maxHeight);
            GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreLead, 0, OreGenerator.lead.size, false, random.nextInt());
        }
    }
    if (OreGenerator.uranium.enabled) {
        for (var i = 0; i < OreGenerator.uranium.count; i++) {
            var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.uranium.minHeight, OreGenerator.uranium.maxHeight);
            GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreUranium, 0, OreGenerator.uranium.size, false, random.nextInt());
        }
    }
    if (random.nextDouble() < OreGenerator.iridium.chance) {
        var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.iridium.minHeight, OreGenerator.iridium.maxHeight);
        if (World.getBlockID(coords.x, coords.y, coords.z) == 1)
            World.setBlock(coords.x, coords.y, coords.z, BlockID.oreIridium);
    }
});
