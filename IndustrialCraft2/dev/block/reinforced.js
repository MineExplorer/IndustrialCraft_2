IDRegistry.genBlockID("reinforcedStone");
Block.createBlock("reinforcedStone", [
	{name: "Reinforced Stone", texture: [["reinforced_block", 0]], inCreative: true}
], {
	base: 1,
	solid: true,
	destroytime: 25,
	explosionres: 150,
	lightopacity: 15,
	renderlayer: 2,
	translucency: 0,
	sound: "stone"
});
ToolAPI.registerBlockMaterial(BlockID.reinforcedStone, "stone", 2, true);
Block.setDestroyLevel("reinforcedStone", 2);
ToolLib.addBlockDropOnExplosion("reinforcedStone");

IDRegistry.genBlockID("reinforcedGlass");
Block.createBlock("reinforcedGlass", [
	{name: "Reinforced Glass", texture: [["reinforced_glass", 0]], inCreative: true}
], {
	base: 1,
	destroytime: 25,
	explosionres: 150,
	renderlayer: 1,
	sound: "stone"
});
ToolAPI.registerBlockMaterial(BlockID.reinforcedGlass, "stone", 2, true);
Block.setDestroyLevel("reinforcedGlass", 2);
ToolLib.addBlockDropOnExplosion("reinforcedGlass");

Callback.addCallback("PreLoaded", function(){
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