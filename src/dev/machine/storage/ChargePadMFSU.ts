/// <reference path="./BatteryBlock.ts" />

BlockRegistry.createBlock("chargepadMFSU", [
	{name: "Charge Pad (MFSU)", texture: [["chargepad_mfsu_bottom", 0], ["chargepad_mfsu_top", 0], ["chargepad_mfsu_side", 0], ["chargepad_mfsu_front", 0], ["chargepad_mfsu_side", 0], ["chargepad_mfsu_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.chargepadMFSU, "stone", 1);

TileRenderer.setHandAndUiModel(BlockID.chargepadMFSU, 0, [["chargepad_mfsu_bottom", 0], ["chargepad_mfsu_top", 0], ["chargepad_mfsu_side", 0], ["chargepad_mfsu_front", 0], ["chargepad_mfsu_side", 0], ["chargepad_mfsu_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.chargepadMFSU, 2, [["chargepad_mfsu_bottom", 0], ["chargepad_mfsu_top", 0], ["chargepad_mfsu_side", 0], ["chargepad_mfsu_front", 0], ["chargepad_mfsu_side", 0], ["chargepad_mfsu_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.chargepadMFSU, 2, [["chargepad_mfsu_bottom", 0], ["chargepad_mfsu_top_active", 0], ["chargepad_mfsu_side", 0], ["chargepad_mfsu_front", 0], ["chargepad_mfsu_side", 0], ["chargepad_mfsu_side", 0]]);

ItemRegistry.setRarity(BlockID.chargepadMFSU, EnumRarity.UNCOMMON);
ItemName.addStorageBlockTooltip("chargepadMFSU", 4, "60M", 2048);

Item.addCreativeGroup("EUStorages", Translation.translate("Energy Storages"), [
    BlockID.storageBatBox,
	BlockID.storageCESU,
	BlockID.storageMFE,
	BlockID.storageMFSU,
	BlockID.chargepadBatBox,
	BlockID.chargepadCESU,
	BlockID.chargepadMFE,
	BlockID.chargepadMFSU
]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.chargepadMFSU, count: 1, data: 0}, [
		"cpc",
		"r#r"
	], ['#', BlockID.storageMFSU, -1, 'c', ItemID.circuitAdvanced, -1, 'p', VanillaBlockID.stone_pressure_plate, -1, 'r', ItemID.rubber, -1]);
});

namespace Machine {
	const guiChargepadMFSU = BatteryBlockWindow("Charge Pad (MFSU)");

	export class ChargepadMFSU extends ChargePad {
		constructor() {
			super(4, 6e7, BlockID.machineBlockAdvanced, guiChargepadMFSU);
		}
	}

	MachineRegistry.registerPrototype(BlockID.chargepadMFSU, new ChargepadMFSU());
	MachineRegistry.setStoragePlaceFunction("chargepadMFSU", false);

	StorageInterface.createInterface(BlockID.chargepadMFSU, BatteryBlockInterface);
}