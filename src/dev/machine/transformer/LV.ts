/// <reference path="./Transformer.ts" />

IDRegistry.genBlockID("transformerLV");
Block.createBlock("transformerLV", [
	{name: "LV Transformer", texture: [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.transformerLV, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.transformerLV, 0, [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.transformerLV, true);

ItemName.addTooltip(BlockID.transformerLV, "Low: 32 EU/t High: 128 EU/t");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.transformerLV, count: 1, data: 0}, [
		"aba",
		"aoa",
		"aba"
	], ['o', ItemID.coil, 0, 'a', 5, -1, 'b', ItemID.cableTin1, 0]);
});

MachineRegistry.registerPrototype(BlockID.transformerLV, new Machine.Transformer(2));