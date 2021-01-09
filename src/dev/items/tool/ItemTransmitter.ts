class ItemTransmitter
extends ItemIC2 {
	constructor() {
		super("freqTransmitter", "Frequency Transmitter", "frequency_transmitter");
		this.setMaxStack(1);
	}

	onNameOverride(name: string, item: ItemInstance) {
		if (item.extra) {
			var x = item.extra.getInt("x");
			var y = item.extra.getInt("y");
			var z = item.extra.getInt("z");
			name += "\n§7x: " + x + ", y: " + y + ", z: " + z;
		}
		return name;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
		let client = Network.getClientForPlayer(player);
		if (!client) return;

		var receiveCoords: Vector;
		var extra = item.extra;
		if (!extra) {
			extra = new ItemExtraData();
		} else {
			var x = extra.getInt("x");
			var y = extra.getInt("y");
			var z = extra.getInt("z");
			receiveCoords = {x: x, z: z, y: y};
		}

		if (block.id == BlockID.teleporter) {
			if (!receiveCoords) {
				extra.putInt("x", coords.x);
				extra.putInt("y", coords.y);
				extra.putInt("z", coords.z);
				Entity.setCarriedItem(player, item.id, 1, item.data, extra);
				client.sendMessage("Frequency Transmitter linked to Teleporter");
			}
			else {
				if (x == coords.x && y == coords.y && z == coords.z) {
					client.sendMessage("Can`t link Teleporter to itself");
				}
				else {
					let region = WorldRegion.getForActor(player);
					var data = region.getTileEntity(coords).data;
					var distance = Entity.getDistanceBetweenCoords(coords, receiveCoords);
					var basicTeleportCost = Math.floor(5 * Math.pow((distance+10), 0.7));
					var receiver = region.getTileEntity(x, y, z);
					if (receiver) {
						data.frequency = receiveCoords;
						data.frequency.energy = basicTeleportCost;
						data = receiver.data;
						data.frequency = coords;
						data.frequency.energy = basicTeleportCost;
						client.sendMessage("Teleportation link established");
					}
				}
			}
		}
		else if (receiveCoords) {
			Entity.setCarriedItem(player, item.id, 1, item.data);
			client.sendMessage("Frequency Transmitter unlinked");
		}
	}
}

new ItemTransmitter();

Recipes.addShaped({id: ItemID.freqTransmitter, count: 1, data: 0}, [
	"x",
	"#",
	"b"
], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.casingIron, 0]);
