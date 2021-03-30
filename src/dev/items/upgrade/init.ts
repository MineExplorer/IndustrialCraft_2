/// <reference path="UpgradeModule.ts" />
/// <reference path="UpgradeEjector.ts" />
/// <reference path="UpgradePulling.ts" />
/// <reference path="UpgradeFluidEjector.ts" />
/// <reference path="UpgradeFluidPulling.ts" />

ItemRegistry.registerItem(new UpgradeModule("upgradeOverclocker", "overclocker", "overclocker"));
ItemRegistry.registerItem(new UpgradeModule("upgradeTransformer", "transformer", "transformer"));
ItemRegistry.registerItem(new UpgradeModule("upgradeEnergyStorage", "energy_storage", "energyStorage"));
ItemRegistry.registerItem(new UpgradeModule("upgradeRedstone", "redstone_inv", "redstone"));
ItemRegistry.registerItem(new UpgradeEjector());
ItemRegistry.registerItem(new UpgradePulling());
ItemRegistry.registerItem(new UpgradeFluidEjector());
ItemRegistry.registerItem(new UpgradeFluidPulling());

ItemRegistry.createItem("upgradeMFSU", {name: "mfsu_upgrade", icon: "mfsu_upgrade"});

Item.addCreativeGroup("ic2_upgrade", Translation.translate("Machine Upgrades"), [
	ItemID.upgradeOverclocker,
	ItemID.upgradeTransformer,
	ItemID.upgradeEnergyStorage,
	ItemID.upgradeRedstone,
	ItemID.upgradeEjector,
	ItemID.upgradePulling,
	ItemID.upgradeFluidEjector,
	ItemID.upgradeFluidPulling
]);


Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 2, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell, 1]);

	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 6, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell3, 1]);

	Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 12, data: 0}, [
		"aaa",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell6, 1]);

	Recipes.addShaped({id: ItemID.upgradeTransformer, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', BlockID.transformerMV, 0, 'x', ItemID.cableGold2, -1, 'a', 20, -1, 'c', ItemID.circuitBasic, -1]);

	Recipes.addShaped({id: ItemID.upgradeEnergyStorage, count: 1, data: 0}, [
		"aaa",
		"x#x",
		"aca"
	], ['#', ItemID.storageBattery, -1, 'x', ItemID.cableCopper1, -1, 'a', 5, -1, 'c', ItemID.circuitBasic, -1]);

	Recipes.addShaped({id: ItemID.upgradeRedstone, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, -1, '#', 69, -1]);

	Recipes.addShaped({id: ItemID.upgradeEjector, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 33, -1, 'b', 410, 0]);

	Recipes.addShaped({id: ItemID.upgradePulling, count: 1, data: 0}, [
		"aba",
		"x#x",
	], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 29, -1, 'b', 410, 0]);

	Recipes.addShaped({id: ItemID.upgradeFluidEjector, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1]);

	Recipes.addShaped({id: ItemID.upgradeFluidPulling, count: 1, data: 0}, [
		"xcx",
		" # ",
		"x x",
	], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1, 'c', ItemID.treetap, 0]);

	Recipes.addShaped({id: ItemID.upgradeMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', ItemID.bronzeWrench, 0, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, -1]);
});

Item.registerUseFunction("upgradeMFSU", function(coords, item, block, player) {
	if (block.id == BlockID.storageMFE) {
		let region = WorldRegion.getForActor(player);
		let tile = region.getTileEntity(coords);
		tile.selfDestroy();
		region.setBlock(coords, BlockID.storageMFSU, tile.getFacing());
		let newTile = region.addTileEntity(coords);
		newTile.data = tile.data;
		Entity.setCarriedItem(player, item.id, item.count - 1, 0);
	}
});
