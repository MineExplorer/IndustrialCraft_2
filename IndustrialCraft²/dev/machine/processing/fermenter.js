IDRegistry.genBlockID("icFermenter");
Block.createBlock("icFermenter", [
	{name: "icFermenter", texture: [["machine_bottom", 0], ["machine_top", 0], ["fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], inCreative: true},
], "opaque");
TileRenderer.setStandartModel(BlockID.icFermenter, [["machine_bottom", 0], ["machine_top", 0], ["fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.icFermenter, 6, [["machine_bottom", 0], ["machine_top", 1], ["fermenter_back", 0], ["heat_pipe", 1], ["ic_fermenter_side", 1], ["ic_fermenter_side", 1]]);

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
		"progressScale": {type: "scale", x: 492, y: 150, direction: 0, value: .5, bitmap: "red_line", scale: GUI_SCALE},
		"fertilizerScale": {type: "scale", x: 480, y: 301, direction: 0, value: .5, bitmap: "fertilizer_progress", scale: GUI_SCALE},
		"biogasScale": {type: "scale", x: 771, y: 108, direction: 1, value: .5, bitmap: "liquid_biogas", scale: GUI_SCALE},
		"biomassScale": {type: "scale", x: 483, y: 179, direction: 1, value: .5, bitmap: "biomass_scale", scale: GUI_SCALE},
		"slotBiomass0": {type: "slot", x: 400, y: 162, isValid: function(id, count, data){
            return LiquidRegistry.getItemLiquid(id, data) == "biomass";
        }},
		"slotBiomass1": {type: "slot", x: 400, y: 222, isValid: function(){return false;}},
		"slotFertilizer": {type: "slot", x: 634, y: 282, bitmap: "fertilizer_slot", isValid: function(){return false;}},
		"slotBiogas0": {type: "slot", x: 832, y: 155, isValid: function(id, count, data){
            return LiquidRegistry.getFullItem(id, data, "biogas") ? true : false;
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
		progress: 0,
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
	
    tick: function(){
		StorageInterface.checkHoppers(this);
		UpgradeAPI.executeUpgrades(this);
    },
	
	heatReceive: function(amount){
		return 0;
	},
	
	renderModel: MachineRegistry.renderModelWith6Sides,
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
	canTransportLiquid: function(liquid, side){ return true }
});
