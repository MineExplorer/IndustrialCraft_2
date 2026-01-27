/// <reference path="./ChargePad.ts" />

BlockRegistry.createBlock("chargepadCESU", [
	{name: "Charge Pad (CESU)", texture: [["chargepad_cesu_bottom", 0], ["chargepad_cesu_top", 0], ["chargepad_cesu_back", 0], ["chargepad_cesu_front", 0], ["chargepad_cesu_side", 0], ["chargepad_cesu_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.chargepadCESU, "stone", 1);

TileRenderer.setHandAndUiModel(BlockID.chargepadCESU, 0, [["chargepad_cesu_bottom", 0], ["chargepad_cesu_top", 0], ["chargepad_cesu_back", 0], ["chargepad_cesu_front", 0], ["chargepad_cesu_side", 0], ["chargepad_cesu_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.chargepadCESU, 2, [["chargepad_cesu_bottom", 0], ["chargepad_cesu_top", 0], ["chargepad_cesu_back", 0], ["chargepad_cesu_front", 0], ["chargepad_cesu_side", 0], ["chargepad_cesu_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.chargepadCESU, 2, [["chargepad_cesu_bottom", 0], ["chargepad_cesu_top_active", 0], ["chargepad_cesu_back", 0], ["chargepad_cesu_front", 0], ["chargepad_cesu_side", 0], ["chargepad_cesu_side", 0]]);

ItemName.addStorageBlockTooltip("chargepadCESU", 2, "300K", 128);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.chargepadCESU, count: 1, data: 0}, [
		"cpc",
		"r#r"
	], ['#', BlockID.storageCESU, -1, 'c', ItemID.circuitBasic, -1, 'p', VanillaBlockID.stone_pressure_plate, -1, 'r', ItemID.rubber, -1]);
});

namespace Machine {
	const guiChargepadCESU = BatteryBlockWindow("Charge Pad (CESU)");

	export class ChargepadCESU extends ChargePad {
		constructor() {
			super(2, 300000, BlockID.chargepadCESU, guiChargepadCESU);
		}
	}

	MachineRegistry.registerPrototype(BlockID.chargepadCESU, new ChargepadCESU());
	MachineRegistry.setStoragePlaceFunction("chargepadCESU", false);

	StorageInterface.createInterface(BlockID.chargepadCESU, BatteryBlockInterface);
}