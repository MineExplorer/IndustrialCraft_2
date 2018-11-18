IDRegistry.genBlockID("conserver");
Block.createBlockWithRotation("conserver", [
	{name: "Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["canning_machine", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.conserver, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canning_machine", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerModelWithRotation(BlockID.conserver, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canning_machine", 1], ["machine_side", 0], ["machine_side", 0]]);

Block.registerDropFunction("conserver", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.conserver, count: 1, data: 0}, [
		" e ",
		" e ",
		"axa"
	], ['x', BlockID.machineBlockBasic, 0, 'e', ItemID.tinCanEmpty, 0, 'a', ItemID.circuitBasic, 0]);
});


MachineRecipeRegistry.registerRecipesFor("canner", {
	//"ItemID.uranium": {storage: [ItemID.fuelRod, 1], result: [ItemID.fuelRodUranium, 1, 0]},
	//"ItemID.mox": {storage: [ItemID.fuelRod, 1], result: [ItemID.fuelRodMOX, 1, 0]},
	354: {storage: [ItemID.tinCanEmpty, 14], result: [ItemID.tinCanFull, 14, 0]},
	413: {storage: [ItemID.tinCanEmpty, 10], result: [ItemID.tinCanFull, 10, 0]},
	320: {storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0]},
	364: {storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0]},
	400: {storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0]},
	282: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
	366: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
	396: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
	424: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
	459: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
	463: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
	297: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
	350: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
	393: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
	412: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
	367: {storage: [ItemID.tinCanEmpty, 4], result: [ItemID.tinCanFull, 4, 1]},
	260: {storage: [ItemID.tinCanEmpty, 4], result: [ItemID.tinCanFull, 4, 0]},
	319: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
	363: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
	391: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
	411: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
	357: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
	360: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
	365: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 1]},
	375: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 2]},
	349: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
	394: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 2]},
	423: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
	460: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
	392: {storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0]},
	457: {storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0]},
	461: {storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0]},
}, true);


var guiConserver = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Canning Machine"}},
		inventory: {standart: true},
		background: {standart: true}
	},

	drawing: [
		{type: "bitmap", x: 400 + 52*GUI_SCALE, y: 50 + 33*GUI_SCALE, bitmap: "canner_arrow", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 416, y: 178, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: MachineRegistry.isValidEUStorage},
		"slotSource": {type: "slot", x: 400 + 32*GUI_SCALE, y: 50 + 32*GUI_SCALE},
		"slotCan": {type: "slot", x: 400 + 63*GUI_SCALE, y: 50 + 32*GUI_SCALE},
		"slotResult": {type: "slot", x: 400 + 111*GUI_SCALE, y: 50 + 32*GUI_SCALE},
		"slotUpgrade1": {type: "slot", x: 870, y: 50 + 4*GUI_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade2": {type: "slot", x: 870, y: 50 + 22*GUI_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade3": {type: "slot", x: 870, y: 50 + 40*GUI_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade4": {type: "slot", x: 870, y: 50 + 58*GUI_SCALE, isValid: UpgradeAPI.isUpgrade},
	}
});

MachineRegistry.registerPrototype(BlockID.conserver, {
	defaultValues: {
		power_tier: 0,
		energy_storage: 800,
		energy_consumption: 1,
		work_time: 150,
		progress: 0,
		isActive: false
	},

	getGuiScreen: function(){
		return guiConserver;
	},

	getTransportSlots: function(){
		return {input: ["slotSource", "slotCan"], output: ["slotResult"]};
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
		var canSlot = this.container.getSlot("slotCan");
		
		var recipe = MachineRecipeRegistry.getRecipeResult("canner", sourceSlot.id);
		if(recipe && canSlot.id == recipe.storage[0] && canSlot.count >= recipe.storage[1] && (resultSlot.id == recipe.result[0] && resultSlot.data == recipe.result[2] && resultSlot.count <= 64 - recipe.result[1] || resultSlot.id == 0)){
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
				canSlot.count -= recipe.storage[1];
				resultSlot.id = recipe.result[0];
				resultSlot.data = recipe.result[2];
				resultSlot.count += recipe.result[1];
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