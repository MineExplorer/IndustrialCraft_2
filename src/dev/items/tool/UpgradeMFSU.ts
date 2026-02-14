class UpgradeMFSU extends ItemCommon
implements ItemBehavior {
	constructor() {
		super("upgradeMFSU", "mfsu_upgrade", "mfsu_upgrade");
		this.setCategory(ItemCategory.EQUIPMENT);
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number) {
		if (block.id == BlockID.storageMFE || block.id == BlockID.chargepadMFE) {
			const region = WorldRegion.getForActor(player);
			const tile = region.getTileEntity(coords);
			tile.selfDestroy();
			const newBlockId = block.id == BlockID.storageMFE ? BlockID.storageMFSU : BlockID.chargepadMFSU;
			region.setBlock(coords, newBlockId, tile.getFacing());
			const newTile = region.addTileEntity(coords);
			newTile.data = tile.data;
			Entity.setCarriedItem(player, item.id, item.count - 1, 0);
		}
	}
}