/// <reference path="ElectricMachine.ts" />

namespace Machine {
	export abstract class Generator
	extends ElectricMachine {
		canReceiveEnergy(): boolean {
			return false;
		}

		isEnergySource(): boolean {
			return true;
		}

		energyTick(type: string, src: any): void {
			super.energyTick(type, src);
			var output = Math.min(this.data.energy, this.getMaxPacketSize());
			this.data.energy += src.add(output) - output;
		}
	}
}