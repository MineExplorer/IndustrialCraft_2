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
		}

		setupContainer(): void {}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			return (item.id == ItemID.debugItem);
		}

		setActive(isActive: boolean): void {
			// TODO: sounds
			if (this.networkData.getBoolean("isActive") != isActive) {
				this.networkData.putBoolean("isActive", isActive);
				this.networkData.sendChanges();
			}
		}

		@ClientSide()
		renderModel(): void {
			if (this.networkData.getBoolean("isActive")) {
				let block = World.getBlock(this.x, this.y, this.z);
				TileRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
			} else {
				BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
			}
		}

		clientLoad(): void {
			this.renderModel();
			this.networkData.addOnDataChangedListener((data, isExternal) => {
				this.renderModel();
			});
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