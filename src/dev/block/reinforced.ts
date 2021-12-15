BlockRegistry.createBlock("reinforcedStone", [
	{name: "Reinforced Stone", texture: [["reinforced_block", 0]], inCreative: true}
], {
	extends: "stone",
	destroyTime: 25,
	explosionResistance: 150,
});
BlockRegistry.setBlockMaterial(BlockID.reinforcedStone, "stone", 2);
BlockRegistry.setDestroyLevel("reinforcedStone", 2);

BlockRegistry.createBlock("reinforcedGlass", [
	{name: "Reinforced Glass", texture: [["reinforced_glass", 0]], inCreative: true}
], {
	baseBlock: 1,
	destroyTime: 25,
	explosionResistance: 150,
	renderLayer: 1,
	sound: "stone"
});
BlockRegistry.setBlockMaterial(BlockID.reinforcedGlass, "stone", 2);
BlockRegistry.setDestroyLevel("reinforcedGlass", 2);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.reinforcedStone, count: 8, data: 0}, [
		"aaa",
		"axa",
		"aaa"
	], ['x', ItemID.plateAlloy, 0, 'a', 1, 0]);

	Recipes.addShaped({id: BlockID.reinforcedGlass, count: 7, data: 0}, [
		"axa",
		"aaa",
		"axa"
	], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);

	Recipes.addShaped({id: BlockID.reinforcedGlass, count: 7, data: 0}, [
		"aaa",
		"xax",
		"aaa"
	], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
});