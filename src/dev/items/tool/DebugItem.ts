class DebugItem
extends ElectricItem
implements ItemFuncs {
	constructor() {
		super("debugItem", "debug_item", "debug_item", -1, -1, 0, !ConfigIC.debugMode);
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

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void {
		let client = Network.getClientForPlayer(player);
		if (!client) return;

		client.sendMessage(block.id+":"+block.data);
		let region = WorldRegion.getForActor(player);
		var tile = region.getTileEntity(coords);
		if (tile) {
			var liquid = tile.liquidStorage.getLiquidStored();
			if (liquid) {
				client.sendMessage(liquid + " - " + tile.liquidStorage.getAmount(liquid)*1000 + "mB");
			}
			for (var i in tile.data) {
				if (i != "energy_storage") {
					if (i == "__liquid_tanks") {
						var tanks = tile.data[i];
						client.sendMessage(tanks.input.liquid + ": "+ tanks.input.amount*1000 + "mB");
						client.sendMessage(tanks.output.liquid + ": "+ tanks.output.amount*1000 + "mB");
					}
					else if (i == "energy") {
						client.sendMessage("energy: " + tile.data[i] + "/" + tile.getEnergyStorage());
					}
					else try {
						client.sendMessage(i + ": " + tile.data[i]);
					} catch(e) {
						client.sendMessage(i);
					}
				}
			}
		}
		tile = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
		if (tile) {
			for (var i in tile.__energyNets) {
				var net = tile.__energyNets[i];
				if (net) client.sendMessage(net.toString());
			}
		} else {
			var net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
			if (net) client.sendMessage(net.toString());
		}
	}
}

new DebugItem();