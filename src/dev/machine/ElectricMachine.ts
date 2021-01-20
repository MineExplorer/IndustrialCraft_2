/// <reference path="MachineBase.ts" />

namespace Machine {
	export abstract class ElectricMachine
	extends MachineBase {
		energy_receive: number = 0;
		last_energy_receive: number = 0;
		voltage: number = 0;
		last_voltage: number = 0;

		defaultValues = {
			energy: 0
		};
		data: this["defaultValues"];

		constructor() {
			super();
		}

		getTier(): number {
			return 1;
		}

		getEnergyStorage(): number {
			return 0;
		}

		getMaxPacketSize(): number {
			return 8 << this.getTier()*2;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			return (item.id == ItemID.debugItem || item.id == ItemID.EUMeter);
		}

		energyTick(type: string, src: any): void {
			this.last_energy_receive = this.energy_receive;
			this.energy_receive = 0;
			this.last_voltage = this.voltage;
			this.voltage = 0;
		}

		energyReceive(type: string, amount: number, voltage: number): number {
			var maxVoltage = this.getMaxPacketSize();
			if (voltage > maxVoltage) {
				if (ConfigIC.voltageEnabled) {
					this.blockSource.setBlock(this.x, this.y, this.z, 0, 0);
					this.blockSource.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.getExplosionPower(), true);
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
}