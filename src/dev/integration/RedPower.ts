ModAPI.addAPICallback("RedCore", (api: any) => {
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

	MachineRecipeRegistry.addRecipeFor("compressor", ItemID.nikolite, {id: BlockID.blockNikolite, count: 1, data: 0, sourceCount: 9});
	MachineRecipeRegistry.addRecipeFor("compressor", ItemID.gemRuby, {id: BlockID.blockRuby, count: 1, data: 0, sourceCount: 9});
	MachineRecipeRegistry.addRecipeFor("compressor", ItemID.gemSapphire, {id: BlockID.blockSapphire, count: 1, data: 0, sourceCount: 9});
	MachineRecipeRegistry.addRecipeFor("compressor", ItemID.gemGreenSapphire, {id: BlockID.blockGreenSapphire, count: 1, data: 0, sourceCount: 9});
});