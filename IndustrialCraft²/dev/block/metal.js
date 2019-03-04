IDRegistry.genBlockID("blockCopper");
Block.createBlock("blockCopper", [
	{name: "Copper Block", texture: [["block_copper", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockCopper, "stone", 2, true);
Block.setDestroyTime(BlockID.blockCopper, 5);
Block.setDestroyLevel("blockCopper", 2);


IDRegistry.genBlockID("blockTin");
Block.createBlock("blockTin", [
	{name: "Tin Block", texture: [["block_tin", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockTin, "stone", 2, true);
Block.setDestroyTime(BlockID.blockTin, 5);
Block.setDestroyLevel("blockTin", 2);


IDRegistry.genBlockID("blockBronze");
Block.createBlock("blockBronze", [
	{name: "Bronze Block", texture: [["block_bronze", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockBronze, "stone", 2, true);
Block.setDestroyTime(BlockID.blockBronze, 5);
Block.setDestroyLevel("blockBronze", 2);


IDRegistry.genBlockID("blockLead");
Block.createBlock("blockLead", [
	{name: "Lead Block", texture: [["block_lead", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockLead, "stone", 2, true);
Block.setDestroyTime(BlockID.blockLead, 5);
Block.setDestroyLevel("blockLead", 2);


IDRegistry.genBlockID("blockSteel");
Block.createBlock("blockSteel", [
	{name: "Steel Block", texture: [["block_steel", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockSteel, "stone", 2, true);
Block.setDestroyTime(BlockID.blockSteel, 5);
Block.setDestroyLevel("blockSteel", 2);


IDRegistry.genBlockID("blockSilver");
Block.createBlock("blockSilver", [
	{name: "Silver Block", texture: [["block_silver", 0]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockSilver, "stone", 3, true);
Block.setDestroyTime(BlockID.blockSilver, 5);
Block.setDestroyLevel("blockSilver", 3);

IDRegistry.genBlockID("blockUranium");
Block.createBlock("blockUranium", [
	{name: "Uranium Block", texture: [["block_uranium", 0], ["block_uranium", 0], ["block_uranium", 1]], inCreative: true}
], "opaque");
ToolAPI.registerBlockMaterial(BlockID.blockUranium, "stone", 3, true);
Block.setDestroyTime(BlockID.blockUranium, 5);
Block.setDestroyLevel("blockUranium", 3);


Callback.addCallback("PreLoaded", function(){
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
	
	Recipes.addShapeless({id: ItemID.ingotCopper, count: 9, data: 0}, [{id: BlockID.blockCopper, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotTin, count: 9, data: 0}, [{id: BlockID.blockTin, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotBronze, count: 9, data: 0}, [{id: BlockID.blockBronze, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotLead, count: 9, data: 0}, [{id: BlockID.blockLead, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotSteel, count: 9, data: 0}, [{id: BlockID.blockSteel, data: 0}]);
	Recipes.addShapeless({id: ItemID.ingotSilver, count: 9, data: 0}, [{id: BlockID.blockSilver, data: 0}]);
	Recipes.addShapeless({id: ItemID.uranium238, count: 9, data: 0}, [{id: BlockID.blockUranium, data: 0}]);
});
