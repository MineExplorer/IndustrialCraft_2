/// <reference path="ElectricMachine.ts" />

namespace Machine {
	export abstract class Generator
	extends ElectricMachine {
		defaultDrop = BlockID.primalGenerator;

		isGenerator(): boolean {
			return true;
		}

		canReceiveEnergy(): boolean {
			return false;
		}

		canEmitEnergy(): boolean {
			return true;
		}

		energyTick(type: string, src: EnergyTileNode): void {
			const output = Math.min(this.data.energy, this.getMaxPacketSize());
			this.data.energy += src.add(output) - output;
		}
	}
}