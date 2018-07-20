IDRegistry.genBlockID("recycler");
Block.createBlockWithRotation("recycler", [
	{name: "Recycler", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.recycler, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerModelWithRotation(BlockID.recycler, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["recycler_front", 1], ["machine_side", 0], ["machine_side", 0]]);

Block.registerDropFunction("recycler", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.recycler, count: 1, data: 0}, [
		" a ",
		"x#x",
		"bxb"
	], ['#', BlockID.compressor, -1, 'x', 3, -1, 'a', 348, 0, 'b', ItemID.ingotSteel, 0]);
});


var recyclerBlacklist = [102, 280, 78, 80, 332];

var guiRecycler = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Recycler"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "recycler_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "recycler_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
        "slotSource": {type: "slot", x: 441, y: 79},
        "slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
        "slotResult": {type: "slot", x: 625, y: 148},
		"slotUpgrade1": {type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade2": {type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade3": {type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade4": {type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isUpgrade},
	}
});


MachineRegistry.registerPrototype(BlockID.recycler, {
	defaultValues: {
		power_tier: 0,
		energy_storage: 800,
		energy_consumption: 1,
		work_time: 45,
		progress: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiRecycler;
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeUpgrades(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		if(sourceSlot.id > 0 && (resultSlot.id == ItemID.scrap && resultSlot.count < 64 || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				sourceSlot.count--;
				if(Math.random() < 0.125 && recyclerBlacklist.indexOf(sourceSlot.id) == -1){
					resultSlot.id = ItemID.scrap;
					resultSlot.count++;
				}
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
		}
		
		var energyStorage = this.getEnergyStorage();
		var tier = this.data.power_tier;
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, transferByTier[tier], tier);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	init: MachineRegistry.initModel,
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});