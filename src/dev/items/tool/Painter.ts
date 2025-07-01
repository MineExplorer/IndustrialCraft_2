class ItemPainter extends ItemCommon {
	readonly color: number;

	constructor(colorIndex: number) {
		const itemIndex = colorIndex + 1;
		const color = INDEX_TO_COLOR[colorIndex];
		super("icPainter" + itemIndex, "painter." + color, {name: "ic_painter", meta: itemIndex});
		this.setMaxStack(1);
		this.setMaxDamage(16);
		this.setCategory(ItemCategory.EQUIPMENT);
		this.color = colorIndex;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		if (CableRegistry.canBePainted(block.id) && block.data != this.color) {
			const region = BlockSource.getDefaultForActor(player);
			region.setBlock(coords.x, coords.y, coords.z, 0, 0);
			region.setBlock(coords.x, coords.y, coords.z, block.id, this.color);
			const node = EnergyNet.getNodeOnCoords(region, coords.x, coords.y, coords.z);
			if (node) {
				node.destroy();
				EnergyGridBuilder.rebuildForWire(region, coords.x, coords.y, coords.z, block.id);
			}
			if (Game.isItemSpendingAllowed(player)) {
				if (++item.data >= Item.getMaxDamage(item.id))
					item.id = ItemID.icPainter;
				Entity.setCarriedItem(player, item.id, 1, item.data);
			}
			SoundManager.playSoundAtBlock(coords, region.getDimension(), "Painters.ogg");
		}
	}
}
