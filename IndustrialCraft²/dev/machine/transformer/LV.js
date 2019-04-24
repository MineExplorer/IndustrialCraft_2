IDRegistry.genBlockID("transformerLV");
Block.createBlock("transformerLV", [
	{name: "LV Transformer", texture: [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]], inCreative: true}
], "opaque");
TileRenderer.setStandartModel(BlockID.transformerLV, [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]]);
TileRenderer.registerFullRotationModel(BlockID.transformerLV, 0, [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]]);

Block.registerDropFunction("transformerLV", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level);
});

Item.registerNameOverrideFunction(BlockID.transformerLV, function(item, name){
	return name + "\n§7Low: 32 EU/t High: 128 EU/t";
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: BlockID.transformerLV, count: 1, data: 0}, [
		"aba",
		"aoa",
		"aba"
	], ['o', ItemID.coil, 0, 'a', 5, -1, 'b', ItemID.cableTin1, 0]);
});

MachineRegistry.registerTransformer(BlockID.transformerLV, 2);