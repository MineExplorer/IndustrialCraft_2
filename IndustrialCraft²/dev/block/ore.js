var BLOCK_TYPE_STONE = Block.createSpecialType({
	base: 1,
	solid: true,
	destroytime: 3,
	explosionres: 3
}, "stone");

IDRegistry.genBlockID("oreCopper");
Block.createBlock("oreCopper", [
	{name: "Copper Ore", texture: [["ore_copper", 0]], inCreative: true}
], BLOCK_TYPE_STONE);
ToolAPI.registerBlockMaterial(BlockID.oreCopper, "stone", 2, true);
Block.setDestroyLevel("oreCopper", 2);
//Block.setDestroyTime(BlockID.oreCopper, 3);

IDRegistry.genBlockID("oreTin");
Block.createBlock("oreTin", [
	{name: "Tin Ore", texture: [["ore_tin", 0]], inCreative: true}
], BLOCK_TYPE_STONE);
ToolAPI.registerBlockMaterial(BlockID.oreTin, "stone", 2, true);
Block.setDestroyLevel("oreTin", 2);
//Block.setDestroyTime(BlockID.oreTin, 3);

IDRegistry.genBlockID("oreLead");
Block.createBlock("oreLead", [
	{name: "Lead Ore", texture: [["ore_lead", 0]], inCreative: true}
], BLOCK_TYPE_STONE);
ToolAPI.registerBlockMaterial(BlockID.oreLead, "stone", 2, true);
Block.setDestroyLevel("oreLead", 2);
//Block.setDestroyTime(BlockID.oreLead, 3);

IDRegistry.genBlockID("oreUranium");
Block.createBlock("oreUranium", [
	{name: "Uranium Ore", texture: [["ore_uranium", 0]], inCreative: true}
], BLOCK_TYPE_STONE);
ToolAPI.registerBlockMaterial(BlockID.oreUranium, "stone", 3, true);
//Block.setDestroyTime(BlockID.oreUranium, 3);
Block.registerDropFunction("oreUranium", function(coords, blockID, blockData, level, enchant){
	if(level > 2){
		if(enchant.silk){
			return [[blockID, 1, 0]];
		}
		ToolAPI.dropOreExp(coords, 3, 7, enchant.experience);
		return [[ItemID.uraniumChunk, 1, 0]]
	}
	return [];
}, 3);

IDRegistry.genBlockID("oreIridium");
Block.createBlock("oreIridium", [
	{name: "Iridium Ore", texture: [["ore_iridium", 0]], inCreative: true}
], BLOCK_TYPE_STONE);
ToolAPI.registerBlockMaterial(BlockID.oreIridium, "stone", 4, true);
//Block.setDestroyTime(BlockID.oreIridium, 5);
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
	"copper_ore": __config__.access("ore_gen.copper_ore"),
	"tin_ore": __config__.access("ore_gen.tin_ore"),
	"lead_ore": __config__.access("ore_gen.lead_ore"),
	"uranium_ore": __config__.access("ore_gen.uranium_ore"),
	"iridium_ore": __config__.access("ore_gen.iridium_ore"),
	
	genOreNormal: function(x, y, z, id, data){
		for(var xx = -1; xx < 2; xx++){
			for(var yy = -1; yy < 2; yy++){
				for(var zz = -1; zz < 2; zz++){
					var d = Math.sqrt(xx*xx + yy*yy + zz*zz);
					var r = 1.5 - Math.random()/2;
					if(d < r){this.setOre(x+xx, y+yy, z+zz, id, data);}
				}
			}
		}
	},
	genOreSmall: function(x, y, z, id, data){
		for(var xx = 0; xx < 2; xx++){
			for(var yy = 0; yy < 2; yy++){
				for(var zz = 0; zz < 2; zz++){
					var d = Math.sqrt(xx*xx + yy*yy + zz*zz);
					var r = 2 - Math.random()*2;
					if(d < r){this.setOre(x+xx, y+yy, z+zz, id, data);}
				}
			}
		}
	},
	genOreTiny: function(x, y, z, maxCount, id, data){
		GenerationUtils.setLockedBlock(x,y,z);
		for(var i = 1; i < random(1, maxCount); i++){
			this.setOre(x+random(-1,1), y+random(-1,1), z+random(-1,1), id, data);
		}
	},
	setOre: function(x, y, z, id, data){
		if(World.getBlockID(x, y, z) == 1){
		World.setBlock(x, y, z, id, data);}
	}
}

Callback.addCallback("PostLoaded", function(){
	if(OreGenerator.copper_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 10; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 10, 64);
				OreGenerator.genOreNormal(coords.x, coords.y, coords.z, BlockID.oreCopper);
			}
		});
	}
	if(OreGenerator.tin_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 8; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 52);
				OreGenerator.genOreNormal(coords.x, coords.y, coords.z, BlockID.oreTin);
			}
		});
	}
	if(OreGenerator.lead_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 8; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 48);
				OreGenerator.genOreTiny(coords.x, coords.y, coords.z, 3, BlockID.oreLead);
			}
		});
	}
	if(OreGenerator.uranium_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			for(var i = 0; i < 3; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 48);
				OreGenerator.genOreTiny(coords.x, coords.y, coords.z, 3, BlockID.oreUranium);
			}
		});
	}
	if(OreGenerator.iridium_ore){
		Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
			if(Math.random() < 0.2){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 100);
				OreGenerator.setOre(coords.x, coords.y, coords.z, BlockID.oreIridium);
			}
		});
	}
});