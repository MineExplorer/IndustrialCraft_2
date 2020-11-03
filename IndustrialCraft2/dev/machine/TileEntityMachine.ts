abstract class TileEntityMachine
extends TileEntityBase {

	constructor() {
		super();
		
		// audio
		if (this.getOperationSound) {
			this.audioSource = null;
			this.finishingSound = 0;

			if (!this.getStartingSound) {
				this.getStartingSound = function() {return null;}
			}

			if (!this.getInterruptSound) {
				this.getInterruptSound = function() {return null;}
			}
			
			this.startPlaySound = this.startPlaySound || function() {
				if (!ConfigIC.machineSoundEnabled) return;
				if (!this.audioSource && !this.remove) {
					if (this.finishingSound != 0) {
						SoundManager.stop(this.finishingSound);
					}
					if (this.getStartingSound()) {
						this.audioSource = SoundManager.createSource(AudioSource.TILEENTITY, this, this.getStartingSound());
						this.audioSource.setNextSound(this.getOperationSound(), true);
					} else {
						this.audioSource = SoundManager.createSource(AudioSource.TILEENTITY, this, this.getOperationSound());
					}
				}
			}
			
			this.stopPlaySound = this.stopPlaySound || function() {
				if (this.audioSource) {
					SoundManager.removeSource(this.audioSource);
					this.audioSource = null;
					if (this.getInterruptSound()) {
						this.finishingSound = SoundManager.playSoundAtBlock(this, this.getInterruptSound());
					}
				}
			}
		}

		// machine activation
		if (this.defaultValues && this.defaultValues.isActive !== undefined) {
			if (!this.renderModel) {
				this.renderModel = this.renderModelWithRotation;
			}
			
			this.setActive = this.setActive || this.setActive;
			
			this.activate = this.activate || function() {
				this.setActive(true);
			}
			this.deactivate = this.deactivate || function() {
				this.setActive(false);
			}
			
		}
		
		if (!this.init && this.renderModel) {
			this.init = this.renderModel;
		}
		
	}

	onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates) {
		if (id == ItemID.debugItem || id == ItemID.EUMeter) return false;
		return super.onItemClick(id, count, data, coords);
	}
	
	destroy(): boolean {
		BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
		return false;
	}
}