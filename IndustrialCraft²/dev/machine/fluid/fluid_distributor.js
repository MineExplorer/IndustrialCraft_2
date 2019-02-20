IDRegistry.genBlockID("fluidDistributor");
Block.createBlock("fluidDistributor", [
	{name: "Fluid Distributor", texture: [["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.fluidDistributor, [["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1]]);
TileRenderer.registerFullRotationModel(BlockID.fluidDistributor, 0, [["fluid_distributor", 1], ["fluid_distributor", 0]]);
TileRenderer.registerFullRotationModel(BlockID.fluidDistributor, 6, [["fluid_distributor", 0], ["fluid_distributor", 1]]);

Block.registerDropFunction("fluidDistributor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.fluidDistributor, count: 1, data: 0}, [
		" a ",
		" # ",
		" c "
	], ['#', BlockID.machineBlockBasic, 0, 'a', ItemID.upgradeFluidPulling, 0, 'c', ItemID.cellEmpty, 0]);
});


var guiFluidDistributor = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Fluid Distributor"}},
		inventory: {standart: true},
		background: {standart: true},
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: android.graphics.Color.rgb(179, 179, 179)},
		{type: "bitmap", x: 400 + 3*GUI_SCALE, y: 146, bitmap: "fluid_distributor_background", scale: GUI_SCALE},
	],
	
	elements: {
		"liquidScale": {type: "scale", x: 480, y: 50 + 34*GUI_SCALE, direction: 1, value: 0, bitmap: "fluid_dustributor_bar", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 47*GUI_SCALE},
		"slot2": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 66*GUI_SCALE, isValid: function(){return false;}},
		"button_switch": {type: "button", x: 400 + 112*GUI_SCALE, y: 50 + 53*GUI_SCALE, bitmap: "fluid_distributor_button", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.inverted = !tile.data.inverted;
				TileRenderer.mapAtCoords(tile.x, tile.y, tile.z, BlockID.fluidDistributor, tile.data.meta + 6*tile.data.inverted);
			}
		}},
		"text1": {type: "text", font: {size: 24, color: android.graphics.Color.rgb(87, 196, 218)}, x: 400 + 108*GUI_SCALE, y: 50+42*GUI_SCALE, width: 128, height: 48, text: "Mode:"},
		"text2": {type: "text", font: {size: 24, color: android.graphics.Color.rgb(87, 196, 218)}, x: 400 + 93*GUI_SCALE, y: 50+66*GUI_SCALE, width: 256, height: 48, text: "Distribute"},
	}
});


MachineRegistry.registerPrototype(BlockID.fluidDistributor, {
	defaultValues: {
		meta: 0,
		inverted: false
	},
	
	getGuiScreen: function(){
		return guiFluidDistributor;
	},

	init: function(){
		this.liquidStorage.setLimit(null, 1);
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta + 6*this.data.inverted);
	},

	tick: function(){
		if(this.data.inverted){
			this.container.setText("text2", "Concentrate");
		}else{
			this.container.setText("text2", "Distribute");
		}
		
		var liquidStor = this.liquidStorage;
		var liquid = liquidStor.getLiquidStored();
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		var full = LiquidRegistry.getFullItem(slot1.id, slot1.data, liquid);
		if(full && liquidStor.getAmount(liquid) >= 1 && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id) || slot2.id == 0)){
			liquidStor.getLiquid(liquid, 1);
			slot1.count--;
			slot2.id = full.id;
			slot2.data = full.data;
			slot2.count++;
			this.container.validateSlot("slot1");
		}
		
		liquid = liquidStor.getLiquidStored();
		if(liquid){
			var coords = {x: this.x, y: this.y, z: this.z};
			var output = StorageInterface.getNearestLiquidStorages(coords, this.data.meta, !this.data.inverted);
			StorageInterface.transportLiquid(liquid, 1, liquidStor, output);
		}
		
		liquidStor.updateUiScale("liquidScale", liquid);
	},

	wrenchClick: function(id, count, data, coords){
		if(Entity.getSneaking(player)){
			this.data.meta = coords.side + (coords.side%2)*(-2) + 1;
		}else{
			this.data.meta = coords.side;
		}
		TileRenderer.mapAtCoords(this.x, this.y, this.z, BlockID.fluidDistributor, this.data.meta + 6*this.data.inverted);
	},

	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	},
}, true);

TileRenderer.setRotationPlaceFunction("fluidDistributor", true);
