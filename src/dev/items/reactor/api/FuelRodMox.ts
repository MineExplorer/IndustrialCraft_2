/// <reference path="FuelRod.ts" />

namespace ReactorItem {
	export class FuelRodMOX
	extends FuelRod {
		getDepletedItem(): number {
			switch (this.numberOfCells) {
				case 1: return ItemID.fuelRodDepletedMOX;
				case 2: return ItemID.fuelRodDepletedMOX2;
				case 4: return ItemID.fuelRodDepletedMOX4;
			}
		}

		acceptUraniumPulse(item: ItemContainerSlot, reactor: IReactor, pulsingItem: ItemContainerSlot, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			if (!heatrun) {
				let effectiveness = reactor.getHeat() / reactor.getMaxHeat();
				let output = 4 * effectiveness + 1;
				reactor.addOutput(output);
			}
			return true;
		}

		getFinalHeat(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heat: number): number {
			if (reactor.isFluidCooled() && reactor.getHeat() / reactor.getMaxHeat() > 0.5) {
				heat *= 2;
			}
			return heat;
		}
	}
}