namespace Machine {
	export let ClientSide = BlockEngine.Decorators.ClientSide;
	export let NetworkEvent = BlockEngine.Decorators.NetworkEvent;
	export let ContainerEvent = BlockEngine.Decorators.ContainerEvent;

	export abstract class MachineBase
	extends TileEntityBase {
		upgrades?: string[];
		defaultDrop?: number;

		init(): void {
			super.init();
			if (this.data.meta !== undefined) {
				Logger.Log(`Update tile with ID ${this.blockID}, data ${this.data.meta}`, "IC2");
				let facing = this.data.meta;
				if (!this.isWrenchable()) facing += 2;
				this.setFacing(facing);
				delete this.data.meta;
			}
			this.networkData.putInt("blockId", this.blockID);
			this.networkData.putInt("blockData", this.getFacing());
			this.networkData.sendChanges();
			this.setupContainer();
		}

		setupContainer(): void {}

		isWrenchable(): boolean {
			return false;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (item.id == ItemID.debugItem) return true;
			if (this.isWrenchable() && ICTool.isUseableWrench(item, 1)) {
				ICTool.rotateMachine(this, coords.side, item, player);
				return true;
			}
			return false;
		}

		setActive(isActive: boolean): void {
			// TODO: sounds
			if (this.networkData.getBoolean("isActive") !== isActive) {
				this.networkData.putBoolean("isActive", isActive);
				this.networkData.sendChanges();
			}
		}

		@ClientSide
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

		decreaseSlot(slot: ItemContainerSlot, count: number): void {
			slot.count -= count;
			slot.markDirty();
			slot.validate();
		}

		getDefaultDrop(): number {
			return this.defaultDrop ?? this.blockID;
		}

		getDropItem(player: number): ItemInstance {
			let item = Entity.getCarriedItem(player);
			let dropID = 0;
			if (ICTool.isUseableWrench(item, 10)) {
				ICTool.useWrench(item, 10, player);
				let chance = ICTool.getWrenchData(item.id).dropChance;
				if (Math.random() < chance) {
					dropID = this.blockID;
				} else {
					dropID = this.getDefaultDrop();
				}
			}
			else if (ToolAPI.getToolLevelViaBlock(item.id, this.blockID) > 0) {
				dropID = this.getDefaultDrop();
			}
			return dropID ? new ItemStack(dropID, 1, 0) : null;
		}

		destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
			let item = this.getDropItem(player);
			if (item) {
				this.region.dropItem(this.x + .5, this.y + .5, this.z + .5, item.id, item.count, item.data, item.extra);
			}
		}

		// Audio
		audioSource: AudioSource;
		finishingSound: number;

		getOperationSound(): string {
			return null;
		}

		getStartingSound(): string {
			return null;
		}

		getInterruptSound(): string {
			return null;
		}

		startPlaySound(): void {
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

		stopPlaySound(): void {
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