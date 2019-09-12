IDRegistry.genBlockID("rtGenerator");
Block.createBlock("rtGenerator", [
	{name: "Radioisotope Thermoelectric Generator", texture: [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.rtGenerator, [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.rtGenerator, 0, [["machine_bottom", 0], ["rt_generator_top", 1], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);

Block.registerDropFunction("rtGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.rtGenerator, count: 1, data: 0}, [
		"ccc",
		"c#c",
		"cxc"
	], ['#', BlockID.reactorChamber, 0, 'x', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0]);
});

var guiRTGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Radioisotope Thermoelectric Generator")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 630, y: 150, bitmap: "energy_bar_background", scale: GUI_SCALE},
	],
	
	elements: {
		"slot0": {type: "slot", x: 420, y: 120, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot1": {type: "slot", x: 480, y: 120, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot2": {type: "slot", x: 540, y: 120, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot3": {type: "slot", x: 420, y: 180, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot4": {type: "slot", x: 480, y: 180, isValid: function(id){return id == ItemID.rtgPellet}},
		"slot5": {type: "slot", x: 540, y: 180, isValid: function(id){return id == ItemID.rtgPellet}},
		
		"energyScale": {type: "scale", x: 630 + GUI_SCALE * 4, y: 150, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", x: 742, y: 148, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 742, y: 178, width: 300, height: 30, text: "10000"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiRTGenerator, "Radioisotope Thermoelectric Generator");
});

MachineRegistry.registerGenerator(BlockID.rtGenerator, {
    defaultValues: {
		meta: 0,
		isActive: false
	},
    
	getGuiScreen: function(){
		return guiRTGenerator;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		var output = 0.5;
		for(var i = 0; i < 6; i++){
			var slot = this.container.getSlot("slot"+i);
			if(slot.id == ItemID.rtgPellet){
				output *= 2;
			}
		}
		output = parseInt(output);
		this.setActive(output > 0);
		this.data.energy = Math.min(this.data.energy + output, energyStorage);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", this.data.energy + "/");
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	
	renderModel: MachineRegistry.renderModel
});
