namespace Machine {
	export let ClientSide = BlockEngine.Decorators.ClientSide;
	export let NetworkEvent = BlockEngine.Decorators.NetworkEvent;
	export let ContainerEvent = BlockEngine.Decorators.ContainerEvent;

	export abstract class MachineBase
	extends TileEntityBase {
		hasVerticalRotation: boolean = false;
		upgrades?: string[];

		init(): void {
			super.init();
			if (this.data.meta !== undefined) {
				Logger.Log(`Update tile with ID ${this.blockID}, data ${this.data.meta}`, "IC2");
				let facing = this.data.meta;
				if (!this.hasVerticalRotation) facing += 2;
				this.setFacing(facing);
				delete this.data.meta;
			}
			this.networkData.putInt("blockId", this.blockID);
			this.networkData.putInt("blockData", this.getFacing());
			this.networkData.sendChanges();
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
				let blockId = Network.serverToLocalId(this.networkData.getInt("blockId"));
				let blockData = this.networkData.getInt("blockData");
				TileRenderer.mapAtCoords(this.x, this.y, this.z, blockId, blockData);
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
				this.networkData.putInt("blockData", side);
				this.networkData.sendChanges();
				return true;
			}
			return false;
		}

		decreaseSlot(slot: ItemContainerSlot, count: number) {
			slot.count -= count;
			slot.markDirty();
			slot.validate();
		}

		// Audio
		audioSource: AudioSource;
		finishingSound: number;

		getOperationSound() {
			return null;
		}

		getStartingSound() {
			return null;
		}

		getInterruptSound() {
			return null;
		}

		startPlaySound() {
			if (!ConfigIC.machineSoundEnabled) return;
			if (!this.audioSource && !this.remove) {
				if (this.finishingSound != 0) {
					SoundManager.stop(this.finishingSound);
				}
				if (this.getStartingSound()) {
					this.audioSource = SoundManager.createSource(SourceType.TILEENTITY, this, this.getStartingSound());
					//this.audioSource.setNextSound(this.getOperationSound(), true);
				} else if (this.getOperationSound()) {
					this.audioSource = SoundManager.createSource(SourceType.TILEENTITY, this, this.getOperationSound());
				}
			}
		}

		stopPlaySound() {
			if (this.audioSource) {
				SoundManager.removeSource(this.audioSource);
				this.audioSource = null;
				if (this.getInterruptSound()) {
					this.finishingSound = SoundManager.playSoundAtBlock(this, this.getInterruptSound(), 1);
				}
			}
		}
	}
}