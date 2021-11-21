class ItemWindMeter extends ItemElectric
implements ItemBehavior {
	energyPerUse = 50;

	constructor() {
		super("windMeter", "wind_meter", 10000, 100, 1);
	}

	onNoTargetUse(item: ItemStack, player: number): void {
		let client = Network.getClientForPlayer(player);
		if (client && ICTool.useElectricItem(item, this.energyPerUse, player)) {
			const height = Entity.getPosition(player).y;
			const windStrength = Math.round(WindSim.getWindAt(height) * 100) / 100;
			client.sendMessage(`Wind Strength: ${windStrength} MCW`);
		}
	}
}
