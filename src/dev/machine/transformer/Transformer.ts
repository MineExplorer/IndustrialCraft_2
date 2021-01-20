/// <reference path="../ElectricMachine.ts" />

namespace Machine {
	export class Transformer
	extends ElectricMachine {
		readonly hasVerticalRotation: boolean = true;
		readonly tier: number

		constructor(tier: number) {
			super();
			this.tier = tier;
		}

		defaultValues = {
			energy: 0,
			increaseMode: false
		}

		getTier(): number {
			return this.tier;
		}

		getEnergyStorage(): number {
			return this.getMaxPacketSize();
		}

		energyTick(type: string, src: any): void {
			this.last_energy_receive = this.energy_receive;
			this.energy_receive = 0;
			this.last_voltage = this.voltage;
			this.voltage = 0;

			let maxVoltage = this.getMaxPacketSize();
			if (this.data.increaseMode) {
				if (this.data.energy >= maxVoltage) {
					this.data.energy += src.add(maxVoltage, maxVoltage) - maxVoltage;
				}
			}
			else {
				if (this.data.energy >= maxVoltage/4) {
					let output = this.data.energy;
					this.data.energy += src.add(output, maxVoltage/4) - output;
				}
			}
		}

		onRedstoneUpdate(signal: number): void {
			let newMode = signal > 0;
			if (newMode != this.data.increaseMode) {
				this.data.increaseMode = newMode;
				EnergyNetBuilder.rebuildTileNet(this);
			}
		}

		isEnergySource(): boolean {
			return true;
		}

		canReceiveEnergy(side: number): boolean {
			if (side == this.getFacing()) {
				return !this.data.increaseMode;
			}
			return this.data.increaseMode;
		}

		canExtractEnergy(side: number): boolean {
			if (side == this.getFacing()) {
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