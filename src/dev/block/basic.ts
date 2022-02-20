class BlockStone extends BlockBase {
	constructor(id: string, name: string, texture: [string, number][], miningLevel: number = 1) {
		super(id, "stone");
		this.addVariation(name, texture, true);
		this.setBlockMaterial("stone", miningLevel);
		this.setDestroyTime(3);
	}
}

// legacy
BlockRegistry.createBlockType("machine", {
	extends: "stone",
	destroyTime: 3
});

BlockRegistry.registerBlock(new BlockStone("machineBlockBasic", "machine_block", [["machine_top", 0]]));
BlockRegistry.registerBlock(new BlockStone("machineBlockAdvanced", "advanced_machine_block", [["machine_advanced", 0]]));

Callback.addCallback("PreLoaded", function() {
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

	addSingleItemRecipe("iron_plate_from_machine_block", "block:machineBlockBasic", "item:plateIron", 8);
});
