/// <reference path="./Transformer.ts" />

BlockRegistry.createBlock("transformerMV", [
	{name: "MV Transformer", texture: [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.transformerMV, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.transformerMV, 0, [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.transformerMV, true);

ItemName.addTooltip(BlockID.transformerMV, "tooltip.transformer", 128, 512);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.transformerMV, count: 1, data: 0}, [
		" b ",
		"oxo",
		" b "
	], ['x', BlockID.machineBlockBasic, 0, 'o', ItemID.coil, 0, 'b', ItemID.cableCopper1, 0]);
});

MachineRegistry.registerPrototype(BlockID.transformerMV, new Machine.Transformer(3, BlockID.machineBlockBasic));