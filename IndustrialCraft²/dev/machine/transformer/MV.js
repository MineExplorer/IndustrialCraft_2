IDRegistry.genBlockID("transformerMV");
Block.createBlock("transformerMV", [
	{name: "MV Transformer", texture: [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.transformerMV, [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.transformerMV, 0, [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]]);

Block.registerDropFunction("transformerMV", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Item.registerNameOverrideFunction(BlockID.transformerMV, function(item, name){
	return name + "\n§7Low: 128 EU/t High: 512 EU/t";
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.transformerMV, count: 1, data: 0}, [
		"b",
		"x",
		"b"
	], ['x', BlockID.machineBlockBasic, 0, 'b', ItemID.cableCopper1, 0]);
});

MachineRegistry.registerTransformer(BlockID.transformerMV, 3);