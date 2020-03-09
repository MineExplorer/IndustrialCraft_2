IDRegistry.genBlockID("icFermenter");
Block.createBlock("icFermenter", [
	{name: "Fermenter", texture: [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.icFermenter, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.icFermenter, 6, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 1], ["heat_pipe", 1], ["ic_fermenter_side", 1], ["ic_fermenter_side", 1]]);

Block.registerDropFunction("icFermenter", function(coords, blockID, blockData, level, enchant){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.icFermenter, count: 1, data: 0}, [
		"aaa",
		"ccc",
		"axa"
	], ['c', ItemID.cellEmpty, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});


var guiFermenter = new UI.StandartWindow({
	standart: {
		header: {text: {text: Translation.translate("Fermenter")}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	params: {
		slot: "default_slot",
		invSlot: "default_slot"
	},
	
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
		{type: "bitmap", x: 390, y: 80, bitmap: "fermenter_background", scale: GUI_SCALE},
		{type: "bitmap", x: 758, y: 95, bitmap: "liquid_bar", scale: GUI_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 492, y: 150, direction: 0, value: .5, bitmap: "fermenter_progress_scale", scale: GUI_SCALE},
		"fertilizerScale": {type: "scale", x: 480, y: 301, direction: 0, value: .5, bitmap: "fertilizer_progress_scale", scale: GUI_SCALE},
		"biogasScale": {type: "scale", x: 771, y: 108, direction: 1, value: .5, bitmap: "liquid_biogas", scale: GUI_SCALE},
		"biomassScale": {type: "scale", x: 483, y: 179, direction: 1, value: .5, bitmap: "biomass_scale", scale: GUI_SCALE},
		"slotBiomass0": {type: "slot", x: 400, y: 162, isValid: function(id, count, data){
            return LiquidLib.getItemLiquid(id, data) == "biomass";
        }},
		"slotBiomass1": {type: "slot", x: 400, y: 222, isValid: function(){return false;}},
		"slotFertilizer": {type: "slot", x: 634, y: 282, bitmap: "black_border_slot", isValid: function(){return false;}},
		"slotBiogas0": {type: "slot", x: 832, y: 155, isValid: function(id, count, data){
            return LiquidLib.getFullItem(id, data, "biogas") ? true : false;
        }},
		"slotBiogas1": {type: "slot", x: 832, y: 215, isValid: function(){return false;}},
		"slotUpgrade1": {type: "slot", x: 765, y: 290, isValid: UpgradeAPI.isValidUpgrade},
		"slotUpgrade2": {type: "slot", x: 825, y: 290, isValid: UpgradeAPI.isValidUpgrade}
	}
});

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.updateGuiHeader(guiFermenter, "Fermenter");
});

MachineRegistry.registerPrototype(BlockID.icFermenter, {
	defaultValues:{
		meta: 0,
		heat: 0,
		progress: 0,
		fertilizer: 0,
		isActive: false,
	},
	
	upgrades: ["itemEjector", "itemPulling", "fluidEjector", "fluidPulling"],
	
	getGuiScreen: function(){
       return guiFermenter;
    },
	
	wrenchClick: function(id, count, data, coords){
		this.setFacing(coords);
	},
	
	setFacing: MachineRegistry.setFacing,
	
	init: function(){
		this.liquidStorage.setLimit("biomass", 10);
		this.liquidStorage.setLimit("biogas", 2);
		this.renderModel();
	},
	
	getLiquidFromItem: MachineRegistry.getLiquidFromItem,
	addLiquidToItem: MachineRegistry.addLiquidToItem,
	
	click: function(id, count, data, coords){
		var liquid = this.liquidStorage.getLiquidStored();
		if(Entity.getSneaking(player) && this.getLiquidFromItem("biogas", {id: id, count: count, data: data}, null, true)){
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
		UpgradeAPI.executeUpgrades(this);
		this.setActive(this.data.heat > 0);
		
		if(this.data.heat > 0){
			this.data.progress += this.data.heat;
			this.data.heat = 0;
			
			if(this.data.progress >= 4000){
				this.liquidStorage.getLiquid("biomass", 0.02);
				this.liquidStorage.addLiquid("biogas", 0.4);
				this.data.fertilizer++;
				this.data.progress = 0;
			}
			
			var outputSlot = this.container.getSlot("slotFertilizer");
			if(this.data.fertilizer >= 25){
				this.data.fertilizer = 0;
				outputSlot.id = ItemID.fertilizer;
				outputSlot.count++;
			}
		}
		
		var slot1 = this.container.getSlot("slotBiomass0");
		var slot2 = this.container.getSlot("slotBiomass1");
		this.getLiquidFromItem("biomass", slot1, slot2);
		
		var slot1 = this.container.getSlot("slotBiogas0");
		var slot2 = this.container.getSlot("slotBiogas1");
		this.addLiquidToItem("biogas", slot1, slot2);
		
		this.container.setScale("progressScale", this.data.progress / 4000);
		this.container.setScale("fertilizerScale", this.data.fertilizer / 25);
		this.liquidStorage.updateUiScale("biomassScale", "biomass");
		this.liquidStorage.updateUiScale("biogasScale", "biogas");
    },
	
	canReceiveHeat: function(side){
		return this.data.meta == side + Math.pow(-1, side);
	},
	
	heatReceive: function(amount){
		var outputSlot = this.container.getSlot("slotFertilizer");
		if(this.liquidStorage.getAmount("biomass").toFixed(3) >= 0.02 && this.liquidStorage.getAmount("biogas") <= 1.6 && outputSlot.count < 64){
			this.data.heat = amount;
			return amount;
		}
		return 0;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides
});

TileRenderer.setRotationPlaceFunction(BlockID.icFermenter, true);

StorageInterface.createInterface(BlockID.icFermenter, {
	slots: {
		"slotBiomass0": {input: true},
		"slotBiomass1": {output: true},
		"slotBiogas0": {input: true},
		"slotBiogas1": {output: true},
		"slotFertilizer": {output: true}
	},
	canReceiveLiquid: function(liquid, side){
		return liquid == "biomass";
	},
	canTransportLiquid: function(liquid, side){ return true; },
	getLiquidStored: function(storage){
		return storage == "input" ? "biomass" : "biogas";
	}
});
