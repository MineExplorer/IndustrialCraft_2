let ClientSide = BlockEngine.Decorators.ClientSide;
let NetworkEvent = BlockEngine.Decorators.NetworkEvent;
let ContainerEvent = BlockEngine.Decorators.ContainerEvent;

abstract class TileEntityMachine
extends TileEntityBase {
	hasVerticalRotation: boolean = false;

	init() {
		if (this.data.meta !== undefined) {
			Game.message(`Update tile with ID ${this.blockID}, data ${this.data.meta}`);
			let facing = this.data.meta;
			if (!this.hasVerticalRotation) facing += 2;
			this.setFacing(facing);
			delete this.data.meta;
		}
		this.setupContainer();
		this.sendPacket("renderModel", {isActive: this.data.isActive});
	}

	setupContainer(): void {}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
		return (item.id == ItemID.debugItem);
	}

	setActive(isActive: boolean) {
		if (this.data.isActive != isActive) {
			this.data.isActive = isActive;
			this.sendPacket("renderModel", {isActive: isActive});
		}
	}

	@NetworkEvent(Side.Client)
	renderModel(data: {isActive: boolean}) {
		if (data.isActive) {
			let blockData = this.blockSource.getBlockData(this.x, this.y, this.z);
			TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, blockData);
		} else {
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		}
	}

	clientUnload() {
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
	}

	getFacing(): number {
		return this.blockSource.getBlockData(this.x, this.y, this.z);
	}

	setFacing(side: number): boolean {
		if (this.getFacing() != side) {
			this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
			return true;
		}
		return false;
	}
}