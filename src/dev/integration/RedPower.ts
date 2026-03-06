ModAPI.addAPICallback("RedCore", (api: typeof RedCore) => {
	api.Integration.addDeployerItem(ItemID.cableTin0);
	api.Integration.addDeployerItem(ItemID.cableTin1);
	api.Integration.addDeployerItem(ItemID.cableCopper0);
	api.Integration.addDeployerItem(ItemID.cableCopper1);
	api.Integration.addDeployerItem(ItemID.cableGold0);
	api.Integration.addDeployerItem(ItemID.cableGold1);
	api.Integration.addDeployerItem(ItemID.cableGold2);
	api.Integration.addDeployerItem(ItemID.cableIron0);
	api.Integration.addDeployerItem(ItemID.cableIron1);
	api.Integration.addDeployerItem(ItemID.cableIron2);
	api.Integration.addDeployerItem(ItemID.cableIron3);
	api.Integration.addDeployerItem(ItemID.cableOptic);

	MachineRecipeRegistry.addProcessingRecipe("compressor", {id: ItemID.nikolite, count: 9}, {id: BlockID.blockNikolite, count: 1});
	MachineRecipeRegistry.addProcessingRecipe("compressor", {id: ItemID.gemRuby, count: 9}, {id: BlockID.blockRuby, count: 1});
	MachineRecipeRegistry.addProcessingRecipe("compressor", {id: ItemID.gemSapphire, count: 9}, {id: BlockID.blockSapphire, count: 1});
	MachineRecipeRegistry.addProcessingRecipe("compressor", {id: ItemID.gemGreenSapphire, count: 9}, {id: BlockID.blockGreenSapphire, count: 1});
});