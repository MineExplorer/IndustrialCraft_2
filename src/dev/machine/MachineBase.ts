namespace Machine {
	export let ClientSide = BlockEngine.Decorators.ClientSide;
	export let NetworkEvent = BlockEngine.Decorators.NetworkEvent;
	export let ContainerEvent = BlockEngine.Decorators.ContainerEvent;

	export abstract class MachineBase
	extends TileEntityBase {
		region: WorldRegion;
		hasVerticalRotation: boolean = false;
		upgrades?: string[];

		init(): void {
			this.region = new WorldRegion(this.blockSource);
			if (this.data.meta !== undefined) {
				Logger.Log(`Update tile with ID ${this.blockID}, data ${this.data.meta}`, "IC2");
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
		renderModel(data: {isActive: boolean}): void {
			if (data.isActive) {
				let blockData = this.blockSource.getBlockData(this.x, this.y, this.z);
				TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, blockData);
			} else {
				BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
			}
		}

		clientUnload(): void {
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

		decreaseSlot(slot: ItemContainerSlot, count: number) {
			slot.count -= count;
			slot.markDirty();
			slot.validate();
		}
	}
}