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

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void {
		let client = Network.getClientForPlayer(player);
		if (!client) return;

		client.sendMessage(block.id+":"+block.data);
		let region = WorldRegion.getForActor(player);
		let tile = region.getTileEntity(coords);
		if (tile) {
			let liquid = tile.liquidStorage.getLiquidStored();
			if (liquid) {
				client.sendMessage(liquid + " - " + tile.liquidStorage.getAmount(liquid)*1000 + "mB");
			}
			for (let i in tile.data) {
				if (i != "energy_storage") {
					if (i == "__liquid_tanks") {
						let tanks = tile.data[i];
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
			for (let i in tile.__energyNets) {
				let net = tile.__energyNets[i];
				if (net) client.sendMessage(net.toString());
			}
		} else {
			let net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
			if (net) client.sendMessage(net.toString());
		}
	}
}
