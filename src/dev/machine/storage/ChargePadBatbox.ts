/// <reference path="./ChargePad.ts" />

BlockRegistry.createBlock("chargepadBatBox", [
	{name: "Charge Pad (BatBox)", texture: [["chargepad_batbox_bottom", 0], ["chargepad_batbox_top", 0], ["chargepad_batbox_back", 0], ["chargepad_batbox_front", 0], ["chargepad_batbox_side", 0], ["chargepad_batbox_side", 0]], inCreative: true}
], "wood");
Block.setDestroyTime(BlockID.chargepadBatBox, 3);
BlockRegistry.setBlockMaterial(BlockID.chargepadBatBox, "wood");

TileRenderer.setHandAndUiModel(BlockID.chargepadBatBox, 0, [["chargepad_batbox_bottom", 0], ["chargepad_batbox_top", 0], ["chargepad_batbox_back", 0], ["chargepad_batbox_front", 0], ["chargepad_batbox_side", 0], ["chargepad_batbox_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.chargepadBatBox, 2, [["chargepad_batbox_bottom", 0], ["chargepad_batbox_top", 0], ["chargepad_batbox_back", 0], ["chargepad_batbox_front", 0], ["chargepad_batbox_side", 0], ["chargepad_batbox_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.chargepadBatBox, 2, [["chargepad_batbox_bottom", 0], ["chargepad_batbox_top_active", 0], ["chargepad_batbox_back", 0], ["chargepad_batbox_front", 0], ["chargepad_batbox_side", 0], ["chargepad_batbox_side", 0]]);

ItemName.addStorageBlockTooltip("chargepadBatBox", 1, "40K", 32);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.chargepadBatBox, count: 1, data: 0}, [
		"cpc",
		"r#r"
	], ['#', BlockID.storageBatBox, -1, 'c', ItemID.circuitBasic, -1, 'p', VanillaBlockID.stone_pressure_plate, -1, 'r', ItemID.rubber, -1]);
});

namespace Machine {
    const guiChargepadBatBox = BatteryBlockWindow("Charge Pad (BatBox)");

	export class ChargePadBatbox extends ChargePad {
		constructor() {
			super(1, 40000, BlockID.chargepadBatBox, guiChargepadBatBox, true);
		}
	}

	MachineRegistry.registerPrototype(BlockID.chargepadBatBox, new ChargePadBatbox());
	MachineRegistry.setStoragePlaceFunction("chargepadBatBox", false);

	StorageInterface.createInterface(BlockID.chargepadBatBox, BatteryBlockInterface);
}
