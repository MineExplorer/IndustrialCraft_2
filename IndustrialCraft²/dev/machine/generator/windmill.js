IDRegistry.genBlockID("genWindmill");
Block.createBlock("genWindmill", [
	{name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.genWindmill, [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.genWindmill, 0, [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]]);

Block.registerDropFunction("genWindmill", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.genWindmill, count: 1, data: 0}, [
		"x x",
		" # ",
		"xcx"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'c', ItemID.coil, 0]);
});

MachineRegistry.registerGenerator(BlockID.genWindmill, {
	defaultValues: {
		meta: 0,
		output: 0
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
				this.data.output = Math.round(output)/20;
			}
			else this.data.output = 0;
		}
		src.addAll(this.data.output);
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	},
});

TileRenderer.setRotationPlaceFunction(BlockID.genWindmill);
