Block.createSpecialType({
	base: 1,
	solid: true,
	destroytime: 5,
	explosionres: 30,
	lightopacity: 15,
	renderlayer: 2,
	sound: "stone"
}, "machine");

BlockRegistry.createBlock("machineBlockBasic", [
	{name: "Machine Block", texture: [["machine_top", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.machineBlockBasic, "stone", 1, true);
BlockRegistry.setDestroyLevel("machineBlockBasic", 1);

BlockRegistry.createBlock("machineBlockAdvanced", [
	{name: "Advanced Machine Block", texture: [["machine_advanced", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.machineBlockAdvanced, "stone", 1, true);
BlockRegistry.setDestroyLevel("machineBlockAdvanced", 1);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.machineBlockBasic, count: 1, data: 0}, [
		"xxx",
		"x x",
		"xxx"
	], ['x', ItemID.plateIron, -1]);

	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		" x ",
		"a#a",
		" x "
	], ['x', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, '#', BlockID.machineBlockBasic, 0]);

	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		" a ",
		"x#x",
		" a "
	], ['x', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, '#', BlockID.machineBlockBasic, 0]);

	addSingleItemRecipe("iron_plate_from_machine_block", "block:machineBlockBasic", "item:plateIron", 8);
});
