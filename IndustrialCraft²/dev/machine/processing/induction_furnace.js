IDRegistry.genBlockID("inductionFurnace");
Block.createBlock("inductionFurnace", [
	{name: "Induction Furnace", texture: [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.inductionFurnace, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.inductionFurnace, 0, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerRotationModel(BlockID.inductionFurnace, 4, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);

ItemName.addTierTooltip("inductionFurnace", 2);

Block.registerDropFunction("inductionFurnace", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.inductionFurnace, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xax"
	], ['#', BlockID.electricFurnace, -1, 'x', ItemID.ingotCopper, 0, 'a', BlockID.machineBlockAdvanced, 0]);
});


var guiInductionFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Induction Furnace")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 630, y: 146, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 630, y: 146, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource1": {type: "slot", x: 511, y: 75, isValid: function(id, count, data){
			return Recipes.getFurnaceRecipeResult(id, "iron")? true : false;
		}},
		"slotSource2": {type: "slot", x: 571, y: 75, isValid: function(id, count, data){
			return Recipes.getFurnaceRecipeResult(id, "iron")? true : false;
		}},
		"slotEnergy": {type: "slot", x: 541, y: 212, isValid: MachineRegistry.isValidEUStorage},
		"slotResult1": {type: "slot", x: 725, y: 142, isValid: function(){return false;}},
		"slotResult2": {type: "slot", x: 785, y: 142, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 900, y: 80, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 900, y: 144, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 900, y: 208, isValid: UpgradeAPI.isValidUpgrade},
		"textInfo1": {type: "text", x: 402, y: 143, width: 100, height: 30, text: Translation.translate("Heat:")},
		"textInfo2": {type: "text", x: 402, y: 173, width: 100, height: 30, text: "0%"},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiInductionFurnace, "Induction Furnace");
});

MachineRegistry.registerElectricMachine(BlockID.inductionFurnace, {
	defaultValues: {
		power_tier: 2,
		energy_storage: 10000,
		meta: 0,
		progress: 0,
		isActive: false,
		isHeating: false,
		heat: 0,
		signal: 0
	},
	
	upgrades: ["transformer", "energyStorage", "redstone", "itemEjector", "itemPulling"],
	
	getGuiScreen: function(){
		return guiInductionFurnace;
	},
	
	getResult: function(){
		var sourceSlot1 = this.container.getSlot("slotSource1");
		var sourceSlot2 = this.container.getSlot("slotSource2");
		var result1 = Recipes.getFurnaceRecipeResult(sourceSlot1.id, "iron");
		var result2 = Recipes.getFurnaceRecipeResult(sourceSlot2.id, "iron");
		if(result1 || result2){
			return [result1, result2];
		}
	},
	
	putResult: function(result, sourceSlot, resultSlot){
		if(result){
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.data = result.data;
				resultSlot.count++;
				return true;
			}
		}
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.isHeating = this.data.signal > 0;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var result = this.getResult();
		if(result){
			if(this.data.energy > 15 && this.data.progress < 100){
				this.data.energy -= 16;
				if(this.data.heat < 10000){this.data.heat++;}
				this.data.progress += this.data.heat / 1200;
				newActive = true;
				this.startPlaySound();
			}
			if(this.data.progress >= 100){
				var put1 = this.putResult(result[0], this.container.getSlot("slotSource1"), this.container.getSlot("slotResult1"));
				var put2 = this.putResult(result[1], this.container.getSlot("slotSource2"), this.container.getSlot("slotResult2"));
				if(put1 || put2){
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
			if(this.data.isHeating && this.data.energy > 0){
				if(this.data.heat < 10000){this.data.heat++;}
				this.data.energy--;
			}
			else if(this.data.heat > 0){
				this.data.heat -= 4;
			}
		}
		if(!newActive)
			this.stopPlaySound(true);
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress / 100);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo2", parseInt(this.data.heat / 100) + "%");
	},
	
	redstone: function(signal){
		this.data.signal = signal.power;
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	getStartingSoundFile: function(){
		return "Machines/Induction Furnace/InductionStart.ogg";
    },
	getStartSoundFile: function(){
		return "Machines/Induction Furnace/InductionLoop.ogg";
    },
	getInterruptSoundFile: function(){
		return "Machines/Induction Furnace/InductionStop.ogg";
    },
	
	renderModel: MachineRegistry.renderModelWithRotation,
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.inductionFurnace);

StorageInterface.createInterface(BlockID.inductionFurnace, {
	slots: {
		"slotSource1": {input: true},
		"slotSource2": {input: true},
		"slotResult1": {output: true},
		"slotResult2": {output: true}
	},
	isValidInput: function(item){
		return Recipes.getFurnaceRecipeResult(item.id, "iron")? true : false;
	}
});
