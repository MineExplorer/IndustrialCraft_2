IDRegistry.genBlockID("oreCopper");
Block.createBlock("oreCopper", [
	{name: "Copper Ore", texture: [["ore_copper", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreCopper, "stone", 2, true);
Block.setDestroyTime(BlockID.oreCopper, 3);
Block.setDestroyLevel("oreCopper", 2);


IDRegistry.genBlockID("oreTin");
Block.createBlock("oreTin", [
	{name: "Tin Ore", texture: [["ore_tin", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreTin, "stone", 2, true);
Block.setDestroyTime(BlockID.oreTin, 3);
Block.setDestroyLevel("oreTin", 2);


IDRegistry.genBlockID("oreLead");
Block.createBlock("oreLead", [
	{name: "Lead Ore", texture: [["ore_lead", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreLead, "stone", 2, true);
Block.setDestroyTime(BlockID.oreLead, 3);
Block.setDestroyLevel("oreLead", 2);


IDRegistry.genBlockID("oreUranium");
Block.createBlock("oreUranium", [
	{name: "Uranium Ore", texture: [["ore_uranium", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreUranium, "stone", 3, true);
Block.setDestroyTime(BlockID.oreUranium, 3);
Block.setDestroyLevel("oreUranium", 3);


IDRegistry.genBlockID("oreIridium");
Block.createBlock("oreIridium", [
	{name: "Iridium Ore", texture: [["ore_iridium", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.oreIridium, "stone", 4, true);
Block.setDestroyTime(BlockID.oreIridium, 3);
Block.registerDropFunction("oreIridium", function(coords, blockID, blockData, level, enchant){
	if(level > 3){
		if(enchant.silk){
			return [[blockID, 1, 0]];
		}
		var drop = [[ItemID.iridiumChunk, 1, 0]];
		if(Math.random() < enchant.fortune/6) drop.push(drop[0]);
		ToolAPI.dropOreExp(coords, 12, 28, enchant.experience);
		return drop;
	}
	return [];
}, 4);


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
	
	addFlag: function(name, flag, disableOre){
		if(this[name].enabled){
			var flag = !Flags.addFlag(flag)
			if(disableOre) this[name].enabled = flag;
		}
	}
}

OreGenerator.addFlag("copper", "oreGenCopper");
OreGenerator.addFlag("tin", "oreGenTin");
OreGenerator.addFlag("lead", "oreGenLead", true);
OreGenerator.addFlag("uranium", "oreGenUranium", true);

Callback.addCallback("PostLoaded", function(){
	if(OreGenerator.copper.enabled){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < OreGenerator.copper.count; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.copper.minHeight, OreGenerator.copper.maxHeight);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreCopper, 0, OreGenerator.copper.size);
			}
		});
	}
	if(OreGenerator.tin.enabled){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < OreGenerator.tin.count; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.tin.minHeight, OreGenerator.tin.maxHeight);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreTin, 0, OreGenerator.tin.size);
			}
		});
	}
	if(OreGenerator.lead.enabled){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < OreGenerator.lead.count; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.lead.minHeight, OreGenerator.lead.maxHeight);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreLead, 0, OreGenerator.lead.size);
			}
		});
	}
	if(OreGenerator.uranium.enabled){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < OreGenerator.uranium.count; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.uranium.minHeight, OreGenerator.uranium.maxHeight);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreUranium, 0, OreGenerator.uranium.size);
			}
		});
	}
	if(OreGenerator.iridium.chance > 0){
		Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
			if(Math.random() < OreGenerator.iridium.chance){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, OreGenerator.iridium.minHeight, OreGenerator.iridium.maxHeight);
				if(World.getBlockID(coords.x, coords.y, coords.z) == 1){
				World.setBlock(coords.x, coords.y, coords.z, BlockID.oreIridium);}
			}
		});
	}
});