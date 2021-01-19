/// <reference path="ReactorItem.ts" />

namespace ReactorItem {
	export abstract class ReactorComponent {
		processChamber(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heatrun: boolean): void {}

		acceptUraniumPulse(item: ItemContainerSlot, reactor: IReactor, pulsingItem: ItemContainerSlot, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			return false;
		}

		canStoreHeat(item: ItemContainerSlot): boolean {
			return false;
		}

		getMaxHeat(item: ItemContainerSlot): number {
			return 0;
		}

		getCurrentHeat(item: ItemContainerSlot): number {
			return 0;
		}

		alterHeat(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heat: number): number {
			return heat;
		}

		influenceExplosion(item: ItemContainerSlot, reactor: IReactor): number {
			return 0;
		}
	}
}