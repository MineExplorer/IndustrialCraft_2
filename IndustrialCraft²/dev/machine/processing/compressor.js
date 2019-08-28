IDRegistry.genBlockID("compressor");
Block.createBlock("compressor", [
	{name: "Compressor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.compressor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.compressor, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.compressor, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 1], ["machine_side", 0], ["machine_side", 0]]);

ItemName.addTierTooltip("compressor", 1);

Block.registerDropFunction("compressor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.compressor, count: 1, data: 0}, [
		"x x",
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', 1, -1, 'a', ItemID.circuitBasic, 0]);
	
	
	MachineRecipeRegistry.registerRecipesFor("compressor", {
		// Items
		"ItemID.dustEnergium": {id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), ingredientCount: 9},
		"ItemID.dustLapis": {id: ItemID.plateLapis, count: 1, data: 0},
		"ItemID.ingotAlloy": {id: ItemID.plateAlloy, count: 1, data: 0},
		"ItemID.carbonMesh": {id: ItemID.carbonPlate, count: 1, data: 0},
		"ItemID.coalBall": {id: ItemID.coalBlock, count: 1, data: 0},
		"ItemID.coalChunk": {id: 264, count: 1, data: 0},
		"ItemID.cellEmpty": {id: ItemID.cellAir, count: 1, data: 0},
		// Dense Plates
		"ItemID.densePlateIron": {id: ItemID.plateIron, count: 9},
		"ItemID.densePlateGold": {id: ItemID.plateGold, count: 9},
		"ItemID.densePlateTin": {id: ItemID.plateTin, count: 9},
		"ItemID.densePlateCopper": {id: ItemID.plateCopper, count: 9},
		"ItemID.densePlateBronze": {id: ItemID.plateBronze, count: 9},
		"ItemID.densePlateSteel": {id: ItemID.plateSteel, count: 9},
		"ItemID.densePlateLead": {id: ItemID.plateLead, count: 9},
		
		// Blocks
		265: {id: 42, count: 1, data: 0, ingredientCount: 9},
		266: {id: 41, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotCopper": {id: BlockID.blockCopper, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotTin": {id: BlockID.blockTin, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotLead": {id: BlockID.blockLead, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotSteel": {id: BlockID.blockSteel, count: 1, data: 0, ingredientCount: 9},
		"ItemID.ingotBronze": {id: BlockID.blockBronze, count: 1, data: 0, ingredientCount: 9},
		80: {id: 79, count: 1, data: 0},
		12: {id: 24, count: 1, data: 0, ingredientCount: 4},
		336: {id: 45, count: 1, data: 0, ingredientCount: 4},
		405: {id: 112, count: 1, data: 0, ingredientCount: 4},
		348: {id: 89, count: 1, data: 0, ingredientCount: 4},
		406: {id: 155, count: 1, data: 0, ingredientCount: 4},
		331: {id: 152, count: 1, data: 0, ingredientCount: 9},
		"351:4": {id: 22, count: 1, data: 0, ingredientCount: 9},
		264: {id: 57, count: 1, data: 0, ingredientCount: 9},
		388: {id: 133, count: 1, data: 0, ingredientCount: 9},
	}, true);
});


var guiCompressor = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Compressor")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "compressor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "compressor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79},
		"slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade2": {type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade3": {type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade4": {type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiCompressor, "Compressor");
});

MachineRegistry.registerElectricMachine(BlockID.compressor, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 1200,
		energy_consumption: 2,
		work_time: 400,
		meta: 0,
		progress: 0,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiCompressor;
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	setDefaultValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeUpgrades(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("compressor", sourceSlot.id, sourceSlot.data);
		if(result && (sourceSlot.count >= result.ingredientCount || !result.ingredientCount)){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= Item.getMaxStack(result.id) - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					this.activate();
				}
				else{
					this.deactivate();
				}
				if(this.data.progress.toFixed(3) >= 1){
					sourceSlot.count -= result.ingredientCount || 1;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}else{
				this.deactivate();
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
		}
		
		var tier = this.getTier();
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, transferByTier[tier], tier);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	init: MachineRegistry.updateMachine,
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.compressor);
