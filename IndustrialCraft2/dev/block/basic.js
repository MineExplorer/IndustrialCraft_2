Block.createSpecialType({
	base: 1,
	solid: true,
	destroytime: 5,
	explosionres: 30,
	lightopacity: 15,
	renderlayer: 2,
	sound: "stone"
}, "machine");

IDRegistry.genBlockID("machineBlockBasic");
Block.createBlock("machineBlockBasic", [
	{name: "Machine Block", texture: [["machine_top", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.machineBlockBasic, "stone", 1, true);
Block.setDestroyLevel("machineBlockBasic", 1);
ToolLib.addBlockDropOnExplosion("machineBlockBasic");

IDRegistry.genBlockID("machineBlockAdvanced");
Block.createBlock("machineBlockAdvanced", [
	{name: "Advanced Machine Block", texture: [["machine_advanced", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.machineBlockAdvanced, "stone", 1, true);
Block.setDestroyLevel("machineBlockAdvanced", 1);
ToolLib.addBlockDropOnExplosion("machineBlockAdvanced");

Callback.addCallback("PreLoaded", function(){
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
	
	Recipes.addShapeless({id: ItemID.plateIron, count: 8, data: 0}, [{id: BlockID.machineBlockBasic, data: 0}]);
});
