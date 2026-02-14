class ItemWindMeter extends ItemElectric
implements ItemBehavior {
	energyPerUse = 50;

	constructor() {
		super("windMeter", "wind_meter", 10000, 100, 1);
	}

	onNoTargetUse(item: ItemStack, player: number): void {
		const playerCoords = Entity.getPosition(player);
		this.measureWindAt(playerCoords, item, player);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		this.measureWindAt(coords, item, player);
	}

	measureWindAt(coords: Vector, item: ItemInstance, player: number): void {
		const client = Network.getClientForPlayer(player);
		if (client && ICTool.useElectricItem(item, this.energyPerUse, player)) {
			const blockSource = BlockSource.getDefaultForActor(player);
			let windStrength = WindSim.getWindAt(blockSource, coords.x, coords.y, coords.z);
			windStrength = Math.round(windStrength * 100) / 100;
			client.sendMessage(`Wind Strength: ${windStrength} MCW`);
		}
	}
}
