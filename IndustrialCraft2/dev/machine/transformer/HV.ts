/// <reference path="./TileEntityTransformer.ts" />

IDRegistry.genBlockID("transformerHV");
Block.createBlock("transformerHV", [
	{name: "HV Transformer", texture: [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.transformerHV, "stone", 1, true);

TileRenderer.setStandardModel(BlockID.transformerHV, 0, [["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 1], ["hv_transformer_side", 1]]);
TileRenderer.setStandardModel(BlockID.transformerHV, 1, [["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 1], ["hv_transformer_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.transformerHV, 2, [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]]);

MachineRegistry.setMachineDrop("transformerHV", BlockID.machineBlockBasic);

ItemName.setRarity(BlockID.transformerHV, 1);
ItemName.addTooltip(BlockID.transformerHV, "Low: 512 EU/t High: 2048 EU/t");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.transformerHV, count: 1, data: 0}, [
		" b ",
		"cxa",
		" b "
	], ['x', BlockID.transformerMV, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.cableGold2, -1, 'c', ItemID.circuitBasic, -1]);
});

MachineRegistry.registerPrototype(BlockID.transformerEV, new TileEntityTransformer(4));