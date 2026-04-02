/// <reference path="MachineBase.ts" />

namespace Machine {
	export abstract class ElectricMachine
	extends MachineBase
	implements EnergyTile {
		readonly energyTypes: {[energyName: string]: EnergyType};
		energyNode: EnergyTileNode;

		defaultValues = {
			energy: 0
		};

		getTier(): number {
			return 1;
		}

		getEnergyCapacity(): number {
			return 0;
		}

		/** @deprecated use getEnergyCapacity instead */
		getEnergyStorage(): number {
			return this.getEnergyCapacity();
		}

		getRelativeEnergy(): number {
			return this.data.energy / this.getEnergyCapacity();
		}

		getMaxPacketSize(): number {
			return 8 << this.getTier()*2;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (item.id == ItemID.EUMeter) return true;
			return super.onItemUse(coords, item, player);
		}

		chargeSlot(slotName: string) {
			this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot(slotName), "Eu", this.data.energy, this.getTier());
		}

		dischargeSlot(slotName: string) {
			const amount = this.getEnergyCapacity() - this.data.energy;
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot(slotName), "Eu", amount, this.getTier());
		}

		energyTick(type: string, src: EnergyTileNode): void {}

		energyReceive(type: string, amount: number, voltage: number): number {
			const maxVoltage = this.getMaxPacketSize();
			if (voltage > maxVoltage) {
				amount = Math.min(amount, maxVoltage);
				if (IC2Config.voltageEnabled) {
					this.blockSource.setBlock(this.x, this.y, this.z, 0, 0);
					this.blockSource.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.getExplosionPower(), true);
					SoundLib.playSoundAtBlock(this, this.dimension, "MachineOverload.ogg", 1, 1, 32);
					this.selfDestroy();
					return amount;
				}
			}
			const add = Math.min(amount, Math.floor(this.getEnergyCapacity() - this.data.energy));
			this.data.energy += add;
			return add;
		}

		getFreeEnergyAmount(): number {
			const storage = this.getEnergyCapacity();
			if (storage > this.data.energy) {
				return Math.floor(storage - this.data.energy);
			}
			return 0;
		}

		getExplosionPower(): number {
			return 1.2;
		}

		isGenerator(): boolean {
			return false;
		}

		isConductor(type: string): boolean {
			return false;
		}

		canReceiveEnergy(side: number, type: string): boolean {
			return true;
		}

		canEmitEnergy(side: number, type: string): boolean {
			return false;
		}

		rebuildGrid(): void {
			this.energyNode.resetConnections();
			EnergyGridBuilder.buildGridForTile(this);
		}
	}
}