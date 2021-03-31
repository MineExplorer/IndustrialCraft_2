class UpgradeMFSU extends ItemCommon
implements ItemBehavior {
	constructor() {
		super("upgradeMFSU", "mfsu_upgrade", "mfsu_upgrade");
		this.setCategory(ItemCategory.EQUIPMENT);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number) {
		if (block.id == BlockID.storageMFE) {
			let region = WorldRegion.getForActor(player);
			let tile = region.getTileEntity(coords);
			tile.selfDestroy();
			region.setBlock(coords, BlockID.storageMFSU, tile.getFacing());
			let newTile = region.addTileEntity(coords);
			newTile.data = tile.data;
			Entity.setCarriedItem(player, item.id, item.count - 1, 0);
		}
	}
}