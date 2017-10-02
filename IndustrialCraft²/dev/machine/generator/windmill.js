IDRegistry.genBlockID("genWindmill");
Block.createBlockWithRotation("genWindmill", [
	{name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Block.registerDropFunction("genWindmill", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.primalGenerator);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWindmill, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0]);
});

MachineRegistry.registerPrototype(BlockID.genWindmill, {
	isGenerator: function() {
		return true;
	},

	energyTick: function(type, src){
		if(World.getThreadTime()%20 == 0){
			var height = Math.max(0, Math.min(this.y-64, 96)) / 64;
			var output = height * 140;
			var wether = World.getWeather();
			if(wether.thunder){output *= 5;}
			else if(wether.rain){output *= 1.5;}
			var radius = 4;
			if(World.getBlockID(
					this.x - random(-radius, radius),
					this.y - random(-radius, radius),
					this.z - random(-radius, radius)
				) == 0){
				src.addAll(Math.round(output));
			}
		}
	}
});

