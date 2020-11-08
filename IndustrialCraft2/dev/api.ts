ModAPI.registerAPI("ICore", {
	Machine: MachineRegistry,
	Recipe: MachineRecipeRegistry,
	ChargeRegistry: ChargeItemRegistry,
	Cable: CableRegistry,
	Upgrade: UpgradeAPI,
	Reactor: ReactorAPI,
	Radiation: RadiationAPI,
	Tool: ICTool,
	Sound: SoundManager,
	Agriculture: AgricultureAPI,
	ItemName: ItemName,
	UI: UIbuttons,
	Utils: Utils,
	ConfigIC: ConfigIC,
	Ore: OreGenerator,
	Integration: IntegrationAPI,
	
	registerEnergyPack: function(){}, // deprecated
	requireGlobal: function(command: string) {
		return eval(command);
	}
});

Logger.Log("Industrial Core API shared with name ICore.", "API");