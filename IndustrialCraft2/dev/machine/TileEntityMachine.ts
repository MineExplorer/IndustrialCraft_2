abstract class TileEntityMachine
extends TileEntityBase {

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
		if (item.id == ItemID.debugItem || item.id == ItemID.EUMeter) return true;
		return false;
	}
	
	destroy(): boolean {
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		return false;
	}
}