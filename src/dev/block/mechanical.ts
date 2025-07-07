/// <reference path="./types/BlockMiningPipe.ts" />
/// <reference path="./types/BlockMachine.ts" />

BlockRegistry.registerBlock(new BlockMiningPipe("miningPipe", "mining_pipe"));
BlockRegistry.registerBlock(new BlockMachine("machineBlockBasic", "machine_block", ["machine_top", 0]));
BlockRegistry.registerBlock(new BlockMachine("machineBlockAdvanced", "advanced_machine_block", ["machine_advanced", 0]));

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.miningPipe, count: 8, data: 0}, [
		"p p",
		"p p",
		"pxp",
	], ['x', ItemID.treetap, 0, 'p', ItemID.plateIron, 0]);

	Recipes.addShaped({id: BlockID.machineBlockBasic, count: 1, data: 0}, [
		"xxx",
		"x x",
		"xxx"
	], ['x', ItemID.plateIron, -1]);

	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		"scs",
		"a#a",
		"scs"
	], ['#', BlockID.machineBlockBasic, -1, 'c', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, 's', ItemID.plateSteel, -1]);

	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		"sas",
		"c#c",
		"sas"
	], ['#', BlockID.machineBlockBasic, -1, 'c', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, 's', ItemID.plateSteel, -1]);

	Recipes.addShapeless({id: ItemID.plateIron, count: 8, data: 0}, [{id: BlockID.machineBlockBasic, data: 0}]);
});
