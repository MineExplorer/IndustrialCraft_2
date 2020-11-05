/// <reference path="./TileEntityElectricMachine.ts" />

class TileEntityGenerator
extends TileEntityElectricMachine {
	canReceiveEnergy() {
		return false;
	}

	isEnergySource() {
		return true;
	}
	
	energyTick(type: string, src) {
		super.energyTick(type, src);
		var output = this.getMaxPacketSize();
		if (this.data.energy >= output) {
			this.data.energy += src.add(output) - output;
		}
	}
}