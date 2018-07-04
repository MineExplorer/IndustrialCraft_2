IDRegistry.genBlockID("pump");
Block.createBlockWithRotation("pump", [
	{name: "Pump", texture: [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], inCreative: true}
], "opaque");
MachineRenderer.setStandartModel(BlockID.pump, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], true);
MachineRenderer.registerRenderModel(BlockID.pump, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 1], ["pump_side", 1], ["pump_side", 1]], true);

Block.registerDropFunction("pump", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.pump, count: 1, data: 0}, [
		"cxc",
		"c#c",
		"bab"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'a', ItemID.treetap, 0, 'b', BlockID.miningPipe, 0, 'c', ItemID.cellEmpty, 0]);
});


var guiPump = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Pump"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 502, y: 149, bitmap: "extractor_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 416, y: 127, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 611, y: 88, bitmap: "liquid_bar", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 684, y: 152, bitmap: "pump_arrow", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 502, y: 149, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 416, y: 127, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"liquidScale": {type: "scale", x: 400 + 70*GUI_BAR_STANDART_SCALE, y: 50 + 16*GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_BAR_STANDART_SCALE},
		"slotEnergy": {type: "slot", x: 400 + 3*GUI_BAR_STANDART_SCALE, y: 50 + 39*GUI_BAR_STANDART_SCALE, isValid: function(id){return ChargeItemRegistry.isValidStorage(id, "Eu", 0);}},
		"slotLiquid1": {type: "slot", x: 400 + 94*GUI_BAR_STANDART_SCALE, y: 50 + 12*GUI_BAR_STANDART_SCALE},
		"slotLiquid2": {type: "slot", x: 400 + 128*GUI_BAR_STANDART_SCALE, y: 50 + 29*GUI_BAR_STANDART_SCALE},
		"slotUpgrade1": {type: "slot", x: 880, y: 50 + 4*GUI_BAR_STANDART_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade2": {type: "slot", x: 880, y: 50 + 22*GUI_BAR_STANDART_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade3": {type: "slot", x: 880, y: 50 + 40*GUI_BAR_STANDART_SCALE, isValid: UpgradeAPI.isUpgrade},
		"slotUpgrade4": {type: "slot", x: 880, y: 50 + 58*GUI_BAR_STANDART_SCALE, isValid: UpgradeAPI.isUpgrade},
	}
});


MachineRegistry.registerPrototype(BlockID.pump, {
	defaultValues: {
		energy_storage: 200,
		energy_consumption: 1,
		work_time: 20,
		progress: 0,
		isActive: false
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
			//if(item.count == maxStack) return true;
		}
	},
	
	getGuiScreen: function(){
		return guiPump;
	},
		
	getTransportSlots: function(){
		return {input: ["slotLiquid1"], output: ["slotLiquid2"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	init: function(){
		this.liquidStorage.setLimit("water", 8);
		this.liquidStorage.setLimit("lava", 8);
		if(this.data.isActive){
			var block = World.getBlock(this.x, this.y, this.z);
			MachineRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
		}
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeUpgrades(this);
		
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		var full = LiquidRegistry.getFullItem(slot1.id, slot1.data, "water");
		if(full && this.liquidStorage.getAmount("water") >= 1 && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id, full.data) || slot2.id == 0)){
			this.liquidStorage.getLiquid("water", 1);
			slot1.count--;
			slot2.id = full.id;
			slot2.data = full.data;
			slot2.count++;
			this.container.validateAll();
		}
		
		var block = World.getBlock(this.x, this.y-1, this.z);
		if((block.id == 8 || block.id == 9) && block.data == 0 && this.liquidStorage.getAmount("water") <= 7){
			if(this.data.energy >= this.data.energy_consumption){
				this.data.energy -= this.data.energy_consumption;
				this.data.progress += 1/this.data.work_time;
				this.activate();
			}
			else{
				this.deactivate();
			}
			if(this.data.progress >= 1){
				World.setBlock(this.x, this.y-1, this.z, 0);
				this.liquidStorage.addLiquid("water", 1);
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
		this.liquidStorage.updateUiScale("liquidScale", "water");
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    
    getEnergyStorage: function(){
        return this.data.energy_storage;
    },
    
	activate: MachineRegistry.activateMachine,
	deactivate: MachineRegistry.deactivateMachine,
	destroy: this.deactivate,
    energyTick: MachineRegistry.basicEnergyReceiveFunc
});