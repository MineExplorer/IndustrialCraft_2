/*IDRegistry.genBlockID("advancedMiner");
Block.createBlock("advancedMiner", [
	{name: "Advanced Miner", texture: [["advanced_miner_bottom", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "opaque");

Block.registerDropFunction("advancedMiner", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.advancedMiner, count: 1, data: 0}, [
		"pmp",
		"e#a",
		"pmp"
	], ['#', BlockID.machineBlockAdvanced, 0, 'a', BlockID.teleporter, 0, 'e', BlockID.storageMFE, -1, 'm', BlockID.miner, -1, 'p', ItemID.plateAlloy, 0]);
});
*/