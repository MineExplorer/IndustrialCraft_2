/// <reference path="IWrenchable.ts" />

namespace Machine {
	export const {ClientSide, NetworkEvent, ContainerEvent} = BlockEngine.Decorators;

	export abstract class MachineBase
	extends TileEntityBase
	implements IWrenchable {
		upgrades?: string[];
		defaultDrop?: number;

		onInit(): void {
			this.setupContainer();
			delete this.liquidStorage;
		}

		setupContainer(): void {}

		addLiquidTank(name: string, limit: number, liquids?: string[]) {
			const tank = new BlockEngine.LiquidTank(this, name, limit, liquids);
			const liquid = this.liquidStorage.getLiquidStored();
			if (liquid) {
				const amount = this.liquidStorage.getLiquid(liquid, tank.getLimit() / 1000);
				tank.addLiquid(liquid, Math.round(amount * 1000));
			}
			return tank;
		}

		canRotate(side: number): boolean {
			return false;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (item.id == ItemID.debugItem) return true;
			let side = coords.side;
			if (Entity.getSneaking(player)) {
				side ^= 1;
			}
			if (this.canRotate(side) && ICTool.isUseableWrench(item, 1)) {
				ICTool.rotateMachine(this, side, item, player);
				return true;
			}
			return false;
		}

		setActive(isActive: boolean): void {
			// TODO: sounds
			if (this.networkData.getBoolean(NetworkDataKeys.isActive) !== isActive) {
				this.networkData.putBoolean(NetworkDataKeys.isActive, isActive);
				this.networkData.sendChanges();
			}
		}

		@ClientSide
		renderModel(): void {
			if (this.networkData.getBoolean(NetworkDataKeys.isActive)) {
				const region = BlockSource.getCurrentClientRegion();
				const block = region.getBlock(this.x, this.y, this.z);
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

		decreaseSlot(slot: ItemContainerSlot, count: number): void {
			slot.count -= count;
			slot.markDirty();
			slot.validate();
		}

		getDefaultDrop(): number {
			return this.defaultDrop ?? this.blockID;
		}

		adjustDrop(item: ItemInstance): ItemInstance {
			return item;
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
			/*if (!IC2Config.machineSoundEnabled) return;
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
			}*/
		}

		stopPlaySound(): void {
			/*if (this.audioSource) {
				SoundManager.removeSource(this.audioSource);
				this.audioSource = null;
				if (this.getInterruptSound()) {
					this.finishingSound = SoundManager.playSoundAtBlock(this, this.getInterruptSound(), 1);
				}
			}*/
		}
	}
}