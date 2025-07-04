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
	Sound: SoundLib,
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

Logger.Log(`IndustrialCraft2 loading finished in ${(Debug.sysTime() - startTime)} ms`, "INFO");

ModAPI.registerAPI("ICore", ICore);

Logger.Log("Industrial Core API shared with name ICore.", "API");