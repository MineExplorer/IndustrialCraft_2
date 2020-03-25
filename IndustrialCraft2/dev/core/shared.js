ModAPI.registerAPI("ICore", {
	Machine: MachineRegistry,
	Recipe: MachineRecipeRegistry,
	Render: TileRenderer,
	ChargeRegistry: ChargeItemRegistry,
	Upgrade: UpgradeAPI,
	Reactor: ReactorAPI,
	Radiation: RadiationAPI,
	Tool: ICTool,
	Sound: SoundAPI,
	Agriculture: AgricultureAPI,
	ItemName: ItemName,
	UI: UIbuttons,
	Config: Config,
	Ore: OreGenerator,
	Integration: IntegrationAPI,
	
	registerEnergyPack: registerStoragePack,
	requireGlobal: function(command){
		return eval(command);
	}
});

Logger.Log("Industrial Core API shared with name ICore.", "API");