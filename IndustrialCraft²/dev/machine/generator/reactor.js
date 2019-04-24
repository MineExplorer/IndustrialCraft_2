IDRegistry.genBlockID("nuclearReactor");
Block.createBlock("nuclearReactor", [
	{name: "Nuclear Reactor", texture: [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.nuclearReactor, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]]);
TileRenderer.registerRenderModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1]]);

Block.registerDropFunction("nuclearReactor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

IDRegistry.genBlockID("reactorChamber");
Block.createBlock("reactorChamber", [
	{name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true},
], "opaque");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.nuclearReactor, count: 1, data: 0}, [
		"xcx",
		"aaa",
		"x#x"
	], ['#', BlockID.primalGenerator, 0, 'a', BlockID.reactorChamber, 0, 'x', ItemID.plateLead, 0, 'c', ItemID.circuitAdvanced, 0]); // dense lead plate
	
	Recipes.addShaped({id: BlockID.reactorChamber, count: 1, data: 0}, [
		" x ",
		"x#x",
		" x "
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.plateLead, 0]);
});


MachineRegistry.registerElectricMachine(BlockID.nuclearReactor, {
	defaultValues: {
		isActive: false,
		heat: 300
	},
	
	isGenerator: function() {
		return true;
	},
	
	getChamberCount: function(){
		var count = 0;
		var coords = [[-1,0,0], [1,0,0], [0,-1,0], [0,1,0], [0,0,-1], [0,0,1]];
		for(var i in coords){
			var c = coords[i];
			if(World.getBlockID(this.x+c[0], this.y+c[1], this.z+c[2]) == BlockID.reactorChamber){
				count++;
			}
		}
		return count;
	},
	
	tick: function(){
		
	},
	
	redstone: function(signal){
		if(signal.power > 0) this.data.isActive = true;
	},
	
	canReceiveEnergy: function(){
		return false;
	},
	
	isEnergySource: function(){
		return true;
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		src.add(this.data.energy);
	}
});

MachineRegistry.registerElectricMachine(BlockID.reactorChamber, {
	defaultValues: {
		reactor: null
	},
	isGenerator: function() {
		return true;
	},
});