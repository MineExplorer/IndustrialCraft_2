IDRegistry.genBlockID("transformerEV");
Block.createBlock("transformerEV", [
	{name: "EV Transformer", texture: [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.transformerEV, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);
TileRenderer.registerRenderModel(BlockID.transformerEV, 0, [["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.registerRenderModel(BlockID.transformerEV, 1, [["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.registerRotationModel(BlockID.transformerEV, 2, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);

Block.registerDropFunction("transformerEV", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockBasic);
});

Item.registerNameOverrideFunction(BlockID.transformerEV, function(item, name){
	return name + "\n§7Low: 2048 EU/t High: 8192 EU/t";
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.transformerEV, count: 1, data: 0}, [
		" b ",
		"cxa",
		" b "
	], ['x', BlockID.transformerHV, 0, 'a', ItemID.storageLapotronCrystal, -1, 'b', ItemID.cableIron3, 0, 'c', ItemID.circuitAdvanced, 0]);
});

MachineRegistry.registerTransformer(BlockID.transformerEV, 5);