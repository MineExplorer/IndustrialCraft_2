var RubberTreeGenerationHelper = {
	/*
	 params: {
		 leaves: {
			 id: 
			 data: 
		 },
		 log: {
			 id: 
			 data:
			 resin: 
		 },
		 height: {
			 min:
			 max:
			 start: 
		 },
		 pike:
		 radius: 
	 }
	*/
	generateCustomTree: function(x, y, z, params, random){
		var leaves = params.leaves;
		var log = params.log;
		
		var min = params.height.min, max = params.height.max;
		var height = this.getHeight(x, y, z, random.nextInt(max - min + 1) + min);
		if(height >= min){
			var k = 0.25;
			for(var ys = 0; ys < height; ys++){
				if(log.resin && random.nextDouble() < k){
					World.setBlock(x, y + ys, z, log.resin, 4 + random.nextInt(4));
					k -= 0.1;
				}
				else{
					World.setFullBlock(x, y + ys, z, log);
				}
			}
			
			var leavesStart = parseInt(height / 2);
			var leavesEnd = height;
			var leavesHeight = height - leavesStart;
			for(var ys = leavesStart; ys <= leavesEnd; ys++){
				for(var xs = -params.radius; xs <= params.radius; xs++){
					for(var zs = -params.radius; zs <= params.radius; zs++){
						var radius = params.radius + 0.5 + random.nextDouble() * Math.abs(leavesEnd - ys + 1) / leavesHeight;
						if(ys == leavesEnd) radius /= 2;
						if(Math.sqrt(xs*xs + zs*zs) <= radius){
							this.setLeaves(x + xs, y + ys, z + zs, leaves);
						}
					}
				}
			}
			
			if(params.pike){
				for(var ys = 1; ys <= params.pike; ys++){
					this.setLeaves(x, y + ys + height, z, leaves);
				}
			}
		}
	},
	
	getHeight: function(x, y, z, max){
		var height = 0;
		while(height < max){
			var blockID = World.getBlockID(x, y + height, z);
			if(blockID != 0 && ToolAPI.getBlockMaterialName(blockID) != "plant"){
				break;
			}
			height++;
		}
		return height;
	},
	
	setLeaves: function(x, y, z, leaves){
		var blockID = World.getBlockID(x, y, z);
		if(blockID == 0 || blockID == 106){
			World.setFullBlock(x, y, z, leaves);
		}
	},

	generateRubberTree: function(x, y, z, random){
		if(!random) random = new java.util.Random(Debug.sysTime());
		this.generateCustomTree(x, y, z, {
			log: {
				id: BlockID.rubberTreeLog,
				data: 0,
				resin: BlockID.rubberTreeLogLatex
			},
			leaves: {
				id: BlockID.rubberTreeLeaves,
				data: 0
			},
			height: {
				min: 3,
				max: 8,
			},
			pike: 2 + parseInt(random.nextDouble() * 1.5),
			radius: 2
		}, random);
	}
}


var ForestBiomeIDs = [4, 18, 27, 28];
var JungleBiomeIDs = [21, 22, 23, 149, 151];
var SwampBiomeIDs = [6, 134];

var RUBBER_TREE_BIOME_DATA = {
	1: __config__.getNumber("rubber_tree_gen.plains")/100
}
var chance = __config__.getNumber("rubber_tree_gen.forest")/100;
if(chance){
	for(var id in ForestBiomeIDs){
	RUBBER_TREE_BIOME_DATA[ForestBiomeIDs[id]] = chance;}
}
chance = __config__.getNumber("rubber_tree_gen.jungle")/100;
if(chance){
	for(var id in JungleBiomeIDs){
	RUBBER_TREE_BIOME_DATA[JungleBiomeIDs[id]] = chance;}
}
chance = __config__.getNumber("rubber_tree_gen.swamp")/100;
if(chance){
	for(var id in SwampBiomeIDs){
	RUBBER_TREE_BIOME_DATA[SwampBiomeIDs[id]] = chance;}
}

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ, random){
	var biome = World.getBiome((chunkX + 0.5) * 16, (chunkZ + 0.5) * 16);
	if(random.nextDouble() < RUBBER_TREE_BIOME_DATA[biome]){
		var treeCount = 1 + random.nextInt(6);
		var totalCount = 0;
		for(var i = 0; i < treeCount; i++){
			var coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
			if(World.getBlockID(coords.x, coords.y, coords.z) == 2){
				RubberTreeGenerationHelper.generateRubberTree(coords.x, coords.y + 1, coords.z, random)
			}
		}
	}
});
