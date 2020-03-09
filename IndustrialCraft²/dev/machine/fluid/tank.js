IDRegistry.genBlockID("tank");
Block.createBlock("tank", [
	{name: "Tank", texture: [["machine_bottom", 0], ["machine_top", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("tank", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.tank, count: 1, data: 0}, [
		" c ",
		"c#c",
		" c "
	], ['#', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0]);
});


var guiTank = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Tank")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 611, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE},
	],
	
	elements: {
		"liquidScale": {type: "scale", x: 400 + 70*GUI_SCALE, y: 50 + 16*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slotLiquid1": {type: "slot", x: 400 + 94*GUI_SCALE, y: 50 + 16*GUI_SCALE, isValid: function(id, count, data){
			return (LiquidRegistry.getFullItem(id, data, "water") || LiquidLib.getEmptyItem(id, data))? true : false;
		}},
		"slotLiquid2": {type: "slot", x: 400 + 94*GUI_SCALE, y: 50 + 40*GUI_SCALE, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 870, y: 50 + 4*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 870, y: 50 + 22*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade3": {type: "slot", x: 870, y: 50 + 40*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade4": {type: "slot", x: 870, y: 50 + 58*GUI_SCALE, isValid: UpgradeAPI.isValidUpgrade},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiTank, "Tank");
});

MachineRegistry.registerPrototype(BlockID.tank, {
	upgrades: ["fluidEjector", "fluidPulling"],
	
	getGuiScreen: function(){
		return guiTank;
	},
	
	init: function(){
		this.liquidStorage.setLimit(null, 16);
	},
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			var liquid = this.liquidStorage.getLiquidStored();
			return this.getLiquidFromItem(liquid, {id: id, count: count, data: data}, null, true);
		}
	},
	
	tick: function(){
		UpgradeAPI.executeUpgrades(this);
		
		var storage = this.liquidStorage;
		var liquid = storage.getLiquidStored();
		var slot1 = this.container.getSlot("slotLiquid1");
		var slot2 = this.container.getSlot("slotLiquid2");
		this.getLiquidFromItem(liquid, slot1, slot2);
		if(liquid){
			var full = LiquidLib.getFullItem(slot1.id, slot1.data, liquid);
			if(full && storage.getAmount(liquid) >= full.storage && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id) || slot2.id == 0)){
				storage.getLiquid(liquid, full.storage);
				slot1.count--;
				slot2.id = full.id;
				slot2.data = full.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
		storage.updateUiScale("liquidScale", storage.getLiquidStored());
	}
});

StorageInterface.createInterface(BlockID.tank, {
	slots: {
		"slotLiquid1": {input: true},
		"slotLiquid2": {output: true}
	},
	isValidInput: function(item){
		return LiquidRegistry.getFullItem(item.id, item.data, "water") || LiquidLib.getEmptyItem(item.id, item.data);
	},
	canReceiveLiquid: function(liquid, side){ return true; },
	canTransportLiquid: function(liquid, side){ return true; }
});