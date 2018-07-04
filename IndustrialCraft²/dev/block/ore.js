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
		if(Math.random() < enchant.fortune/3 - 1/3){drop.push(drop[0]);}
		ToolAPI.dropOreExp(coords, 12, 28, enchant.experience);
		return drop;
	}
	return [];
}, 4);


var OreGenerator = {
	oreGenCopper: __config__.getBool("ore_gen.copper"),
	oreGenTin: __config__.getBool("ore_gen.tin"),
	oreGenLead: __config__.getBool("ore_gen.lead"),
	oreGenUranium: __config__.getBool("ore_gen.uranium"),
	oreGenIridium: __config__.getBool("ore_gen.iridium"),
}

Callback.addCallback("PostLoaded", function(){
	for(var flag in OreGenerator){
		if(OreGenerator[flag]){
			OreGenerator[flag] = !Flags.addFlag(flag);
		}
	}
	if(OreGenerator.oreGenCopper){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 10; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 10, 70);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreCopper, 0, random(6, 15));
			}
		});
	}
	if(OreGenerator.oreGenTin){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 10; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 56);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreTin, 0, random(4, 10));
			}
		});
	}
	if(OreGenerator.oreGenLead){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 10; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 40);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreLead, 0, random(2, 5));
			}
		});
	}
	if(OreGenerator.oreGenUranium){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 10; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 48);
				GenerationUtils.generateOre(coords.x, coords.y, coords.z, BlockID.oreUranium, 0, random(1, 4));
			}
		});
	}
	if(OreGenerator.oreGenIridium){
		Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
			if(Math.random() < 0.2){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 100);
				if(World.getBlockID(coords.x, coords.y, coords.z) == 1){
				World.setBlock(coords.x, coords.y, coords.z, BlockID.oreIridium);}
			}
		});
	}
});