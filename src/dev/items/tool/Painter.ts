const colorNames = ["Black", "Red", "Green", "Brown", "Blue", "Purple", "Cyan", "Light Grey", "Dark Grey", "Pink", "Lime", "Yellow", "Light Blue", "Magenta", "Orange", "White"];

class ItemPainter
extends ItemIC2 {
	readonly color: number;

	constructor(color: number) {
		let name = colorNames[color] + " Painter";
		let itemIndex = color + 1;
		super("icPainter" + itemIndex, name, {name: "ic_painter", meta: itemIndex});
		this.setMaxStack(1);
		this.setMaxDamage(16);
		this.setCategory(ItemCategory.EQUIPMENT);
		this.color = color;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
		if (CableRegistry.canBePainted(block.id) && block.data != this.color) {
			let region = WorldRegion.getForActor(player);
			region.setBlock(coords, 0, 0);
			region.setBlock(coords, block.id, this.color);
			var net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
			if (net) {
				EnergyNetBuilder.removeNet(net);
				EnergyNetBuilder.rebuildForWire(coords.x, coords.y, coords.z, block.id);
			}
			if (Game.isItemSpendingAllowed(player)) {
				if (++item.data >= Item.getMaxDamage(item.id))
					item.id = ItemID.icPainter;
				Entity.setCarriedItem(player, item.id, 1, item.data);
			}
			SoundManager.playSoundAt(coords.x + .5, coords.y + .5, coords.z + .5, "Painters.ogg");
		}
	}
}
