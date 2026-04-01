/// <reference path="../ElectricMachine.ts" />

namespace Machine {
	export class Transformer extends ElectricMachine {
		readonly tier: number

		constructor(tier: number, defaultDrop?: number) {
			super();
			this.tier = tier;
			this.defaultDrop = defaultDrop;
		}

		defaultValues = {
			energy: 0,
			increaseMode: false
		}

		getScreenName(): string {
			return null;
		}

		getTier(): number {
			return this.tier;
		}

		getEnergyCapacity(): number {
			return this.getMaxPacketSize();
		}

		energyTick(type: string, src: EnergyTileNode): void {
			const maxPacketSize = this.getMaxPacketSize();
			if (this.data.increaseMode) {
				if (this.data.energy >= maxPacketSize) {
					// Use addPacket to ignore buffer
					const energyAdd = src.addPacket("Eu", maxPacketSize);
					this.data.energy -= energyAdd;
				}
			}
			else {
				if (this.data.energy >= maxPacketSize / 4) {
					const energyAdd = src.addPacket("Eu", this.data.energy, maxPacketSize / 4);
					this.data.energy -= energyAdd;
				}
			}
		}

		isEnergyProducer(): boolean {
			return true;
		}

		onRedstoneUpdate(signal: number): void {
			const newMode = signal > 0;
			if (this.data.increaseMode != newMode) {
				this.data.increaseMode = newMode;
				this.rebuildGrid();
			}
		}

		canReceiveEnergy(side: number): boolean {
			if (side == this.getFacing()) {
				return !this.data.increaseMode;
			}
			return this.data.increaseMode;
		}

		canEmitEnergy(side: number): boolean {
			if (side == this.getFacing()) {
				return this.data.increaseMode;
			}
			return !this.data.increaseMode;
		}

		canRotate(): boolean {
			return true;
		}

		setFacing(side: number): boolean {
			if (super.setFacing(side)) {
				this.rebuildGrid();
				return true;
			}
			return false;
		}
	}
}