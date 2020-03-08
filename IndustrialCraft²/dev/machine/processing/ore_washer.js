IDRegistry.genBlockID("oreWasher");
Block.createBlock("oreWasher", [
	{name: "Ore Washing Plant", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.oreWasher, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerRotationModel(BlockID.oreWasher, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerRotationModel(BlockID.oreWasher, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 1], ["ore_washer_side", 1], ["ore_washer_side", 1]]);

ItemName.addTierTooltip("oreWasher", 1);

Block.registerDropFunction("oreWasher", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.oreWasher, count: 1, data: 0}, [
		"aaa",
		"b#b",
		"xcx"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 325, 0, 'c', ItemID.circuitBasic, 0]);
	
	
	MachineRecipeRegistry.registerRecipesFor("oreWasher", {
		"ItemID.crushedCopper": [ItemID.crushedPurifiedCopper, 1, ItemID.dustSmallCopper, 2, ItemID.dustStone, 1],
		"ItemID.crushedTin": [ItemID.crushedPurifiedTin, 1, ItemID.dustSmallTin, 2, ItemID.dustStone, 1],
		"ItemID.crushedIron": [ItemID.crushedPurifiedIron, 1, ItemID.dustSmallIron, 2, ItemID.dustStone, 1],
		"ItemID.crushedGold": [ItemID.crushedPurifiedGold, 1, ItemID.dustSmallGold, 2, ItemID.dustStone, 1],
		"ItemID.crushedSilver": [ItemID.crushedPurifiedSilver, 1, ItemID.dustSmallSilver, 2, ItemID.dustStone, 1],
		"ItemID.crushedLead": [ItemID.crushedPurifiedLead, 1, ItemID.dustSmallSulfur, 3, ItemID.dustStone, 1],
		"ItemID.crushedUranium": [ItemID.crushedPurifiedUranium, 1, ItemID.dustSmallLead, 2, ItemID.dustStone, 1],
		//13: [318, 1, ItemID.dustStone, 1]
	}, true);
});


var guiOreWasher = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Ore Washing Plant")}},
		inventory: {standart: true},
		background: {standart: true},
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400, y: 50, bitmap: "ore_washer_background", scale: GUI_SCALE},
		{type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 400 + 98*GUI_SCALE, y: 50 + 35*GUI_SCALE, direction: 0, value: 0.5, bitmap: "ore_washer_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 416, y: 178, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 592, y: 50 + 21*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: MachineRegistry.isValidEUStorage},
		"slotLiquid1": {type: "slot", x: 400 + 33*GUI_SCALE, y: 50 + 12*GUI_SCALE,
			isValid: function(id, count, data){
				return LiquidLib.getItemLiquid(id, data) == "water";
			}
		},
		"slotLiquid2": {type: "slot", x: 400 + 33*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: function(){return false;}},
		"slotSource": {type: "slot", x: 400 + 99*GUI_SCALE, y: 50 + 12*GUI_SCALE,
			isValid: function(id, count, data){
				return MachineRecipeRegistry.hasRecipeFor("oreWasher", id, data);
			}
		},
		"slotResult1": {type: "slot", x: 400 + 80*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: function(){return false;}},
		"slotResult2": {type: "slot", x: 400 + 99*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: function(){return false;}},
		"slotResult3": {type: "slot", x: 400 + 118*GUI_SCALE, y: 50 + 58*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 870, y: 50 + GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 870, y: 50 + 20*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 870, y: 50 + 39*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 870, y: 50 + 58*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiOreWasher, "Ore Washing Plant");
});

MachineRegistry.registerElectricMachine(BlockID.oreWasher, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 10000,
		energy_consumption: 16,
		work_time: 500,
		meta: 0,
		progress: 0,
		isActive: false
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidPulling"],
	
	getGuiScreen: function(){
		return guiOreWasher;
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
	
	renderModel: MachineRegistry.renderModelWithRotation,
	
	init: function(){
		this.liquidStorage.setLimit("water", 8);
		this.renderModel();
	},

	checkResult: function(result){
		for(var i = 1; i < 4; i++){
			var id = result[(i-1)*2];
			var count = result[(i-1)*2+1];
			var resultSlot = this.container.getSlot("slotResult"+i);
			if((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0){
				return false;
			}
		}
		return true;
	},

	putResult: function(result){
		this.liquidStorage.getLiquid("water", 1);
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
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			return this.getLiquidFromItem("water", {id: id, count: count, data: data}, null, true);
		}
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		this.getLiquidFromItem("water", slot1, slot2);
		
		var newActive = false;
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("oreWasher", sourceSlot.id);
		if(result && this.checkResult(result) && this.liquidStorage.getAmount("water") >= 1){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				newActive = true;
			}
			if(this.data.progress.toFixed(3) >= 1){
				sourceSlot.count--;
				this.putResult(result);
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
		}
		this.setActive(newActive);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.liquidStorage.updateUiScale("liquidScale", "water");
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.oreWasher);

StorageInterface.createInterface(BlockID.oreWasher, {
	slots: {
		"slotSource": {input: true,
			isValid: function(item){
				return MachineRecipeRegistry.hasRecipeFor("oreWasher", item.id, item.data);
			}
		},
		"slotLiquid1": {input: true, 
			isValid: function(item){
				return LiquidLib.getItemLiquid(item.id, item.data) == "water";
			}
		},
		"slotLiquid2": {output: true},
		"slotResult1": {output: true},
		"slotResult2": {output: true},
		"slotResult3": {output: true}
	},
	canReceiveLiquid: function(liquid, side){ return liquid == "water"; },
	canTransportLiquid: function(liquid, side){ return false; }
});
