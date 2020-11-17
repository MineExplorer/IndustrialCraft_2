/// <reference path="./TileEntityElectricMachine.ts" />

class TileEntityGenerator
extends TileEntityElectricMachine {
	canReceiveEnergy() {
		return false;
	}

	isEnergySource() {
		return true;
	}
	
	energyTick(type: string, src: any) {
		super.energyTick(type, src);
		var output = Math.min(this.data.energy, this.getMaxPacketSize());
		this.data.energy += src.add(output) - output;
	}
}