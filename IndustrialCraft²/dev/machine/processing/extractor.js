IDRegistry.genBlockID("extractor");
Block.createBlock("extractor", [
	{name: "Extractor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.extractor, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], true);
TileRenderer.registerRotationModel(BlockID.extractor, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]]);
TileRenderer.registerRotationModel(BlockID.extractor, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 1], ["extractor_side", 1], ["extractor_side", 1]]);

ItemName.addTierTooltip("extractor", 1);

Block.registerDropFunction("extractor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.extractor, count: 1, data: 0}, [
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.treetap, 0, 'a', ItemID.circuitBasic, 0]);
	
	MachineRecipeRegistry.registerRecipesFor("extractor", {
		"ItemID.latex": {id: ItemID.rubber, count: 3},
		"ItemID.rubberSapling": {id: ItemID.rubber, count: 1},
		"BlockID.rubberTreeLog": {id: ItemID.rubber, count: 1},
		35: {id: 35, count: 1},
		289: {id: ItemID.dustSulfur, count: 1},
		"ItemID.tinCanFull": {id: ItemID.tinCanEmpty, count: 1},
	}, true);
});


var guiExtractor = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Extractor")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "extractor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79, isValid: function(id, count, data){
			return MachineRecipeRegistry.hasRecipeFor("extractor", id);
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
	MachineRegistry.updateGuiHeader(guiExtractor, "Extractor");
});

MachineRegistry.registerElectricMachine(BlockID.extractor, {
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
		return guiExtractor;
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
		var resultSlot = this.container.getSlot("slotResult");
		var result = MachineRecipeRegistry.getRecipeResult("extractor", sourceSlot.id);
		if(result && (resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0)){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				newActive = true;
				this.startPlaySound();
			}
			if(this.data.progress.toFixed(3) >= 1){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.count += result.count;
				this.container.validateAll();
				this.data.progress = 0;
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
		return "Machines/ExtractorOp.ogg";
    },
	getInterruptSoundFile: function(){
		return "Machines/InterruptOne.ogg";
    },
	
	renderModel: MachineRegistry.renderModelWithRotation,
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.extractor);

StorageInterface.createInterface(BlockID.extractor, {
	slots: {
		"slotSource": {input: true},
		"slotResult": {output: true}
	},
	isValidInput: function(item){
		return MachineRecipeRegistry.hasRecipeFor("extractor", item.id);
	}
});