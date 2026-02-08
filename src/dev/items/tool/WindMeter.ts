class ItemWindMeter extends ItemElectric
implements ItemBehavior {
	energyPerUse = 50;

	constructor() {
		super("windMeter", "wind_meter", 10000, 100, 1);
	}

	onNoTargetUse(item: ItemStack, player: number): void {
		const client = Network.getClientForPlayer(player);
		if (client && ICTool.useElectricItem(item, this.energyPerUse, player)) {
			const blockSource = BlockSource.getDefaultForActor(player);
			const pos = Entity.getPosition(player);
			let windStrength = WindSim.getWindAt(blockSource, Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
			windStrength = Math.round(windStrength * 100) / 100;
			client.sendMessage(`Wind Strength: ${windStrength} MCW`);
		}
	}
}
