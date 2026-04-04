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

	const dictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipeRegistry.getDictionary("compressor");
	dictionary.addRecipe({id: ItemID.nikolite, count: 9}, {id: BlockID.blockNikolite, count: 1});
	dictionary.addRecipe({id: ItemID.gemRuby, count: 9}, {id: BlockID.blockRuby, count: 1});
	dictionary.addRecipe({id: ItemID.gemSapphire, count: 9}, {id: BlockID.blockSapphire, count: 1});
	dictionary.addRecipe({id: ItemID.gemGreenSapphire, count: 9}, {id: BlockID.blockGreenSapphire, count: 1});

	const cuttingRecipes: MachineRecipe.BlockCutterRecipeDictionary = MachineRecipeRegistry.getDictionary("cuttingMachine");
    cuttingRecipes.addRecipe({id: ItemID.siliconBoule}, {id: ItemID.waferSilicon, count: 16}, 4);
});
