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
			return new BlockEngine.LiquidTank(this, name, limit, liquids);
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
			if (this.networkData.getBoolean(NetworkDataKeys.isActive) !== isActive) {
				this.networkData.putBoolean(NetworkDataKeys.isActive, isActive);
				this.networkData.sendChanges();
			}
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

		/* Client prototype */
		audioSource: AudioSourceClient;
		wasActive: boolean;

		@ClientSide
		updateActivity(isActive: boolean): void {
			if (isActive) {
				const region = BlockSource.getCurrentClientRegion();
				const block = region.getBlock(this.x, this.y, this.z);
				TileRenderer.mapAtCoords(this.x, this.y, this.z, block.id, block.data);
				this.startPlaySound();
			} else {
				BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
				this.stopPlaySound();
			}
		}

		clientLoad(): void {
			if (IC2Config.soundEnabled) {
				this.audioSource = new AudioSourceClient({
					x: this.x + .5,
					y: this.y + .5,
					z: this.z + .5
				});
			}
			this.wasActive = this.networkData.getBoolean(NetworkDataKeys.isActive);
			this.updateActivity(this.wasActive);
		}

		clientUnload(): void {
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
			this.audioSource?.unload();
		}

		clientTick(): void {
			this.audioSource?.update();
			const isActive = this.networkData.getBoolean(NetworkDataKeys.isActive);
			if (this.wasActive != isActive) {
				this.updateActivity(isActive);
				this.wasActive = isActive;
			}
		}
		
		@ClientSide
		getOperationSound(): string {
			return null;
		}

		@ClientSide
		getStartingSound(): string {
			return null;
		}

		@ClientSide
		getFinishingSound(): string {
			return null;
		}

		@ClientSide
		startPlaySound(): void {
			if (!IC2Config.soundEnabled || !this.audioSource || this.remove) return;

			if (this.getFinishingSound()) {
				this.audioSource.stop(this.getFinishingSound());
			}
			
			const opSound = this.getOperationSound();
			if (this.getStartingSound()) {
				const stream = this.audioSource.play(this.getStartingSound());
				if (opSound) {
					if (stream) {
						stream.setOnCompleteEvent((source, stream) => {
                    		source.play(opSound, true, stream.volume, stream.radius);
						});
					}
					else {
						this.audioSource.play(opSound, true); // if failed to play starting sound set looping operation sound
					}
				}
			} else if (opSound) {
				this.audioSource.playSingle(opSound, true);
			}
		}

		@ClientSide
		stopPlaySound(): void {
			if (!IC2Config.soundEnabled || !this.audioSource || this.remove) return;
			
			let wasPlayingSound = false;
			if (this.getStartingSound()) {
				wasPlayingSound = this.audioSource.stop(this.getStartingSound());
			}
			if (this.getOperationSound()) {
				wasPlayingSound ||= this.audioSource.stop(this.getOperationSound());
			}
			if (wasPlayingSound && this.getFinishingSound()) {
				this.audioSource.play(this.getFinishingSound());
			}
		}

		/** @deprecated Network event, shouldn't be called */
		@NetworkEvent(Side.Client)
		playSound(packetData: {name: string, vol: number, rad: number}, packetExtra: any): void {
			if (!this.audioSource) return;
			const stream = this.audioSource.getStream(packetData.name);
			if (!stream) {
				this.audioSource.play(packetData.name, false, packetData.vol, packetData.rad);
			}
		}

		playOnce(soundName: string, volume: number = 1, radius: number = 16) {
			this.networkEntity.send("playSound", {name: soundName, vol: volume, rad: radius});
		}

		protected canStackBeMerged(inputStack: ItemInstance, outputStack: ItemInstance) {
			return outputStack.id == 0 || (outputStack.id == inputStack.id && outputStack.data == inputStack.data && 
				outputStack.count + inputStack.count <= Item.getMaxStack(outputStack.id, outputStack.data) &&
				outputStack.extra == inputStack.extra)
		}
	}
}