class ItemTransmitter extends ItemCommon
implements ItemBehavior {
	constructor() {
		super("freqTransmitter", "frequency_transmitter", "frequency_transmitter");
		this.setMaxStack(1);
		this.setCategory(ItemCategory.EQUIPMENT);
	}

	onNameOverride(item: ItemInstance, name: string): string {
		let extra = item.extra;
		if (extra) {
			name += `\n§7x: ${extra.getInt("x")}, y: ${extra.getInt("y")}, z: ${extra.getInt("z")}`;
		}
		return name;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		let client = Network.getClientForPlayer(player);
		if (!client) return;

		let receiveCoords: Vector;
		let dimension = Entity.getDimension(player);
		let extra = item.extra;
		if (extra) {
			receiveCoords = {x: extra.getInt("x"), y: extra.getInt("y"), z: extra.getInt("z")};
		} else {
			extra = new ItemExtraData();
		}

		if (block.id == BlockID.teleporter) {
			if (!receiveCoords) {
				extra.putInt("x", coords.x);
				extra.putInt("y", coords.y);
				extra.putInt("z", coords.z);
				extra.putInt("dimension", dimension);
				Entity.setCarriedItem(player, item.id, 1, item.data, extra);
				BlockEngine.sendMessage(client, "message.freq_transmitter.linked");
			}
			else {
				if (dimension != extra.getInt("dimension")) return;
				if (receiveCoords.x == coords.x && receiveCoords.y == coords.y && receiveCoords.z == coords.z) {
					BlockEngine.sendMessage(client, "message.freq_transmitter.notlinked");
				}
				else {
					let region = WorldRegion.getForActor(player);
					let data = region.getTileEntity(coords).data;
					let distance = Entity.getDistanceBetweenCoords(coords, receiveCoords);
					let basicTeleportCost = Math.floor(5 * Math.pow((distance+10), 0.7));
					let receiver = region.getTileEntity(receiveCoords);
					if (receiver) {
						data.frequency = receiveCoords;
						data.frequency.energy = basicTeleportCost;
						data = receiver.data;
						data.frequency = coords;
						data.frequency.energy = basicTeleportCost;
						BlockEngine.sendMessage(client, "message.freq_transmitter.established");
					}
				}
			}
		}
		else if (receiveCoords) {
			Entity.setCarriedItem(player, item.id, 1, item.data);
			BlockEngine.sendMessage(client, "message.freq_transmitter.unlinked");
		}
	}
}
