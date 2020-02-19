IDRegistry.genBlockID("stirlingGenerator");
Block.createBlock("stirlingGenerator", [
	{name: "Stirling Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.stirlingGenerator, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.stirlingGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]]);

Block.registerDropFunction("stirlingGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.stirlingGenerator, count: 1, data: 0}, [
		"cxc",
		"c#c",
		"ccc"
	], ['#', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});

MachineRegistry.registerGenerator(BlockID.stirlingGenerator, {
	defaultValues: {
		meta: 0,
		heat: 0
	},
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	canReceiveHeat: function(side){
		return this.data.meta == side + Math.pow(-1, side);
	},
	
	heatReceive: function(amount){
		if(this.data.energy == 0){
			this.data.energy = Math.round(amount / 2);
			return amount;
		}
		return 0;
	},
	
	energyTick: function(type, src){
		if(src.add(this.data.energy) < this.data.energy){
			this.data.energy = 0;
		}
	},
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta);
	}
});

TileRenderer.setRotationPlaceFunction(BlockID.stirlingGenerator, true);
