IDRegistry.genBlockID("canner");
Block.createBlock("canner", [
	{name: "Fluid/Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.canner, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.canner, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerRotationModel(BlockID.canner, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 1], ["canner_side", 1], ["canner_side", 0]]);

ItemName.addTierTooltip("canner", 1);

Block.registerDropFunction("canner", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.canner, count: 1, data: 0}, [
		"c#c",
		"cxc",
	], ['#', BlockID.conserver, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.cellEmpty, 0]);
	
	MachineRecipeRegistry.registerRecipesFor("fluidCanner", [
		{input: ["water", {id: ItemID.bioChaff, count: 1}], output: "biomass"},
		{input: ["water", {id: ItemID.dustLapis, count: 1}], output: "coolant"}
	]);
});


var guiCanner = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Fluid/Solid Canning Machine")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 562, y: 50 + 12*GUI_SCALE, bitmap: "canner_background_top", scale: GUI_SCALE},
		{type: "bitmap", x: 566, y: 50 + 12*GUI_SCALE, bitmap: "canner_background", scale: GUI_SCALE},
		{type: "bitmap", x: 406, y: 50 + 58*GUI_SCALE, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 67*GUI_SCALE, y: 50 + 18*GUI_SCALE, bitmap: "extractor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 502, y: 174, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 752, y: 174, bitmap: "liquid_bar", scale: GUI_SCALE}
	],

	elements: {
		"background": {type: "image", x: 566, y: 50 + 39*GUI_SCALE, bitmap: "canner_arrows_0", scale: GUI_SCALE},
		"liquidInputScale": {type: "scale", x: 502 + 4*GUI_SCALE, y: 174 + 4*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"liquidOutputScale": {type: "scale", x: 752 + 4*GUI_SCALE, y: 174 + 4*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"progressScale": {type: "scale", x: 400 + 67*GUI_SCALE, y: 50 + 18*GUI_SCALE, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 406, y: 50 + 58*GUI_SCALE, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400, y: 290, size: 58, isValid: MachineRegistry.isValidEUStorage},
		"slotSource": {type: "slot", x: 630, y: 174, size: 58, visual: false, bitmap: "canner_slot_source_0",
			isValid: function(id, count, data, container){
				return isValidCannerSource(id, data, container.tileEntity);
			}
		},
		"slotCan": {type: "slot", x: 506, y: 50 + 12*GUI_SCALE, size: 58, 
			isValid: function(id, count, data, container){
				return isValidCannerCan(id, data, container.tileEntity);
			}
		},
		"slotResult": {type: "slot", x: 755, y: 50 + 12*GUI_SCALE, size: 58, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 861, y: 113, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 861, y: 172, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 861, y: 231, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 861, y: 290, isValid: UpgradeAPI.isValidUpgrade},
		"buttonSwitch": {type: "button", x: 624, y: 242, bitmap: "canner_switch_button", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				if(tile.data.progress == 0){
					var liquidData = tile.inputTank.data;
					tile.inputTank.data = tile.outputTank.data;
					tile.outputTank.data = liquidData;
				}
			}
		}},
		"buttonMode": {type: "button", x: 573, y: 290, bitmap: "canner_mode_0", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				if(tile.data.progress == 0){
					tile.data.mode = (tile.data.mode + 1) % 4;
					tile.updateUI();
				}
			}
		}}
	}
});

function isValidCannerSource(id, data, tile){
	if(tile.data.mode == 0 && MachineRecipeRegistry.hasRecipeFor("solidCanner", id)){
		return true;
	}
	if(tile.data.mode == 3){
		var recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
		for(var i in recipes){
			if(recipes[i].input[1].id == id) return true;
		}
	}
	return false;
}

function isValidCannerCan(id, data, tile){
	if(tile.data.mode == 0){
		var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
		for(var i in recipes){
			if(recipes[i].storage[0] == id) return true;
		}
	}
	if(tile.data.mode == 1 || tile.data.mode == 3){
		return LiquidLib.getEmptyItem(id, data) ? true : false;
	}
	if(tile.data.mode == 2){
		return LiquidRegistry.getFullItem(id, data, "water") ? true : false;
	}
	return false;
}

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiCanner, "Fluid/Solid Canning Machine");
});


