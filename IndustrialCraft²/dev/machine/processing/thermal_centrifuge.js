IDRegistry.genBlockID("thermalCentrifuge");
Block.createBlockWithRotation("thermalCentrifuge", [
    {name: "Thermal Centrifuge", texture: [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], inCreative: true}
], "opaque");
//MachineRenderer.setStandartModel(BlockID.thermalCentrifuge, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]],, true);
//MachineRenderer.registerRenderModel(BlockID.thermalCentrifuge, [["machine_advanced", 0], ["thermal_centrifuge_top", 1], ["machine_side", 0], ["thermal_centrifuge_front", 1], ["thermal_centrifuge_side", 1], ["thermal_centrifuge_side", 1]],, true);

Block.registerDropFunction("thermalCentrifuge", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, level, BlockID.machineBlockAdvanced);
});
/*
Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.thermalCentrifuge, count: 1, data: 0}, [
		"cmc",
		"a#a",
		"axa"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.electricMotor, 0, 'a', 265, 0, 'm', ItemID.miningLaser, 0, 'c', ItemID.coil, 0]);
});
*/
Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("thermalCentrifuge", {
	    //4: {result: [ItemID.dustStone, 1], heat: 100},
		"ItemID.crushedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1, ItemID.dustStone, 1], heat: 500},
		"ItemID.crushedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1, ItemID.dustStone, 1], heat: 1000},
		"ItemID.crushedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1, ItemID.dustStone, 1], heat: 1500},
		"ItemID.crushedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedLead": {result: [ItemID.dustSmallCopper, 1, ItemID.dustLead, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedPurifiedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1], heat: 500},
		"ItemID.crushedPurifiedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1], heat: 1000},
		"ItemID.crushedPurifiedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1], heat: 1500},
		"ItemID.crushedPurifiedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1], heat: 2000},
		"ItemID.crushedPurifiedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1], heat: 2000},
		"ItemID.crushedPurifiedLead": {result: [ItemID.dustSmallCopper, 1, ItemID.dustLead, 1], heat: 2000}
	}, true);
});
