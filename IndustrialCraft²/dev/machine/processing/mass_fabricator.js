IDRegistry.genBlockID("massFabricator");
Block.createBlockWithRotation("massFabricator", [
	{name: "Mass Fabricator", texture: [["machine_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]], inCreative: true}
]);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.massFabricator);

Block.registerDropFunction("massFabricator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.massFabricator, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['b', BlockID.machineBlockAdvanced, 0, 'x', 348, 0, 'a', ItemID.circuitAdvanced, 0, '#', ItemID.storageLapotronCrystal, -1]);
});

var guiMassFabricator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Mass Fabricator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 850, y: 190, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"energyScale": {type: "scale", x: 850, y: 190, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"matterSlot": {type: "slot", x: 821, y: 75, size: 100},
		"catalyserSlot": {type: "slot", x: 841, y: 252},
		"textInfo1": {type: "text", x: 542, y: 142, width: 200, height: 30, text: "Progress:"},
		"textInfo2": {type: "text", x: 542, y: 177, width: 200, height: 30, text: "0%"},
		"textInfo3": {type: "text", x: 542, y: 212, width: 200, height: 30, text: " "},
		"textInfo4": {type: "text", x: 542, y: 239, width: 200, height: 30, text: " "},
	}
});


MachineRegistry.registerPrototype(BlockID.massFabricator, {
	defaultValues: {
		progress: 0,
		catalyser: 0,
		catalyserRatio: 0
	},
	
	getGuiScreen: function(){
		return guiMassFabricator;
	},
		
	getTransportSlots: function(){
		return {input: ["catalyserSlot"], output: ["matterSlot"]};
	},
	
	tick: function(){
		var ENERGY_PER_MATTER = 1000000;
		this.container.setScale("energyScale", this.data.energy / this.getEnergyStorage());
		this.container.setText("textInfo2", parseInt(100 * this.data.progress / ENERGY_PER_MATTER) + "%");
		
		if (this.data.catalyser > 0){
			this.container.setText("textInfo3", "Catalyser:");
			this.container.setText("textInfo4", parseInt(this.data.catalyser));
			var transfer = Math.min(this.data.catalyser, this.data.energy);
			this.data.progress += transfer * (this.data.catalyserRatio || 0);
			this.data.energy -= transfer;
			this.data.catalyser -= transfer;
		}
		else{
			this.container.setText("textInfo3", "");
			this.container.setText("textInfo4", "");
			var transfer = Math.min(ENERGY_PER_MATTER - this.data.progress, this.data.energy);
			this.data.progress += transfer;
			this.data.energy -= transfer;
			
			var catalyserSlot = this.container.getSlot("catalyserSlot");
			var catalyserData = MachineRecipeRegistry.getRecipeResult("catalyser", catalyserSlot.id);
			if (catalyserData){
				this.data.catalyser = catalyserData.input;
				this.data.catalyserRatio = catalyserData.output / catalyserData.input;
				catalyserSlot.count--;
				this.container.validateAll();
			}
		}
		
		if (this.data.progress >= ENERGY_PER_MATTER){
			var matterSlot = this.container.getSlot("matterSlot");
			if (matterSlot.id == ItemID.matter && matterSlot.count < 64 || matterSlot.id == 0){
				matterSlot.id = ItemID.matter;
				matterSlot.count++;
				this.data.progress = 0;
			}
			else{
				this.data.progress = ENERGY_PER_MATTER;
			}
		}
	},
	
	getEnergyStorage: function(){
		return 8192;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});