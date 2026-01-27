/// <reference path="./BatteryBlock.ts" />

BlockRegistry.createBlock("chargepadMFE", [
	{name: "Charge Pad (MFE)", texture: [["chargepad_mfe_bottom", 0], ["chargepad_mfe_top", 0], ["chargepad_mfe_back", 0], ["chargepad_mfe_front", 0], ["chargepad_mfe_side", 0], ["chargepad_mfe_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.chargepadMFE, "stone", 1);

TileRenderer.setHandAndUiModel(BlockID.chargepadMFE, 0, [["chargepad_mfe_bottom", 0], ["chargepad_mfe_top", 0], ["chargepad_mfe_back", 0], ["chargepad_mfe_front", 0], ["chargepad_mfe_side", 0], ["chargepad_mfe_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.chargepadMFE, 2, [["chargepad_mfe_bottom", 0], ["chargepad_mfe_top", 0], ["chargepad_mfe_back", 0], ["chargepad_mfe_front", 0], ["chargepad_mfe_side", 0], ["chargepad_mfe_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.chargepadMFE, 2, [["chargepad_mfe_bottom", 0], ["chargepad_mfe_top_active", 0], ["chargepad_mfe_back", 0], ["chargepad_mfe_front", 0], ["chargepad_mfe_side", 0], ["chargepad_mfe_side", 0]]);

ItemName.addStorageBlockTooltip("chargepadMFE", 3, "4M", 512);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.chargepadMFE, count: 1, data: 0}, [
		"cpc",
		"r#r"
	], ['#', BlockID.storageMFE, -1, 'c', ItemID.circuitAdvanced, -1, 'p', VanillaBlockID.stone_pressure_plate, -1, 'r', ItemID.rubber, -1]);
});

namespace Machine {
	const guiChargepadMFE = BatteryBlockWindow("Charge Pad (MFE)");

	export class ChargepadMFE extends ChargePad {
		constructor() {
			super(3, 4000000, BlockID.machineBlockBasic, guiChargepadMFE);
		}
	}

	MachineRegistry.registerPrototype(BlockID.chargepadMFE, new ChargepadMFE());
	MachineRegistry.setStoragePlaceFunction("chargepadMFE", false);

	StorageInterface.createInterface(BlockID.chargepadMFE, BatteryBlockInterface);
}