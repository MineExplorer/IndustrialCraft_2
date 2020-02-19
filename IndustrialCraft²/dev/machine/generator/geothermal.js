IDRegistry.genBlockID("geothermalGenerator");
Block.createBlock("geothermalGenerator", [
	{name: "Geothermal Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.geothermalGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.geothermalGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerRotationModel(BlockID.geothermalGenerator, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 1], ["machine_side", 0], ["machine_side", 0]]);

Block.registerDropFunction("geothermalGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.geothermalGenerator, count: 1, data: 0}, [
		"xax",
		"xax",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'a', ItemID.cellEmpty, 0, 'b', ItemID.casingIron, 0, 'x', 20, -1]);
});


var guiGeothermalGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Geothermal Generator")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE}
	],
	
	elements: {
		"energyScale": {type: "scale", x: 702 + 4*GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75,
			isValid: function(id, count, data){
				var empty = LiquidRegistry.getEmptyItem(id, data);
				if(!empty) return false;
				return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
			}
		},
		"slot2": {type: "slot", x: 440, y: 183, isValid: function(){return false;}},
		"slotEnergy": {type: "slot", x: 725, y: 165, isValid: function(id){return ChargeItemRegistry.isValidItem(id, "Eu", 1);}}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiGeothermalGenerator, "Geothermal Generator");
});

MachineRegistry.registerGenerator(BlockID.geothermalGenerator, {
	defaultValues: {
		meta: 0,
		isActive: false,
	},
	
	getGuiScreen: function(){
		return guiGeothermalGenerator;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation,
	
	init: function(){
		this.liquidStorage.setLimit("lava", 8);
		this.renderModel();
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		var energyStorage = this.getEnergyStorage();
		var newActive = false;
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		var empty = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
		if(empty && empty.liquid == "lava"){
			if(this.liquidStorage.getAmount("lava").toFixed(3) <= 7 && (slot2.id == empty.id && slot2.data == empty.data && slot2.count < Item.getMaxStack(empty.id) || slot2.id == 0)){
				this.liquidStorage.addLiquid("lava", 1);
				slot1.count--;
				slot2.id = empty.id;
				slot2.data = empty.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
		if(this.liquidStorage.getAmount("lava").toFixed(3) >= 0.001 && this.data.energy + 20 <= energyStorage){
			this.data.energy += 20;
			this.liquidStorage.getLiquid("lava", 0.001);
			this.activate();
			this.startPlaySound("Generators/GeothermalLoop.ogg");
		}
		else {
			this.stopPlaySound();
			this.deactivate();
		}
		
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 32, 1);
		
		this.liquidStorage.updateUiScale("liquidScale", "lava");
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	}
});

TileRenderer.setRotationPlaceFunction(BlockID.geothermalGenerator);

StorageInterface.createInterface(BlockID.geothermalGenerator, {
	slots: {
		"slot1": {input: true},
		"slot2": {output: true}
	},
	isValidInput: function(item){
		return LiquidRegistry.getItemLiquid(item.id, item.data) == "lava";
	},
	canReceiveLiquid: function(liquid, side){ return liquid == "lava"; },
	canTransportLiquid: function(liquid, side){ return false; }
});