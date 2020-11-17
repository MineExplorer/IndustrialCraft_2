/// <reference path="./TileEntityBatteryBlock.ts" />

IDRegistry.genBlockID("storageCESU");
Block.createBlock("storageCESU", [
	{name: "CESU", texture: [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.storageCESU, "stone", 1, true);

TileRenderer.setHandAndUiModel(BlockID.storageCESU, 0, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);
TileRenderer.setStandardModel(BlockID.storageCESU, 0, [["cesu_front", 0], ["cesu_back", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.setStandardModel(BlockID.storageCESU, 1, [["cesu_back", 0], ["cesu_front", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.storageCESU, 2, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);

Block.registerDropFunction("storageCESU", function(coords, blockID, blockData, level) {
	return [];
});

ItemName.addStorageBlockTooltip("storageCESU", 2, "300K");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.storageCESU, count: 1, data: 0}, [
		"bxb",
		"aaa",
		"bbb"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.plateBronze, 0]);
});


var guiCESU = new UI.StandartWindow({
	standard: {
		header: {text: {text: Translation.translate("CESU")}},
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
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "300000"}
	}
});

Callback.addCallback("LevelLoaded", function() {
	MachineRegistry.updateGuiHeader(guiCESU, "CESU");
});

class TileEntityCESU extends TileEntityBatteryBlock {
	constructor() {
		super(2, 300000, BlockID.storageCESU, guiCESU);
	}
}

MachineRegistry.registerPrototype(BlockID.storageCESU, new TileEntityCESU());

MachineRegistry.setStoragePlaceFunction("storageCESU", true);

StorageInterface.createInterface(BlockID.storageCESU, BatteryBlockInterface);