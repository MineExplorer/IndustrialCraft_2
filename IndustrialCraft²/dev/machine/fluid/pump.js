IDRegistry.genBlockID("pump");
Block.createBlock("pump", [
	{name: "Pump", texture: [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.pump, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerRotationModel(BlockID.pump, 0, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerRotationModel(BlockID.pump, 4, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 1], ["pump_side", 1], ["pump_side", 1]]);

ItemName.addTierTooltip("pump", 1);

Block.registerDropFunction("pump", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.pump, count: 1, data: 0}, [
		"cxc",
		"c#c",
		"bab"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'a', ItemID.treetap, 0, 'b', BlockID.miningPipe, 0, 'c', ItemID.cellEmpty, 0]);
});


var guiPump = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Pump")}},
		inventory: {standart: true},
		background: {standart: true}
	},

	drawing: [
		{type: "bitmap", x: 493, y: 149, bitmap: "extractor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 407, y: 127, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 602, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 675, y: 152, bitmap: "pump_arrow", scale: GUI_SCALE},
	],

	elements: {
		"progressScale": {type: "scale", x: 493, y: 149, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 407, y: 127, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 400 + 67*GUI_SCALE, y: 50 + 16*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400, y: 50 + 39*GUI_SCALE, isValid: MachineRegistry.isValidEUStorage},
		"slotLiquid1": {type: "slot", x: 400 + 91*GUI_SCALE, y: 50 + 12*GUI_SCALE,
			isValid: function(id, count, data){
				return LiquidLib.getFullItem(id, data, "water")? true : false;
			}
		},
		"slotLiquid2": {type: "slot", x: 400 + 125*GUI_SCALE, y: 50 + 29*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 880, y: 50 + 2*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 880, y: 50 + 21*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 880, y: 50 + 40*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 880, y: 50 + 59*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiPump, "Pump");
});

MachineRegistry.registerElectricMachine(BlockID.pump, {
	defaultValues: {
		power_tier: 1,
		energy_storage: 800,
		energy_consumption: 1,
		work_time: 20,
		progress: 0,
		isActive: false,
		coords: null
	},
	
	upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector"],
	
	getGuiScreen: function(){
		return guiPump;
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
	addLiquidToItem: MachineRegistry.addLiquidToItem,
	
	init: function(){
		this.liquidStorage.setLimit("water", 8);
		this.liquidStorage.setLimit("lava", 8);
		this.renderModel();
	},
	
	getLiquidType: function(liquid, block){
		if((!liquid || liquid=="water") && (block.id == 8 || block.id == 9)){
			return "water";
		}
		if((!liquid || liquid=="lava") && (block.id == 10 || block.id == 11)){
			return "lava";
		}
		return null;
	},
	
	recursiveSearch: function(liquid, x, y, z, map){
		var block = World.getBlock(x, y, z);
		var scoords = x+':'+y+':'+z;
		if(!map[scoords] && Math.abs(this.x - x) <= 64 && Math.abs(this.z - z) <= 64 && this.getLiquidType(liquid, block)){
			if(block.data == 0) return {x: x, y: y, z: z};
			map[scoords] = true;
			return this.recursiveSearch(liquid, x, y+1, z, map) ||
			this.recursiveSearch(liquid, x+1, y, z, map) ||
			this.recursiveSearch(liquid, x-1, y, z, map) ||
			this.recursiveSearch(liquid, x, y, z+1, map) ||
			this.recursiveSearch(liquid, x, y, z-1, map);
		}
		return null;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		
		var newActive = false;
		var liquid = this.liquidStorage.getLiquidStored();
		if(this.y > 0 && this.liquidStorage.getAmount(liquid) <= 7 && this.data.energy >= this.data.energy_consumption){
			if(this.data.progress == 0){
				this.data.coords = this.recursiveSearch(liquid, this.x, this.y-1, this.z, {});
			}
			if(this.data.coords){
				newActive = true;
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.startPlaySound("Machines/PumpOp.ogg");
				if(this.data.progress.toFixed(3) >= 1){
					var coords = this.data.coords;
					var block = World.getBlock(coords.x, coords.y, coords.z);
					liquid = this.getLiquidType(liquid, block);
					if(liquid && block.data == 0){
						World.setBlock(coords.x, coords.y, coords.z, 0);
						this.liquidStorage.addLiquid(liquid, 1);
					}
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		if(!newActive)
			this.stopPlaySound();
		this.setActive(newActive);
		
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		this.addLiquidToItem(liquid, slot1, slot2);
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());
		
		this.container.setScale("progressScale", this.data.progress);
		this.liquidStorage.updateUiScale("liquidScale", liquid);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.pump);

StorageInterface.createInterface(BlockID.pump, {
	slots: {
		"slotLiquid1": {input: true},
		"slotLiquid2": {output: true}
	},
	isValidInput: function(item){
		return LiquidLib.getFullItem(item.id, item.data, "water")? true : false;
	},
	canReceiveLiquid: function(liquid, side){ return false; },
	canTransportLiquid: function(liquid, side){ return true; }
});