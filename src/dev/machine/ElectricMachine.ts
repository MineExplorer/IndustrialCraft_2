/// <reference path="MachineBase.ts" />

namespace Machine {
	export abstract class ElectricMachine
	extends MachineBase
	implements EnergyTile {
		isEnergyTile: true;
		energyNode: EnergyTileNode;
		energyTypes: object;

		defaultValues = {
			energy: 0
		};

		data: this["defaultValues"];

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

		chargeSlot(slotName: string) {
			this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot(slotName), "Eu", this.data.energy, this.getTier());
		}

		dischargeSlot(slotName: string) {
			let amount = this.getEnergyStorage() - this.data.energy;
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", amount, this.getTier());
		}

		energyTick(type: string, src: any): void {}

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
			return add;
		}

		getExplosionPower(): number {
			return 1.2;
		}

		isConductor(type: string) {
			return false;
		}

		canReceiveEnergy(side: number, type: string) {
			return true;
		}

		canExtractEnergy(side: number, type: string) {
			return false;
		}

		rebuildGrid(): void {
			this.energyNode.resetConnections();
			EnergyGridBuilder.buildGridForTile(this);
		}
	}
}