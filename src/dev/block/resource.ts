class ResourceBlock extends BlockBase {
	constructor(id: string, oreName: string, miningLevel: number) {
		super(id, "stone");
		const name = oreName + "_block";
		const textureName = "block_" + oreName;
		this.addVariation(name, [[textureName, 0]], true);
		this.setBlockMaterial("stone", miningLevel);
		this.setDestroyTime(5);
	}
}

BlockRegistry.registerBlock(new ResourceBlock("blockCopper", "copper", 2));
BlockRegistry.registerBlock(new ResourceBlock("blockTin", "tin", 2));
BlockRegistry.registerBlock(new ResourceBlock("blockBronze", "bronze", 2));
BlockRegistry.registerBlock(new ResourceBlock("blockLead", "lead", 2));
BlockRegistry.registerBlock(new ResourceBlock("blockSteel", "steel", 2));
BlockRegistry.registerBlock(new ResourceBlock("blockSilver", "silver", 3));
BlockRegistry.registerBlock(new ResourceBlock("blockUranium", "uranium", 3));

Item.addCreativeGroup("blockResource", Translation.translate("Resource Blocks"), [
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
