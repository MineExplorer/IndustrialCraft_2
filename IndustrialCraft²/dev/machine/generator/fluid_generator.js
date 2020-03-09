IDRegistry.genBlockID("semifluidGenerator");
Block.createBlock("semifluidGenerator", [
	{name: "Semifluid Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.semifluidGenerator, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]]);
TileRenderer.registerRotationModel(BlockID.semifluidGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]]);
TileRenderer.registerRotationModel(BlockID.semifluidGenerator, 4, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 1], ["semifluid_generator_side", 1], ["semifluid_generator_side", 1]]);

Block.registerDropFunction("semifluidGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.primalGenerator);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.fluidHeatGenerator, count: 1, data: 0}, [
		"pcp",
		"cxc",
		"pcp"
	], ['x', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});

MachineRecipeRegistry.registerRecipesFor("fluidFuel", {
	"biomass": {power: 8, amount: 20},
	"oil": {power: 8, amount: 10},
	"biogas": {power: 16, amount: 10},
	"ethanol": {power: 16, amount: 10},
});

var guiSemifluidGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Semifluid Generator")}},
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
				var empty = LiquidLib.getEmptyItem(id, data);
				if(!empty) return false;
				return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
			}
		},
		"slot2": {type: "slot", x: 440, y: 183, isValid: function(){return false;}},
		"slotEnergy": {type: "slot", x: 725, y: 165, isValid: function(id){return ChargeItemRegistry.isValidItem(id, "Eu", 1);}}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiSemifluidGenerator, "Semifluid Generator");
});

MachineRegistry.registerGenerator(BlockID.semifluidGenerator, {
	defaultValues: {
		meta: 0,
		fuel: 0,
		liquid: null,
		isActive: false,
	},
	
	getGuiScreen: function(){
		return guiSemifluidGenerator;
	},
	
	init: function(){
		this.liquidStorage.setLimit(null, 10);
		this.renderModel();
	},
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			var liquid = this.liquidStorage.getLiquidStored();
			return this.getLiquidFromItem(liquid, {id: id, count: count, data: data}, null, true);
		}
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		var energyStorage = this.getEnergyStorage();
		var liquid = this.liquidStorage.getLiquidStored();
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		this.getLiquidFromItem(liquid, slot1, slot2);
		
		if(this.data.fuel <= 0){
			var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", liquid);
			if(fuel && this.liquidStorage.getAmount(liquid).toFixed(3) >= fuel.amount/1000 && this.data.energy + fuel.power * fuel.amount <= energyStorage){
				this.liquidStorage.getLiquid(liquid, fuel.amount/1000);
				this.data.fuel = fuel.amount;
				this.data.liquid = liquid;
			}
		}
		if(this.data.fuel > 0){
			var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", this.data.liquid);
			this.data.energy += fuel.power;
			this.data.fuel -= fuel.amount/20;
			this.activate();
			this.startPlaySound("Generators/GeothermalLoop.ogg");
		}
		else {
			this.data.liquid = null;
			this.stopPlaySound();
			this.deactivate();
		}
    
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 1);
		
		this.liquidStorage.updateUiScale("liquidScale", liquid);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	
	renderModel: MachineRegistry.renderModelWithRotation
});

TileRenderer.setRotationPlaceFunction(BlockID.semifluidGenerator);

StorageInterface.createInterface(BlockID.semifluidGenerator, {
	slots: {
		"slot1": {input: true},
		"slot2": {output: true}
	},
	isValidInput: function(item){
		var empty = LiquidLib.getEmptyItem(item.id, item.data);
		if(!empty) return false;
		return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
	},
	canReceiveLiquid: function(liquid, side){
		return MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid)
	},
	canTransportLiquid: function(liquid, side){ return false; }
});