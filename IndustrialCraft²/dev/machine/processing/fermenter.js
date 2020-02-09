IDRegistry.genBlockID("fermenter");
Block.createBlock("fermenter", [
	{name: "Fermenter", texture: [["machine_bottom", 0], ["machine_top", 0], ["fermenter_back", 0], ["heat_pipe", 0], ["fermenter_side", 0], ["fermenter_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.fermenter, [["machine_bottom", 0], ["machine_top", 0], ["fermenter_back", 0], ["heat_pipe", 0], ["fermenter_side", 0], ["fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.fermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["fermenter_back", 0], ["heat_pipe", 0], ["fermenter_side", 0], ["fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.fermenter, 6, [["machine_bottom", 0], ["machine_top", 1], ["fermenter_back", 0], ["heat_pipe", 1], ["fermenter_side", 1], ["fermenter_side", 1]]);

Block.registerDropFunction("fermenter", function(coords, blockID, blockData, level, enchant){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.fermenter, count: 1, data: 0}, [
		"aaa",
		"ccc",
		"axa"
	], ['c', ItemID.cellEmpty, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});


var guiFermenter = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Fermenter")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400, y: 50, bitmap: "blast_furnace_background", scale: GUI_SCALE},
		{type: "bitmap", x: 540 + 6*GUI_SCALE, y: 110 + 8*GUI_SCALE, bitmap: "progress_scale_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 540 + 6*GUI_SCALE, y: 110 + 8*GUI_SCALE, direction: 1, value: 0.5, bitmap: "progress_scale", scale: GUI_SCALE},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiFermenter, "Fermenter");
});

MachineRegistry.registerPrototype(BlockID.fermenter, {
	defaultValues:{
		meta: 0,
		progress: 0,
		isActive: false,
	},
	
	upgrades: ["itemEjector", "itemPulling", "fluidEjector", "fluidPulling"],
	
	getGuiScreen: function(){
       return null;
    },
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
    tick: function(){
		StorageInterface.checkHoppers(this);
		UpgradeAPI.executeUpgrades(this);
		this.container.setScale("progressScale", 0);
    },
	
	heatReceive: function(amount){
		return 0;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides,
});

TileRenderer.setRotationPlaceFunction(BlockID.fermenter, true);

StorageInterface.createInterface(BlockID.fermenter, {
	slots: {
		
	}
});
