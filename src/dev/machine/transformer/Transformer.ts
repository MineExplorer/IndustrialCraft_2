/// <reference path="../ElectricMachine.ts" />

namespace Machine {
	export class Transformer 
	extends ElectricMachine {
		hasVerticalRotation: boolean = true;

		defaultValues = {
			energy: 0,
			increaseMode: false
		}

		getEnergyStorage(): number {
			return this.getMaxPacketSize();
		}

		energyTick(type: string, src: any): void {
			this.data.last_energy_receive = this.data.energy_receive;
			this.data.energy_receive = 0;
			this.data.last_voltage = this.data.voltage;
			this.data.voltage = 0;
		
			var maxVoltage = this.getMaxPacketSize();
			if (this.data.increaseMode) {
				if (this.data.energy >= maxVoltage) {
					this.data.energy += src.add(maxVoltage, maxVoltage) - maxVoltage;
				}
			}
			else {
				if (this.data.energy >= maxVoltage/4) {
					var output = this.data.energy;
					this.data.energy += src.add(output, maxVoltage/4) - output;
				}
			}
		}

		redstone(signal: {power: number, signal: number, onLoad: boolean}): void {
			var newMode = signal.power > 0;
			if (newMode != this.data.increaseMode) {
				this.data.increaseMode = newMode;
				EnergyNetBuilder.rebuildTileNet(this);
			}
		}

		isEnergySource(): boolean {
			return true;
		}

		canReceiveEnergy(side: number): boolean {
			if (side == this.data.meta) {
				return !this.data.increaseMode;
			}
			return this.data.increaseMode;
		}

		canExtractEnergy(side: number): boolean {
			if (side == this.data.meta) {
				return this.data.increaseMode;
			}
			return !this.data.increaseMode;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (ICTool.isValidWrench(item)) {
				ICTool.rotateMachine(this, coords.side, item, player)
				return true;
			}
			return super.onItemUse(coords, item, player);
		}

		setFacing(side: number): boolean {
			if (super.setFacing(side)) {
				EnergyNetBuilder.rebuildTileNet(this);
				return true;
			}
			return false;
		}
	}
}