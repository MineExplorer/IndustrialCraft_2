/// <reference path="./BatteryBlock.ts" />

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


var guiCESU = BatteryBlockWindow("CESU");

namespace Machine {
	class CESU extends BatteryBlock {
		constructor() {
			super(2, 300000, BlockID.storageCESU, guiCESU);
		}
	}

	MachineRegistry.registerPrototype(BlockID.storageCESU, new CESU());
	MachineRegistry.setStoragePlaceFunction("storageCESU", true);

	StorageInterface.createInterface(BlockID.storageCESU, BatteryBlockInterface);
}