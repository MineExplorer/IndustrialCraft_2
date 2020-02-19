IDRegistry.genBlockID("fluidHeatGenerator");
Block.createBlock("fluidHeatGenerator", [
	{name: "Fluid Heat Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_front", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.fluidHeatGenerator, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_front", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 0, [["heat_pipe", 0], ["fluid_heat_generator_front", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 1, [["fluid_heat_generator_front", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.registerRotationModel(BlockID.fluidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_front", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 6, [["heat_pipe", 1], ["fluid_heat_generator_front", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 7, [["fluid_heat_generator_front", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRotationModel(BlockID.fluidHeatGenerator, 8, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_front", 1], ["heat_pipe", 1], ["fluid_heat_generator_side", 1], ["fluid_heat_generator_side", 1]]);

Block.registerDropFunction("fluidHeatGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.fluidHeatGenerator, count: 1, data: 0}, [
		"pcp",
		"cxp",
		"pcp"
	], ['x', ItemID.heatConductor, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});


var guiFluidHeatGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Fluid Heat Generator")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 450, y: 160, bitmap: "fire_background", scale: GUI_SCALE},
		{type: "bitmap", x: 521, y: 212, bitmap: "shovel_image", scale: GUI_SCALE+1},
		{type: "bitmap", x: 441, y: 330, bitmap: "black_line", scale: GUI_SCALE}
	],
	
	elements: {
		"slotFuel": {type: "slot", x: 441, y: 212, isValid: function(id, count, data){
			return Recipes.getFuelBurnDuration(id, data) > 0;
		}},
		"slotAshes": {type: "slot", x: 591, y: 212, isValid: function(){return false;}},
		"burningScale": {type: "scale", x: 450, y: 160, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 500, y: 344, width: 300, height: 30, text: "0    /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 600, y: 344, width: 300, height: 30, text: "20"}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiFluidHeatGenerator, "Fluid Heat Generator");
});

MachineRegistry.registerPrototype(BlockID.fluidHeatGenerator, {
	defaultValues:{
		meta: 0,
		burn: 0,
		burnMax: 0,
		maxOutput:20,
		isActive: false
	},
	
	getGuiScreen: function(){
       return guiFluidHeatGenerator;
    },
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	getFuel: function(fuelSlot){
		if(fuelSlot.id > 0){
			var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
			if(burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)){
				return burn;
			}
		}
		return 0;
	},
	
	spreadHeat: function(){
		var coords = StorageInterface.getRelativeCoords(this, this.data.meta);
		var TE = World.getTileEntity(coords.x, coords.y, coords.z);
		if(TE && TE.heatReceive && this.data.meta == TE.data.meta + Math.pow(-1, TE.data.meta)){
			return this.data.output = TE.heatReceive(20);
		}
		return false;
	},
	
    tick: function(){
		StorageInterface.checkHoppers(this);
		
		this.data.output = 0;
		var slot = this.container.getSlot("slotAshes");
		if(this.data.burn <= 0){
			var fuelSlot = this.container.getSlot("slotFuel");
			var burn = this.getFuel(fuelSlot) / 4;
			if(burn && ((slot.id == ItemID.ashes && slot.count < 64) || slot.id==0) && this.spreadHeat()){
				this.activate();
				this.data.burnMax = burn;
				this.data.burn = burn - 1;
				fuelSlot.count--;
				if(fuelSlot.count <= 0) fuelSlot.id = 0;
			}else{
				this.deactivate();
			}
		}
		else{
			this.data.burn--;
			if(this.data.burn==0 && Math.random() < 0.5){
				slot.id = ItemID.ashes;
				slot.count++;
			}
			this.spreadHeat();
		}
		
		this.container.setText("textInfo1", this.data.output + "    /");
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
    },
	
	renderModel: MachineRegistry.renderModelWith6Sides,
});

TileRenderer.setRotationPlaceFunction(BlockID.fluidHeatGenerator, true);

StorageInterface.createInterface(BlockID.fluidHeatGenerator, {
	slots: {
		"slotFuel": {input: true},
		"slotAshes": {output: true}
	},
	isValidInput: function(item){
		return Recipes.getFuelBurnDuration(item.id, item.data) > 0;
	}
});