/// <reference path="./Transformer.ts" />

BlockRegistry.createBlock("transformerMV", [
	{name: "MV Transformer", texture: [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.transformerMV, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.transformerMV, 0, [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.transformerMV, true);

ItemName.addTooltip(BlockID.transformerMV, "Low: 128 EU/t High: 512 EU/t");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.transformerMV, count: 1, data: 0}, [
		"b",
		"x",
		"b"
	], ['x', BlockID.machineBlockBasic, 0, 'b', ItemID.cableCopper1, 0]);
});

MachineRegistry.registerPrototype(BlockID.transformerMV, new Machine.Transformer(3, BlockID.machineBlockBasic));