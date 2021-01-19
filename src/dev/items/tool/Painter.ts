class ItemPainter
extends ItemCommon {
	readonly color: number;

	constructor(colorIndex: number) {
		let itemIndex = colorIndex + 1;
		super("icPainter" + itemIndex, "painter." + colorIndex, {name: "ic_painter", meta: itemIndex});
		this.setMaxStack(1);
		this.setMaxDamage(16);
		this.setCategory(ItemCategory.EQUIPMENT);
		this.color = colorIndex;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		if (CableRegistry.canBePainted(block.id) && block.data != this.color) {
			let region = WorldRegion.getForActor(player);
			region.setBlock(coords, 0, 0);
			region.setBlock(coords, block.id, this.color);
			let net = EnergyNetBuilder.getNetOnCoords(coords.x, coords.y, coords.z);
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