MachineRegistry.registerElectricMachine(BlockID.canner, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 1600,
		energy_consumption: 1,
		work_time: 200,
		meta: 0,
		progress: 0,
		mode: 0,
		isActive: false
	},

	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector", "fluidPulling"],

	getGuiScreen: function(){
		return guiCanner;
	},
	
	getTier: function(){
		return this.data.power_tier;
	},
	
	resetValues: function(){
		this.data.power_tier = this.defaultValues.power_tier;
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
		if(this.data.mode%3 > 0) this.data.work_time /= 5;
	},
	
	updateUI: function(){
		var content = this.container.getGuiContent();
		if(content){
			this.updateElement(content.elements.buttonMode, "canner_mode_" + this.data.mode);
			this.updateElement(content.elements.background, "canner_arrows_" + this.data.mode);
			var element = content.elements.slotSource;
			var texture = "canner_slot_source_" + this.data.mode;
			if(element.bitmap != texture){
				element.bitmap = texture;
				element.visual = this.data.mode%3 > 0;
			}
		}
	},
	
	updateElement: function(element, bitmap){
		if(element.bitmap != bitmap){
			element.bitmap = bitmap;
		}
	},
	
	init: function(){
		this.inputTank = new LiquidTank(this, "input", 8);
		this.outputTank = new LiquidTank(this, "output", 8);
		this.renderModel();
	},
	
	tick: function(){
		this.updateUI();
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var resultSlot = this.container.getSlot("slotResult");
		var canSlot = this.container.getSlot("slotCan");
		
		var newActive = false;
		switch(this.data.mode){
		case 0:
			var recipe = MachineRecipeRegistry.getRecipeResult("solidCanner", sourceSlot.id);
			if(recipe && canSlot.id == recipe.storage[0] && canSlot.count >= recipe.storage[1] && (resultSlot.id == recipe.result[0] && resultSlot.data == recipe.result[2] && resultSlot.count <= 64 - recipe.result[1] || resultSlot.id == 0)){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
				}
				if(this.data.progress.toFixed(3) >= 1){
					canSlot.count -= recipe.storage[1];
					sourceSlot.count--;
					resultSlot.id = recipe.result[0];
					resultSlot.data = recipe.result[2];
					resultSlot.count += recipe.result[1];
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
		break;
		case 1:
			var liquid = this.outputTank.getLiquidStored();
			var empty = LiquidLib.getEmptyItem(canSlot.id, canSlot.data);
			if(empty && (!liquid || empty.liquid == liquid) && this.outputTank.getAmount() <= 8 - empty.amount){
				if(this.data.energy >= this.data.energy_consumption && (resultSlot.id == empty.id && resultSlot.data == empty.data && resultSlot.count < Item.getMaxStack(empty.id) || resultSlot.id == 0)){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
				}
				if(this.data.progress.toFixed(3) >= 1){
					this.outputTank.addLiquid(empty.liquid, empty.amount);
					canSlot.count--;
					resultSlot.id = empty.id;
					resultSlot.data = empty.data;
					resultSlot.count++;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
		break;
		case 2:
			var resetProgress = true;
			var liquid = this.inputTank.getLiquidStored();
			if(liquid){
				var full = LiquidLib.getFullItem(canSlot.id, canSlot.data, liquid);
				if(full && this.inputTank.getAmount() >= full.storage){
					resetProgress = false;
					if(this.data.energy >= this.data.energy_consumption && (resultSlot.id == full.id && resultSlot.data == full.data && resultSlot.count < Item.getMaxStack(full.id) || resultSlot.id == 0)){
						this.data.energy -= this.data.energy_consumption;
						this.data.progress += 1/this.data.work_time;
						newActive = true;
					}
					if(this.data.progress.toFixed(3) >= 1){
						this.inputTank.getLiquid(liquid, full.storage);
						canSlot.count--;
						resultSlot.id = full.id;
						resultSlot.data = full.data;
						resultSlot.count++;
						this.container.validateAll();
						this.data.progress = 0;
					}
				}
			}
			if(resetProgress){
				this.data.progress = 0;
			}
		break;
		case 3:
			var recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
			var resetProgress = true;
			for(var i in recipes){
				var recipe = recipes[i];
				var liquid = recipe.input[0];
				var source = recipe.input[1];
				if(this.inputTank.getAmount(liquid) >= 1 && source.id == sourceSlot.id && source.count <= sourceSlot.count){
					resetProgress = false;
					var outputLiquid = this.outputTank.getLiquidStored()
					if((!outputLiquid || recipe.output == outputLiquid && this.outputTank.getAmount() <= 7) && this.data.energy >= this.data.energy_consumption){
						this.data.energy -= this.data.energy_consumption;
						this.data.progress += 1/this.data.work_time;
						newActive = true;
					}
					if(this.data.progress.toFixed(3) >= 1){
						this.inputTank.getLiquid(1);
						sourceSlot.count -= source.count;
						this.outputTank.addLiquid(recipe.output, 1);
						this.container.validateAll();
						this.data.progress = 0;
					}
					break;
				}
			}
			if(resetProgress){
				this.data.progress = 0;
			}
		break;
		}
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.inputTank.updateUiScale("liquidInputScale");
		this.outputTank.updateUiScale("liquidOutputScale");
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},

	renderModel: MachineRegistry.renderModelWithRotation,
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.canner);

StorageInterface.createInterface(BlockID.canner, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item, side, tileEntity){
				return isValidCannerSource(item.id, item.data, tileEntity);
			}
		},
		"slotCan": {input: true,
			isValid: function(item, side, tileEntity){
				return isValidCannerCan(item.id, item.data, tileEntity);
			}
		},
		"slotResult": {output: true}
	},
	canReceiveLiquid: function(liquid, side){ return true; },
	canTransportLiquid: function(liquid, side){ return true; },
	addLiquid: function(liquid, amount){
		return this.tileEntity.inputTank.addLiquid(liquid, amount);
	},
	getLiquid: function(liquid, amount){
		return this.tileEntity.outputTank.getLiquid(liquid, amount);
	},
	getLiquidStored: function(mode){
		if(mode == "input") return this.tileEntity.inputTank.getLiquidStored();
		return this.tileEntity.outputTank.getLiquidStored();
	}
});