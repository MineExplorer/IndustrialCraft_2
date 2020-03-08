IDRegistry.genBlockID("fluidHeatGenerator");
Block.createBlock("fluidHeatGenerator", [
	{name: "Liquid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.fluidHeatGenerator, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 0, [["heat_pipe", 0], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 1, [["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.registerRotationModel(BlockID.fluidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 6, [["heat_pipe", 1], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 7, [["fluid_heat_generator_back", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRotationModel(BlockID.fluidHeatGenerator, 8, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 1], ["heat_pipe", 1], ["fluid_heat_generator_side", 1], ["fluid_heat_generator_side", 1]]);

Block.registerDropFunction("fluidHeatGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.fluidHeatGenerator, count: 1, data: 0}, [
		"pcp",
		"cxc",
		"pcp"
	], ['x', ItemID.heatConductor, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});


var guiFluidHeatGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Liquid Fuel Firebox")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE},
		{type: "bitmap", x: 660, y: 102, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE},
		{type: "bitmap", x: 660, y: 176, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE}
	],
	
	elements: {
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75,
			isValid: function(id, count, data){
				var empty = LiquidLib.getEmptyItem(id, data);
				if(!empty) return false;
				return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
			}
		},
		"slot2": {type: "slot", x: 440, y: 183, isValid: function(){return false;}},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 670, y: 112, width: 300, height: 30, text: "Emit: 0"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 670, y: 186, width: 300, height: 30, text: "Max Emit: 0"}
	}
});


Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiFluidHeatGenerator, "Liquid Fuel Firebox");
});

MachineRegistry.registerPrototype(BlockID.fluidHeatGenerator, {
	defaultValues: {
		meta: 0,
		output: 0,
		fuel: 0,
		liquid: null,
		isActive: false
	},
	
	getGuiScreen: function(){
		return guiFluidHeatGenerator;
	},
	
	setFacing: MachineRegistry.setFacing,
	
	init: function(){
		this.liquidStorage.setLimit(null, 10);
		this.renderModel();
	},
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	
	click: function(id, count, data, coords){
		var liquid = this.liquidStorage.getLiquidStored();
		if(Entity.getSneaking(player) && this.getLiquidFromItem(liquid, {id: id, count: count, data: data}, null, true)){
			return true;
		}
		if(ICTool.isValidWrench(id, data, 10)){
			if(this.setFacing(coords))
				ICTool.useWrench(id, data, 10);
			return true;
		}
		return false;
	},
	
	tick: function(){
		StorageInterface.checkHoppers(this);
		var liquid = this.liquidStorage.getLiquidStored();
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		this.getLiquidFromItem(liquid, slot1, slot2);
		
		var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", this.data.liquid || liquid);
		if(fuel && this.data.fuel <= 0 && this.liquidStorage.getAmount(liquid).toFixed(3) >= fuel.amount/1000 && this.spreadHeat(fuel.power*2)){
			this.liquidStorage.getLiquid(liquid, fuel.amount/1000);
			this.data.fuel = fuel.amount;
			this.data.liquid = liquid;
		}
		if(fuel && this.data.fuel > 0){
			if(this.data.fuel < fuel.amount){
				this.spreadHeat(fuel.power*2);
			}
			this.data.fuel -= fuel.amount/20;
			this.activate();
			this.container.setText("textInfo2", "Max Emit: " + fuel.power * 2);
			this.startPlaySound("Generators/GeothermalLoop.ogg");
		}
		else {
			this.data.liquid = null;
			this.stopPlaySound();
			this.deactivate();
			this.container.setText("textInfo1", "Emit: 0");
			this.container.setText("textInfo2", "Max Emit: 0");
		}
		
		this.liquidStorage.updateUiScale("liquidScale", liquid);
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	spreadHeat: function(heat){
		var coords = StorageInterface.getRelativeCoords(this, this.data.meta);
		var TE = World.getTileEntity(coords.x, coords.y, coords.z);
		if(TE && TE.canReceiveHeat && TE.canReceiveHeat(this.data.meta)){
			var output = TE.heatReceive(heat);
			this.container.setText("textInfo1", "Emit: " + output);
			return output;
		}
		return false;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides
});

TileRenderer.setRotationPlaceFunction(BlockID.fluidHeatGenerator, true);

StorageInterface.createInterface(BlockID.fluidHeatGenerator, {
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