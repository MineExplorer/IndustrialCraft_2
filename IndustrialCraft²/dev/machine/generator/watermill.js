IDRegistry.genBlockID("genWatermill");
Block.createBlock("genWatermill", [
	{name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.genWatermill, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]]);
TileRenderer.registerRotationModel(BlockID.genWatermill, 0, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]]);

Block.registerDropFunction("genWatermill", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.genWatermill, count: 1, data: 0}, [
		"x x",
		"a#a",
		"xcx"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'a', ItemID.casingSteel, 0, 'c', ItemID.coil, 0]);
});


MachineRegistry.registerGenerator(BlockID.genWatermill, {
	defaultValues: {
		meta: 0,
		output: 0
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
			this.data.output = 0;
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
					this.data.output = Math.round(output)/20;
				}
				else{
					this.data.output = 0;
				}
			}
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

TileRenderer.setRotationPlaceFunction(BlockID.genWatermill);
