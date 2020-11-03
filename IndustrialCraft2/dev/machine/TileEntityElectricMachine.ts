/// <reference path="./TileEntityMachine.ts" />

abstract class TileEntityElectricMachine
extends TileEntityMachine {
	private readonly tier: number
	energy_receive: number = 0;
	last_energy_receive: number = 0;
	voltage: number = 0;
	last_voltage: number = 0;

	defaultValues = {
		energy: 0
	};

	constructor(tier: number) {
		super();
		this.tier = tier;
	}

	getTier(): number {
		return this.tier;
	}

	getEnergyStorage(): number {
		return 0;
	}
		
	energyTick(type: string, src: any): void {
		this.last_energy_receive = this.energy_receive;
		this.energy_receive = 0;
		this.last_voltage = this.voltage;
		this.voltage = 0;
	}
		
	getMaxPacketSize(): number {
		return 8 << this.getTier()*2;
	}
		
	energyReceive(type: string, amount: number, voltage: number): number {
		var maxVoltage = this.getMaxPacketSize();
		if (voltage > maxVoltage) {
			if (ConfigIC.voltageEnabled) {
				World.setBlock(this.x, this.y, this.z, 0, 0);
				World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.getExplosionPower(), true);
				SoundManager.playSoundAtBlock(this, "MachineOverload.ogg", 1, 32);
				this.selfDestroy();
				return 1;
			}
			var add = Math.min(maxVoltage, this.getEnergyStorage() - this.data.energy);
		} else {
			var add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
		}
		this.data.energy += add;
		this.energy_receive += add;
		this.voltage = Math.max(this.voltage, voltage);
		return add;
	}
		
	getExplosionPower(): number {
		return 1.2;
	}
}