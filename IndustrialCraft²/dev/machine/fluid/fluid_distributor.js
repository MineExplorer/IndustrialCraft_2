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
		header: {text: {text: Translation.translate("Fluid Distributor")}},
		inventory: {standart: true},
		background: {standart: true},
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 400 + 3*GUI_SCALE, y: 146, bitmap: "fluid_distributor_background", scale: GUI_SCALE},
	],
	
	elements: {
		"liquidScale": {type: "scale", x: 480, y: 50 + 34*GUI_SCALE, direction: 1, value: 0, bitmap: "fluid_dustributor_bar", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 47*GUI_SCALE, isValid: function(id, count, data){
			return LiquidLib.getFullItem(id, data, "water")? true : false;
		}},
		"slot2": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 66*GUI_SCALE, isValid: function(){return false;}},
		"button_switch": {type: "button", x: 400 + 112*GUI_SCALE, y: 50 + 53*GUI_SCALE, bitmap: "fluid_distributor_button", scale: GUI_SCALE, clicker: {
			onClick: function(container, tile){
				tile.data.inverted = !tile.data.inverted;
				TileRenderer.mapAtCoords(tile.x, tile.y, tile.z, BlockID.fluidDistributor, tile.data.meta + 6*tile.data.inverted);
			}
		}},
		"text1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 400 + 107*GUI_SCALE, y: 50+42*GUI_SCALE, width: 128, height: 48, text: Translation.translate("Mode:")},
		"text2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 400 + 92*GUI_SCALE, y: 50+66*GUI_SCALE, width: 256, height: 48, text: Translation.translate("Distribute")},
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiFluidDistributor, "Fluid Distributor");
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
		this.renderModel();
	},
	
	addLiquidToItem: MachineRegistry.addLiquidToItem,
	
	tick: function(){
		if(this.data.inverted){
			this.container.setText("text2", Translation.translate("Concentrate"));
		}else{
			this.container.setText("text2", Translation.translate("Distribute"));
		}
		
		var storage = this.liquidStorage;
		var liquid = storage.getLiquidStored();
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		this.addLiquidToItem(liquid, slot1, slot2);
		
		liquid = storage.getLiquidStored();
		if(liquid){
			var input = StorageInterface.getNearestLiquidStorages(this, this.data.meta, !this.data.inverted);
			for(var side in input){
				StorageInterface.transportLiquid(liquid, 0.25, this, input[side], parseInt(side));
			}
		}
		
		storage.updateUiScale("liquidScale", liquid);
	},
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	renderModel: function(){
		TileRenderer.mapAtCoords(this.x, this.y, this.z, this.id, this.data.meta + 6*this.data.inverted);
	},
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	},
});

TileRenderer.setRotationPlaceFunction("fluidDistributor", true);

StorageInterface.createInterface(BlockID.fluidDistributor, {
	slots: {
		"slot1": {input: true},
		"slot2": {output: true}
	},
	isValidInput: function(item){
		return LiquidLib.getFullItem(item.id, item.data, "water")? true : false;
	},
	canReceiveLiquid: function(liquid, side){
		let data = this.tileEntity.data;
		return (side == data.meta) ^ data.inverted;
	},
	canTransportLiquid: function(liquid, side){
		return true;
	}
});