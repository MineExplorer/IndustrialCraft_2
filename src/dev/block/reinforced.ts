/// <reference path="./types/BlockStone.ts" />
/// <reference path="./types/BlockReinforcedDoor.ts" />

BlockRegistry.registerBlock(new BlockStone("reinforcedStone", "reinforced_stone", ["reinforced_stone", 0], 2, {
	extends: "stone",
	destroyTime: 25,
	explosionResistance: 150,
}));

BlockRegistry.registerBlock(new BlockStone("reinforcedGlass", "reinforced_glass", ["reinforced_glass", 0], 2, {
	baseBlock: 1,
	destroyTime: 25,
	explosionResistance: 150,
	renderLayer: 1,
	sound: "stone"
}));

BlockRegistry.registerBlock(new BlockReinforcedDoor("reinforcedDoor", [["reinforced_door_bottom", 0]], [["reinforced_door_top", 0]]));

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