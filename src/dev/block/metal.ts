

BlockRegistry.createBlock("blockCopper", [
	{name: "Copper Block", texture: [["block_copper", 0]], inCreative: true}
], "stone");
BlockRegistry.setBlockMaterial(BlockID.blockCopper, "stone", 2);
BlockRegistry.setDestroyLevel("blockCopper", 2);

BlockRegistry.createBlock("blockTin", [
	{name: "Tin Block", texture: [["block_tin", 0]], inCreative: true}
], "stone");
BlockRegistry.setBlockMaterial(BlockID.blockTin, "stone", 2);
BlockRegistry.setDestroyLevel("blockTin", 2);

BlockRegistry.createBlock("blockBronze", [
	{name: "Bronze Block", texture: [["block_bronze", 0]], inCreative: true}
], "stone");
BlockRegistry.setBlockMaterial(BlockID.blockBronze, "stone", 2);
BlockRegistry.setDestroyLevel("blockBronze", 2);

BlockRegistry.createBlock("blockLead", [
	{name: "Lead Block", texture: [["block_lead", 0]], inCreative: true}
], "stone");
BlockRegistry.setBlockMaterial(BlockID.blockLead, "stone", 2);
BlockRegistry.setDestroyLevel("blockLead", 2);

BlockRegistry.createBlock("blockSteel", [
	{name: "Steel Block", texture: [["block_steel", 0]], inCreative: true}
], "stone");
BlockRegistry.setBlockMaterial(BlockID.blockSteel, "stone", 2);
BlockRegistry.setDestroyLevel("blockSteel", 2);

BlockRegistry.createBlock("blockSilver", [
	{name: "Silver Block", texture: [["block_silver", 0]], inCreative: true}
], "stone");
BlockRegistry.setBlockMaterial(BlockID.blockSilver, "stone", 3);
BlockRegistry.setDestroyLevel("blockSilver", 3);

BlockRegistry.createBlock("blockUranium", [
	{name: "Uranium Block", texture: [["block_uranium", 0], ["block_uranium", 0], ["block_uranium", 1]], inCreative: true}
], "stone");
BlockRegistry.setBlockMaterial(BlockID.blockUranium, "stone", 3);
BlockRegistry.setDestroyLevel("blockUranium", 3);

Item.addCreativeGroup("blockMetal", Translation.translate("Metal Blocks"), [
	BlockID.blockCopper,
	BlockID.blockTin,
	BlockID.blockBronze,
	BlockID.blockLead,
	BlockID.blockSteel,
	BlockID.blockSilver,
	BlockID.blockUranium
]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.blockCopper, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotCopper, 0]);

	Recipes.addShaped({id: BlockID.blockTin, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotTin, 0]);

	Recipes.addShaped({id: BlockID.blockBronze, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotBronze, 0]);

	Recipes.addShaped({id: BlockID.blockLead, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotLead, 0]);

	Recipes.addShaped({id: BlockID.blockSteel, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotSteel, 0]);

	Recipes.addShaped({id: BlockID.blockSilver, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotSilver, 0]);

	Recipes.addShaped({id: BlockID.blockUranium, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.uranium238, 0]);

	addSingleItemRecipe("ingot_copper", "block:blockCopper", "item:ingotCopper", 9);
	addSingleItemRecipe("ingot_tin", "block:blockTin", "item:ingotTin", 9);
	addSingleItemRecipe("ingot_bronze", "block:blockBronze", "item:ingotBronze", 9);
	addSingleItemRecipe("ingot_lead", "block:blockLead", "item:ingotLead", 9);
	addSingleItemRecipe("ingot_steel", "block:blockSteel", "item:ingotSteel", 9);
	addSingleItemRecipe("ingot_silver", "block:blockSilver", "item:ingotSilver", 9);
	addSingleItemRecipe("uranium_238", "block:blockUranium", "item:uranium238", 9);
});
