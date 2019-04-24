IDRegistry.genBlockID("storageBatBox");
Block.createBlock("storageBatBox", [
	{name: "BatBox", texture: [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.storageBatBox, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 0, [["batbox_front", 0], ["batbox_back", 0], ["batbox_top", 0], ["batbox_bottom", 0], ["batbox_side", 1], ["batbox_side", 2]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 1, [["batbox_back", 0], ["batbox_front", 0], ["batbox_top", 0], ["batbox_bottom", 0], ["batbox_side", 1], ["batbox_side", 2]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 2, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_front", 0], ["batbox_back", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 3, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 4, [["batbox_bottom", 0], ["batbox_top", 1], ["batbox_side", 0], ["batbox_side", 0], ["batbox_front", 0], ["batbox_back", 0]]);
TileRenderer.registerRenderModel(BlockID.storageBatBox, 5, [["batbox_bottom", 0], ["batbox_top", 1], ["batbox_side", 0], ["batbox_side", 0], ["batbox_back", 0], ["batbox_front", 0]]);

Block.registerDropFunction("storageBatBox", function(coords, blockID, blockData, level){
	MachineRegistry.getMachineDrop(coords, blockID, level);
	return [];
});

NameOverrides.addStorageBlockTooltip("storageBatBox", 1, "40K");

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.storageBatBox, count: 1, data: 0}, [
		"xax",
		"bbb",
		"xxx"
	], ['a', ItemID.cableTin1, 0, 'x', 5, -1, 'b', ItemID.storageBattery, -1]);
});


var guiBatBox = null;
Callback.addCallback("LevelLoaded", function(){
	guiBatBox = new UI.StandartWindow({
		standart: {
			header: {text: {text: Translation.translate("BatBox")}},
			inventory: {standart: true},
			background: {standart: true}
		},
		
		drawing: [
			{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
		],
		
		elements: {
			"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
			"slot1": {type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem},
			"slot2": {type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage},
			"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
			"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "40000"}
		}
	});
});


MachineRegistry.registerEUStorage(BlockID.storageBatBox, {
	defaultValues: {
		meta: 0
	},
	
	getGuiScreen: function(){
		return guiBatBox;
	},
	
	getTier: function(){
		return 1;
	},
	
	wrenchClick: function(id, count, data, coords){
		if(this.setFacing(coords)){
			EnergyNetBuilder.rebuildTileNet(this);
			return true;
		}
		return false;
	},
		
	setFacing: MachineRegistry.setFacing,
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		var tier = this.getTier();
		var TRANSFER = transferByTier[tier];
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, TRANSFER, tier);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, TRANSFER, tier);
		
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
	},
	
	getEnergyStorage: function(){
		return 40000;
	},
	
	canReceiveEnergy: function(side, type){
		return side != this.data.meta;
	},
	
	canExtractEnergy: function(side, type){
		return side == this.data.meta;
	},
	
	destroyBlock: function(coords, player){
		var extra;
		if(this.data.energy > 0){
			extra = new ItemExtraData();
			extra.putInt("Eu", this.data.energy);
		}
		nativeDropItem(coords.x, coords.y, coords.z, 0, BlockID.storageBatBox, 1, 0, extra);
	},
	
	init: MachineRegistry.updateMachine,
	destroy: function(){
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	}
});

MachineRegistry.setStoragePlaceFunction("storageBatBox", true);
ToolAPI.registerBlockMaterial(BlockID.storageBatBox, "wood");
