IDRegistry.genBlockID("pump");
Block.createBlock("pump", [
	{name: "Pump", texture: [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.pump, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerRotationModel(BlockID.pump, 0, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerRotationModel(BlockID.pump, 4, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 1], ["pump_side", 1], ["pump_side", 1]]);

NameOverrides.addTierTooltip("pump", 1);

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
				return LiquidRegistry.getFullItem(id, data, "water")? true : false;
			}
		},
		"slotLiquid2": {type: "slot", x: 400 + 125*GUI_SCALE, y: 50 + 29*GUI_SCALE, isValid: function(){return false;}},
		//"slotPipe": {type: "slot", x: 400 + 91*GUI_SCALE, y: 160 + 12*GUI_SCALE},
		"slotUpgrade1": {type: "slot", x: 880, y: 50 + 2*GUI_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade2": {type: "slot", x: 880, y: 50 + 21*GUI_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade3": {type: "slot", x: 880, y: 50 + 40*GUI_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade4": {type: "slot", x: 880, y: 50 + 59*GUI_SCALE, isValid: UpgradeAPI.isUpgrade},
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

	getGuiScreen: function(){
		return guiPump;
	},

	getTransportSlots: function(){
		return {input: ["slotLiquid1"], output: ["slotLiquid2"]};
	},
	
	addTransportedItem: function(self, item, direction){
        var slot = this.container.getSlot("slotLiquid1");
        var full = LiquidRegistry.getFullItem(item.id, item.data, "water");
        if(full && (slot.id == item.id && slot.data == item.data || slot.id == 0)){
            var maxStack = Item.getMaxStack(slot.id);
            var add = Math.min(maxStack - item.count, slot.count);
            item.count -= add;
            slot.count += add;
            slot.id = item.id;
            slot.data = item.data;
        }
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
	
	updateMachine: MachineRegistry.updateMachine,
	
	init: function(){
		this.liquidStorage.setLimit("water", 8);
		this.liquidStorage.setLimit("lava", 8);
		this.updateMachine();
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
		var scoords = ""+x+':'+y+':'+z;
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
		this.setDefaultValues();
		UpgradeAPI.executeUpgrades(this);
		
		var liquidStor = this.liquidStorage;
		var liquid = liquidStor.getLiquidStored();
		if(this.y > 0 && this.liquidStorage.getAmount(liquid) <= 7 && this.data.energy >= this.data.energy_consumption){
			if(this.data.progress == 0){
				this.data.coords = this.recursiveSearch(liquid, this.x, this.y-1, this.z, {});
			}
			if(this.data.coords){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				if(this.data.progress.toFixed(3) >= 1){
					var coords = this.data.coords;
					var block = World.getBlock(coords.x, coords.y, coords.z);
					liquid = this.getLiquidType(liquid, block);
					if(liquid && block.data == 0){
						World.setBlock(coords.x, coords.y, coords.z, 0);
						liquidStor.addLiquid(liquid, 1);
					}
					this.data.progress = 0;
				}
				this.activate();
			}else {
				this.deactivate();
			}
		}
		else {
			this.data.progress = 0;
			this.deactivate();
		}
		
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		var full = LiquidRegistry.getFullItem(slot1.id, slot1.data, liquid);
		if(full && liquidStor.getAmount(liquid) >= 1 && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id) || slot2.id == 0)){
			liquidStor.getLiquid(liquid, 1);
			slot1.count--;
			slot2.id = full.id;
			slot2.data = full.data;
			slot2.count++;
			this.container.validateAll();
		}
		
		var tier = this.getTier();
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, transferByTier[tier], tier);
		
		this.container.setScale("progressScale", this.data.progress);
		liquidStor.updateUiScale("liquidScale", liquid);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},

	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	energyReceive: MachineRegistry.basicEnergyReceiveFunc
});

TileRenderer.setRotationPlaceFunction(BlockID.pump);
