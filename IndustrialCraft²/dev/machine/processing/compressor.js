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
		// Blocks
		80: {id: 79, count: 1, data: 0},
		12: {id: 24, count: 1, data: 0, sourceCount: 4},
		336: {id: 45, count: 1, data: 0, sourceCount: 4},
		405: {id: 112, count: 1, data: 0, sourceCount: 4},
		348: {id: 89, count: 1, data: 0, sourceCount: 4},
		406: {id: 155, count: 1, data: 0, sourceCount: 4},
		// Items
		"ItemID.dustEnergium": {id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), sourceCount: 9},
		"ItemID.ingotAlloy": {id: ItemID.plateAlloy, count: 1, data: 0},
		"ItemID.carbonMesh": {id: ItemID.carbonPlate, count: 1, data: 0},
		"ItemID.coalBall": {id: ItemID.coalBlock, count: 1, data: 0},
		"ItemID.coalChunk": {id: 264, count: 1, data: 0},
		"ItemID.cellEmpty": {id: ItemID.cellAir, count: 1, data: 0},
		"ItemID.dustLapis": {id: ItemID.plateLapis, count: 1, data: 0},
		// Dense Plates
		"ItemID.plateIron": {id: ItemID.densePlateIron, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateGold": {id: ItemID.densePlateGold, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateTin": {id: ItemID.densePlateTin, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateCopper": {id: ItemID.densePlateCopper, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateBronze": {id: ItemID.densePlateBronze, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateSteel": {id: ItemID.densePlateSteel, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateLead": {id: ItemID.densePlateLead, count: 1, data: 0, sourceCount: 9},
		// Compact
		331: {id: 152, count: 1, data: 0, sourceCount: 9},
		"351:4": {id: 22, count: 1, data: 0, sourceCount: 9},
		264: {id: 57, count: 1, data: 0, sourceCount: 9},
		388: {id: 133, count: 1, data: 0, sourceCount: 9},
		265: {id: 42, count: 1, data: 0, sourceCount: 9},
		266: {id: 41, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotCopper": {id: BlockID.blockCopper, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotTin": {id: BlockID.blockTin, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotLead": {id: BlockID.blockLead, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotSteel": {id: BlockID.blockSteel, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotBronze": {id: BlockID.blockBronze, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallIron": {id: ItemID.dustIron, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallGold": {id: ItemID.dustGold, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallCopper": {id: ItemID.dustCopper, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallTin": {id: ItemID.dustTin, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallLead": {id: ItemID.dustLead, count: 1, data: 0, sourceCount: 9},
		"ItemID.smallUranium235": {id: ItemID.uranium235, count: 1, data: 0, sourceCount: 9},
		"ItemID.smallPlutonium": {id: ItemID.plutonium, count: 1, data: 0, sourceCount: 9}
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
		"slotSource": {type: "slot", x: 441, y: 79, isValid: function(id, count, data){
			return MachineRecipeRegistry.hasRecipeFor("compressor", id, data);
		}},
		"slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 820, y: 60, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 820, y: 119, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 820, y: 178, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 820, y: 237, isValid: UpgradeAPI.isValidUpgrade},
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
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
		return guiCompressor;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("compressor", sourceSlot.id, sourceSlot.data);
		if(result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
					this.startPlaySound();
				}
				if(this.data.progress.toFixed(3) >= 1){
					sourceSlot.count -= result.sourceCount || 1;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		if(!newActive)
			this.stopPlaySound(true);
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	getStartSoundFile: function(){
		return "Machines/CompressorOp.ogg";
    },
	getInterruptSoundFile: function(){
		return "Machines/InterruptOne.ogg";
    },
	
	renderModel: MachineRegistry.renderModelWithRotation,
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.compressor);

StorageInterface.createInterface(BlockID.compressor, {
	slots: {
		"slotSource": {input: true},
		"slotResult": {output: true}
	},
	isValidInput: function(item){
		return MachineRecipeRegistry.hasRecipeFor("compressor", item.id, item.data);
	}
});
