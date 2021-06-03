const ICore = {
	Machine: MachineRegistry,
	Recipe: MachineRecipeRegistry,
	Render: TileRenderer,
	ChargeRegistry: ChargeItemRegistry,
	Cable: CableRegistry,
	Upgrade: UpgradeAPI,
	ReactorItem: ReactorItem,
	Radiation: RadiationAPI,
	Tool: ICTool,
	Sound: SoundManager,
	Agriculture: Agriculture,
	ItemName: ItemName,
	UI: ToolHUD,
	Config: IC2Config,
	Ore: OreGenerator,
	Integration: IntegrationAPI,
	WindSim: WindSim,

	requireGlobal: function(command: string) {
		return eval(command);
	}
}

ModAPI.registerAPI("ICore", ICore);

Logger.Log("Industrial Core API shared with name ICore.", "API");