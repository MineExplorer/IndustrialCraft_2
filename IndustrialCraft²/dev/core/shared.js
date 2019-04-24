ModAPI.registerAPI("ICore", {
	Machine: MachineRegistry,
	Recipe: MachineRecipeRegistry,
	Render: TileRenderer,
	ChargeRegistry: ChargeItemRegistry,
	Upgrade: UpgradeAPI,
	ItemName: NameOverrides,
	UI: UIbuttons,
	Ore: OreGenerator,
	
	requireGlobal: function(command){
		return eval(command);
	}
});

Logger.Log("Industrial Core API shared with name ICore.", "API");