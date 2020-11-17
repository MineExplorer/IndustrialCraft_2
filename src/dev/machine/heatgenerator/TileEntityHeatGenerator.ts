/// <reference path="../TileEntityMachine.ts" />

abstract class TileEntityHeatGenerator
extends TileEntityMachine {
	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
		if (ICTool.isWrench(item.id)) {
			ICTool.rotateMachine(this, coords.side, item, player)
			return true;
		}
		return super.onItemUse(coords, item, player);
	}

	spreadHeat(heat: number): number {
		var side = this.getFacing();
		var coords = StorageInterface.getRelativeCoords(this, side);
		var TE = World.getTileEntity(coords.x, coords.y, coords.z, this.blockSource);
		if (TE && TE.canReceiveHeat && TE.canReceiveHeat(side ^ 1)) {
			this.data.output = TE.heatReceive(heat);
		} else {
			this.data.output = 0;
		}
		return this.data.output;
	}
}