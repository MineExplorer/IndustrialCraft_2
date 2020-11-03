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
		this.data.last_energy_receive = this.data.energy_receive;
		this.data.energy_receive = 0;
		this.data.last_voltage = this.data.voltage;
		this.data.voltage = 0;
		var output = this.getMaxPacketSize();
		if (this.data.energy >= output) {
			this.data.energy += src.add(output) - output;
		}
	}
}