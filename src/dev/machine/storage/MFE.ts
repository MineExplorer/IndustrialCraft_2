/// <reference path="./BatteryBlock.ts" />

IDRegistry.genBlockID("storageMFE");
Block.createBlock("storageMFE", [
	{name: "MFE", texture: [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.storageMFE, "stone", 1, true);

TileRenderer.setHandAndUiModel(BlockID.storageMFE, 0, [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]]);
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

const guiMFE = BatteryBlockWindow("MFE");

namespace Machine {
	class MFE extends BatteryBlock {
		constructor() {
			super(3, 4000000, BlockID.machineBlockBasic, guiMFE);
		}
	}

	MachineRegistry.registerPrototype(BlockID.storageMFE, new MFE());
	MachineRegistry.setStoragePlaceFunction("storageMFE", true);

	StorageInterface.createInterface(BlockID.storageMFE, BatteryBlockInterface);
}