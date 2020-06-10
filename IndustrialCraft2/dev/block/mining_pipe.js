IDRegistry.genBlockID("miningPipe");
Block.createBlock("miningPipe", [
	{name: "Mining Pipe", texture: [["mining_pipe", 0]], inCreative: true},
	{name: "tile.mining_pipe.name", texture: [["mining_pipe", 1]], inCreative: false}
], {base: 1, destroytime: 2, renderlayer: 2, sound: "stone"});
Block.setBlockShape(BlockID.miningPipe, {x: 5/16, y: 0, z: 5/16}, {x: 11/16, y: 1, z: 11/16}, 0);
ToolAPI.registerBlockMaterial(BlockID.miningPipe, "stone", 1, true);
Block.setDestroyLevel("miningPipe", 1);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.miningPipe, count: 8, data: 0}, [
		"p p",
		"p p",
		"pxp",
	], ['x', ItemID.treetap, 0, 'p', ItemID.plateIron, 0]);
});