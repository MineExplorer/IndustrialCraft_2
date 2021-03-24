class DebugItem
extends ItemElectric {
	canProvideEnergy: boolean = true;

	constructor() {
		super("debugItem", "debug_item", -1, -1, 0, false);
		if (ConfigIC.debugMode) Item.addToCreative(this.id, 1, 0);
	}

	onCharge(item: ItemInstance, amount: number, tier: number): number {
		return amount;
	}

	onDischarge(item: ItemInstance, amount: number, tier: number): number {
		return amount;
	}

	onNameOverride(item: ItemInstance, name: string): string {
		return name + "\n§7" + "Infinite EU";
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		let client = Network.getClientForPlayer(player);
		if (!client) return;

		client.sendMessage(block.id+":"+block.data);
		let region = WorldRegion.getForActor(player);
		let tile = region.getTileEntity(coords);
		if (tile) {
			let liquid = tile.liquidStorage?.getLiquidStored();
			if (liquid) {
				client.sendMessage(`${liquid} - ${tile.liquidStorage.getAmount(liquid)*1000} mB`);
			}
			for (let key in tile.data) {
				let value = tile.data[key];
				if (key == "energy") {
					client.sendMessage(`energy: ${value}/${tile.getEnergyStorage()}`);
				}
				else try {
					if (typeof value == "object") {
						client.sendMessage(key + ": " + JSON.stringify(value));
					} else {
						client.sendMessage(key + ": " + value);
					}
				} catch(e) {
					client.sendMessage(key);
				}
			}
		}

		let node = EnergyNet.getNodeOnCoords(region.blockSource, coords.x, coords.y, coords.z);
		if (node) client.sendMessage(node.toString());
	}
}
