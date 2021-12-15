/// <reference path="./Transformer.ts" />

BlockRegistry.createBlock("transformerEV", [
	{name: "EV Transformer", texture: [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.transformerEV, "stone", 1);

TileRenderer.setHandAndUiModel(BlockID.transformerEV, 0, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);
TileRenderer.setStandardModel(BlockID.transformerEV, 0, [["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.setStandardModel(BlockID.transformerEV, 1, [["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.transformerEV, 2, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);
TileRenderer.setRotationFunction(BlockID.transformerEV, true);

ItemRegistry.setRarity(BlockID.transformerEV, EnumRarity.UNCOMMON);
ItemName.addTooltip(BlockID.transformerEV, "Low: 2048 EU/t High: 8192 EU/t");

Item.addCreativeGroup("EUTransformers", Translation.translate("Transformers"), [
	BlockID.transformerLV,
	BlockID.transformerMV,
	BlockID.transformerHV,
	BlockID.transformerEV
]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.transformerEV, count: 1, data: 0}, [
		" b ",
		"cxa",
		" b "
	], ['x', BlockID.transformerHV, 0, 'a', ItemID.storageLapotronCrystal, -1, 'b', ItemID.cableIron3, 0, 'c', ItemID.circuitAdvanced, 0]);
});

MachineRegistry.registerPrototype(BlockID.transformerEV, new Machine.Transformer(5, BlockID.machineBlockBasic));