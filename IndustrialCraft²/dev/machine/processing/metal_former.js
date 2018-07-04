IDRegistry.genBlockID("metalFormer");
Block.createBlockWithRotation("metalFormer", [
	{name: "Metal Former", texture: [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.metalFormer, [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.metalFormer, [["machine_bottom", 0], ["metal_former_top", 1], ["machine_side", 0], ["metal_former_front", 1], ["machine_side", 0], ["machine_side", 0]], true);
//ICRenderLib.addConnectionBlock("bc-container", BlockID.metalFormer);

Block.registerDropFunction("metalFormer", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.metalFormer, count: 1, data: 0}, [
		" x ",
		"b#b",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', ItemID.toolbox, 0, 'c', ItemID.coil, 0]);
});


Callback.addCallback("PreLoaded", function(){
	// rolling
	MachineRecipeRegistry.registerRecipesFor("metalFormer0", {
		// ingots
		265: {id: ItemID.plateIron, count: 1},
		266: {id: ItemID.plateGold, count: 1},
		"ItemID.ingotCopper": {id: ItemID.plateCopper, count: 1},
		"ItemID.ingotTin": {id: ItemID.plateTin, count: 1},
		"ItemID.ingotBronze": {id: ItemID.plateBronze, count: 1},
		"ItemID.ingotSteel": {id: ItemID.plateSteel, count: 1},
		"ItemID.ingotLead": {id: ItemID.plateLead, count: 1},
		// plates
		"ItemID.plateIron": {id: ItemID.casingIron, count: 2},
		"ItemID.plateGold": {id: ItemID.casingGold, count: 2},
		"ItemID.plateTin": {id: ItemID.casingTin, count: 2},
		"ItemID.plateCopper": {id: ItemID.casingCopper, count: 2},
		"ItemID.plateBronze": {id: ItemID.casingBronze, count: 2},
		"ItemID.plateSteel": {id: ItemID.casingSteel, count: 2},
		"ItemID.plateLead": {id: ItemID.casingLead, count: 2}
	}, true);
	// cutting
	MachineRecipeRegistry.registerRecipesFor("metalFormer1", {
		"ItemID.plateTin": {id: ItemID.cableTin0, count: 4},
		"ItemID.plateCopper": {id: ItemID.cableCopper0, count: 4},
		"ItemID.plateGold": {id: ItemID.cableGold0, count: 4},
		"ItemID.plateIron": {id: ItemID.cableIron0, count: 4},
	}, true);
	// extruding
	MachineRecipeRegistry.registerRecipesFor("metalFormer2", {
		"ItemID.ingotTin": {id: ItemID.cableTin0, count: 3},
		"ItemID.ingotCopper": {id: ItemID.cableCopper0, count: 3},
		"ItemID.ingotGold": {id: ItemID.cableGold0, count: 4},
		265: {id: ItemID.cableIron0, count: 4},
	}, true);
});


var guiMetalFormer = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Metal Former"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "metalformer_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "metalformer_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212, isValid: function(id){return ChargeItemRegistry.isValidStorage(id, "Eu", 0);}},
		"slotResult": {type: "slot", x: 715, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade2": {type: "slot", x: 820, y: 112, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade3": {type: "slot", x: 820, y: 176, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade4": {type: "slot", x: 820, y: 240, isValid: UpgradeAPI.isUpgrade},
		"button": {type: "button", x: 575, y: 210, bitmap: "button_slot", scale: GUI_BAR_STANDART_SCALE, clicker: {
			onClick: function(container, tileEntity){
				tileEntity.data.mode = (tileEntity.data.mode + 1) % 3;
			}
		}}
	}
});

MachineRegistry.registerPrototype(BlockID.metalFormer, {
	defaultValues: {
		energy_storage: 4000,
		energy_consumption: 10,
		work_time: 200,
		progress: 0,
		mode: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiMetalFormer;
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
		var content = this.container.getGuiContent();
		if(content){
			content.elements.button.bitmap = "metal_former_button_" + this.data.mode;
		}
		this.setDefaultValues();
		UpgradeAPI.executeUpgrades(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var result = MachineRecipeRegistry.getRecipeResult("metalFormer" + this.data.mode, sourceSlot.id)
		if(result && (resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				sourceSlot.count -= 1;
				resultSlot.id = result.id;
				resultSlot.count += result.count;
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 32, 0);
		
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