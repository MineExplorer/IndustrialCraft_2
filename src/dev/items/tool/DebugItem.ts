class DebugItem
extends ElectricItem
implements ItemFuncs {
	constructor() {
		super("debugItem", "debug_item", -1, -1, 0, !ConfigIC.debugMode);
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
		Game.message(block.id+":"+block.data);
		let region = WorldRegion.getForActor(player);
		var tile = region.getTileEntity(coords);
		if (tile) {
			var liquid = tile.liquidStorage.getLiquidStored();
			if (liquid) {
				Game.message(liquid + " - " + tile.liquidStorage.getAmount(liquid)*1000 + "mB");
			}
			for (var i in tile.data) {
				if (i != "energy_storage") {
					if (i == "__liquid_tanks") {
						var tanks = tile.data[i];
						Game.message(tanks.input.liquid + ": "+ tanks.input.amount*1000 + "mB");
						Game.message(tanks.output.liquid + ": "+ tanks.output.amount*1000 + "mB");
					}
					else if (i == "energy") {
						Game.message("energy: " + tile.data[i] + "/" + tile.getEnergyStorage());
					}
					else try {
						Game.message(i + ": " + tile.data[i]);
					} catch(e) {
						Game.message(i);
					}
				}
			}
		}
		tile = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
		if (tile) {
			for (var i in tile.__energyNets) {
				var net = tile.__energyNets[i];
				if (net) Game.message(net.toString());
			}
		} else {
			var net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
			if (net) Game.message(net.toString());
		}
	}

	onNoTargetUse(item: ItemInstance, player: number): void {
		let tag = Entity.getCompoundTag(player);
		let tagData = tag.toScriptable();
		for (let key in tagData) {
			Game.message(`${key} (${tag.getValueType(key)}) - ${tagData[key]}`);
		}
	}
}

new DebugItem();