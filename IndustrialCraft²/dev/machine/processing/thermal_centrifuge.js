IDRegistry.genBlockID("thermalCentrifuge");
Block.createBlockWithRotation("thermalCentrifuge", [
	{name: "Thermal Centrifuge", texture: [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.thermalCentrifuge, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.thermalCentrifuge, [["machine_advanced", 0], ["thermal_centrifuge_top", 1], ["machine_side", 0], ["thermal_centrifuge_front", 1], ["thermal_centrifuge_side", 1], ["thermal_centrifuge_side", 1]], true);

Block.registerDropFunction("thermalCentrifuge", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.thermalCentrifuge, count: 1, data: 0}, [
		"cmc",
		"a#a",
		"axa"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.electricMotor, 0, 'a', 265, 0, 'm', ItemID.miningLaser, 0, 'c', ItemID.coil, 0]);
});

Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("thermalCentrifuge", {
		//4: {result: [ItemID.dustStone, 1], heat: 100},
		"ItemID.crushedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1, ItemID.dustStone, 1], heat: 500},
		"ItemID.crushedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1, ItemID.dustStone, 1], heat: 1000},
		"ItemID.crushedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1, ItemID.dustStone, 1], heat: 1500},
		"ItemID.crushedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedLead": {result: [ItemID.dustSmallCopper, 1, ItemID.dustLead, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedPurifiedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1], heat: 500},
		"ItemID.crushedPurifiedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1], heat: 1000},
		"ItemID.crushedPurifiedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1], heat: 1500},
		"ItemID.crushedPurifiedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1], heat: 2000},
		"ItemID.crushedPurifiedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1], heat: 2000},
		"ItemID.crushedPurifiedLead": {result: [ItemID.dustSmallCopper, 1, ItemID.dustLead, 1], heat: 2000}
	}, true);
});


var guiCentrifuge = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Thermal Centrifuge"}},
		inventory: {standart: true},
		background: {standart: true},
	},

	params: {       
		slot: "default_slot",
		invSlot: "default_slot"              
	},

	drawing: [
		{type: "background", color: android.graphics.Color.rgb(179, 179, 179)},
		{type: "bitmap", x: 400, y: 50, bitmap: "thermal_centrifuge_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 400 + 8*GUI_BAR_STANDART_SCALE, y: 50 + 38*GUI_BAR_STANDART_SCALE, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 400 + 80*GUI_BAR_STANDART_SCALE, y: 50 + 21*GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "thermal_centrifuge_scale", scale: GUI_BAR_STANDART_SCALE},
		"heatScale": {type: "scale", x: 400 + 64*GUI_BAR_STANDART_SCALE, y: 50 + 62*GUI_BAR_STANDART_SCALE, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 400 + 8*GUI_BAR_STANDART_SCALE, y: 50 + 38*GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 6*GUI_BAR_STANDART_SCALE, y: 50 + 55*GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 400 + 6*GUI_BAR_STANDART_SCALE, y: 50 + 16*GUI_BAR_STANDART_SCALE},
		"slotResult1": {type: "slot", x: 400 + 119*GUI_BAR_STANDART_SCALE, y: 50 + 13*GUI_BAR_STANDART_SCALE},
		"slotResult2": {type: "slot", x: 400 + 119*GUI_BAR_STANDART_SCALE, y: 50 + 31*GUI_BAR_STANDART_SCALE},
		"slotResult3": {type: "slot", x: 400 + 119*GUI_BAR_STANDART_SCALE, y: 50 + 49*GUI_BAR_STANDART_SCALE},
		"slotUpgrade1": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 4*GUI_BAR_STANDART_SCALE},
		"slotUpgrade2": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 22*GUI_BAR_STANDART_SCALE},
		"slotUpgrade3": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 40*GUI_BAR_STANDART_SCALE},
		"slotUpgrade4": {type: "slot", x: 400 + 147*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE},
		"indicator": {type: "image", x: 400 + 88*GUI_BAR_STANDART_SCALE, y: 50 + 58*GUI_BAR_STANDART_SCALE, bitmap: "indicator_red", scale: GUI_BAR_STANDART_SCALE}
	}
});


MachineRegistry.registerPrototype(BlockID.thermalCentrifuge, {
	defaultValues: {
		energy_storage: 20000,
		energy_consumption: 32,
		work_time: 500,
		progress: 0,
		isActive: false,
		isHeating: false,
		heat: 0,
		maxHeat: 5000,
		upgrades: {}
	},

	getGuiScreen: function(){
		return guiCentrifuge;
	},
		
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult1", "slotResult2", "slotResult3"]};
	},

	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},

	checkResult: function(result){
		for(var i = 1; i < 4; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if(resultSlot.id == id && resultSlot.count + count <= 64 || resultSlot.id == 0 || !id){
				return true;
			}
		}
	},

	putResult: function(result, sourceSlot){
		sourceSlot.count--;
		for(var i = 1; i < 4; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if(id){
				resultSlot.id = id;
				resultSlot.count += count;
			}
		}
	},

	tick: function(){
		this.setDefaultValues();
		this.data.upgrades = UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("thermalCentrifuge", sourceSlot.id, sourceSlot.data);
		if(result && this.checkResult(result.result) && this.data.energy > 0){
			this.data.maxHeat = result.heat;
			if(this.data.heat < result.heat){
				this.data.energy--;
				this.data.heat++;
			}
			else if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				this.putResult(result.result, sourceSlot);
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.maxHeat = 5000;
			this.data.progress = 0;
			this.deactivate();
			if(this.data.isHeating && this.data.energy > 1){
				if(this.data.heat < 5000){this.data.heat++;}
				this.data.energy -= 2;
			}
			else if(this.data.heat > 0){
				this.data.heat--;
			}
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(128, energyStorage - this.data.energy), 1);
		
		var content = this.container.getGuiContent();
		if(content){
			if(this.data.heat >= this.data.maxHeat){
			content.elements["indicator"].bitmap = "indicator_green";}
			else{
			content.elements["indicator"].bitmap = "indicator_red";}
		}
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	redstone: function(signal){
		this.data.isHeating = signal.power > 0;
		if(this.data.upgrades[ItemID.upgradeRedstone]){
			this.data.isHeating = !this.data.isHeating;
		}
		if(this.data.isHeating){
			this.data.maxHeat = 5000;
		}
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
