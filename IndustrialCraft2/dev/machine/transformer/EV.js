IDRegistry.genBlockID("transformerEV");
Block.createBlock("transformerEV", [
	{name: "EV Transformer", texture: [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]], inCreative: true}
], "stone");
ItemName.setRarity(BlockID.transformerEV, 1, true);
TileRenderer.setStandartModel(BlockID.transformerEV, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);
TileRenderer.registerRenderModel(BlockID.transformerEV, 0, [["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.registerRenderModel(BlockID.transformerEV, 1, [["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.registerRotationModel(BlockID.transformerEV, 2, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);

MachineRegistry.setMachineDrop("transformerEV", BlockID.machineBlockBasic);

Item.registerNameOverrideFunction(BlockID.transformerEV, function(item, name){
	return name + "\n§7Low: 2048 EU/t High: 8192 EU/t";
});

Item.addCreativeGroup("EUTransformers", Translation.translate("Transformers"), [
	BlockID.transformerLV,
	BlockID.transformerMV,
	BlockID.transformerHV,
	BlockID.transformerEV
]);

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.transformerEV, count: 1, data: 0}, [
		" b ",
		"cxa",
		" b "
	], ['x', BlockID.transformerHV, 0, 'a', ItemID.storageLapotronCrystal, -1, 'b', ItemID.cableIron3, 0, 'c', ItemID.circuitAdvanced, 0]);
});

MachineRegistry.registerTransformer(BlockID.transformerEV, 5);