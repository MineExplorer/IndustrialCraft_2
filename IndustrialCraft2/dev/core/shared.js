ModAPI.registerAPI("ICore", {
	Machine: MachineRegistry,
	Recipe: MachineRecipeRegistry,
	ChargeRegistry: ChargeItemRegistry,
	Cable: CableRegistry,
	Upgrade: UpgradeAPI,
	Reactor: ReactorAPI,
	Radiation: RadiationAPI,
	Tool: ICTool,
	Sound: ICAudioManager,
	Agriculture: AgricultureAPI,
	ItemName: ItemName,
	UI: UIbuttons,
	Utils: Utils,
	Config: Config,
	Ore: OreGenerator,
	Integration: IntegrationAPI,
	
	registerEnergyPack: registerStoragePack,
	requireGlobal: function(command){
		return eval(command);
	}
});

Logger.Log("Industrial Core API shared with name ICore.", "API");