IDRegistry.genBlockID("genWatermill");
Block.createBlockWithRotation("genWatermill", [
	{name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill", 2], ["watermill", 0], ["watermill", 1], ["watermill", 1]], inCreative: true}
]);

Block.registerDropFunction("genWatermill", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.primalGenerator);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWatermill, count: 1, data: 0}, [
		"axa",
		"x#x",
		"axa"
	], ['#', BlockID.primalGenerator, -1, 'x', 5, -1, 'a', 280, 0]);
});


MachineRegistry.registerPrototype(BlockID.genWatermill, {
	isGenerator: function() {
		return true;
	},

	biomeCheck: function(x, z){
		var coords = [[x, z], [x-7, z], [x+7, z], [x, z-7], [x, z+7]];
		for(var c in coords){
			var biome = World.getBiome(c[0], c[1]);
			if(biome==0 || biome==24){return "ocean";}
			if(biome==7){return "river";}
		}
		return 0;
	},

	energyTick: function(type, src){
		if(World.getThreadTime()%20 == 0){
			var biome = this.biomeCheck(this.x, this.z);
			if(biome && this.y >= 32 && this.y < 64){
				var output = 50;
				var radius = 1;
				var wether = World.getWeather();
				if(wether.thunder && wether.rain){
					if(wether.thunder){output *= 2;}
					else{output *= 1.5;}
				}
				else if(biome=="ocean"){
					output *= 1.5*Math.sin(World.getWorldTime()%6000/(6000/Math.PI));
				}
				var tile = World.getBlockID(
					this.x - random(-radius, radius),
					this.y - random(-radius, radius),
					this.z - random(-radius, radius)
				);
				if(tile == 8 || tile == 9){
					src.addAll(Math.round(output));
				}
			}
		}
	}
});
