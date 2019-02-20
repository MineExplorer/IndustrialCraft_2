IDRegistry.genBlockID("solidHeatGenerator");
Block.createBlock("solidHeatGenerator", [
	{name: "Solid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.solidHeatGenerator, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.solidHeatGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.solidHeatGenerator, 6, [["machine_bottom", 0], ["machine_top", 0], ["generator", 1], ["heat_pipe", 1], ["heat_generator_side", 1], ["heat_generator_side", 1]]);

Block.registerDropFunction("solidHeatGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.solidHeatGenerator);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.solidHeatGenerator, count: 1, data: 0}, [
		"a",
		"x",
		"f"
	], ['a', ItemID.heatConductor, 0, 'x', BlockID.machineBlockBasic, 0, 'f', 61, -1]);
	
	Recipes.addShaped({id: BlockID.solidHeatGenerator, count: 1, data: 0}, [
		" a ",
		"ppp",
		" f "
	], ['a', ItemID.heatConductor, 0,'p', ItemID.plateIron, 0,'f', BlockID.ironFurnace, 0]);
});

var guiSolidHeatGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Solid Fuel Firebox"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 450, y: 160, bitmap: "fire_background", scale: GUI_SCALE},
		{type: "bitmap", x: 521, y: 212, bitmap: "shovel_image", scale: GUI_SCALE+1},
		{type: "bitmap", x: 441, y: 330, bitmap: "black_line", scale: GUI_SCALE}
	],
	
	elements: {
		"slotFuel": {type: "slot", x: 441, y: 212},
		"slotAshes": {type: "slot", x: 591, y: 212, isValid: function(){return false;}},
		"burningScale": {type: "scale", x: 450, y: 160, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", font: {size: 24, color: android.graphics.Color.rgb(87, 196, 218)}, x: 500, y: 344, width: 300, height: 30, text: "0    /"},
		"textInfo2": {type: "text", font: {size: 24, color: android.graphics.Color.rgb(87, 196, 218)}, x: 600, y: 344, width: 300, height: 30, text: "20"}
	}
});



MachineRegistry.registerPrototype(BlockID.solidHeatGenerator, {
	defaultValues:{
		meta: 0,
		burn: 0,
		burnMax: 0,
		maxOutput:20,
		isActive: false
	},
	
	getGuiScreen: function(){
       return guiSolidHeatGenerator;
    },
	
	getTransportSlots: function(){
		return {input: ["slotFuel"], output:["slotAshes"]};
	},
	
	wrenchClick: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			this.data.meta = coords.side + (coords.side%2)*(-2) + 1;
		}else{
			this.data.meta = coords.side;
		}
		TileRenderer.mapAtCoords(this.x, this.y, this.z, BlockID.solidHeatGenerator, this.data.meta + 6*this.data.isActive);
	},
	
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
		if(TE && TE.heatReceiveFunction && this.data.meta == TE.data.meta + (TE.data.meta%2)*(-2) + 1){
			return this.data.output = TE.heatReceiveFunction(20);
		}
		return false;
	},
	
    tick: function(){
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
	
	hasFullRotation: true,
}, true);

TileRenderer.setRotationPlaceFunction(BlockID.solidHeatGenerator, true);
