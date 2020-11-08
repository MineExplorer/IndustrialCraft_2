/// <reference path="./TileEntityBatteryBlock.ts" />

IDRegistry.genBlockID("storageMFE");
Block.createBlock("storageMFE", [
	{name: "MFE", texture: [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.storageMFE, "stone", 1, true);

TileRenderer.setStandardModel(BlockID.storageMFE, 0, [["mfe_front", 0], ["mfe_back", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.setStandardModel(BlockID.storageMFE, 1, [["mfe_back", 0], ["mfe_front", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.storageMFE, 2, [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]]);

Block.registerDropFunction("storageMFE", function(coords, blockID, blockData, level) {
	return [];
});

ItemName.addStorageBlockTooltip("storageMFE", 3, "4M");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.storageMFE, count: 1, data: 0}, [
		"bab",
		"axa",
		"bab"
	], ['x', BlockID.machineBlockBasic, 0, 'a', ItemID.storageCrystal, -1, 'b', ItemID.cableGold2, -1]);
});


var guiMFE = new UI.StandartWindow({
	standard: {
		header: {text: {text: Translation.translate("MFE")}},
		inventory: {standard: true},
		background: {standard: true}
	},

	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
	],

	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "4000000"}
	}
});

Callback.addCallback("LevelLoaded", function() {
	MachineRegistry.updateGuiHeader(guiMFE, "MFE");
});

class TileEntityMFE extends TileEntityBatteryBlock {
	constructor() {
		super(3, 4000000, BlockID.machineBlockBasic, guiMFE);
	}
}

MachineRegistry.registerPrototype(BlockID.storageMFE, new TileEntityMFE());

MachineRegistry.setStoragePlaceFunction("storageMFE", true);

StorageInterface.createInterface(BlockID.storageMFE, BatteryBlockInterface);