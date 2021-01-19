/// <reference path="DamageableReactorComponent.ts" />

namespace ItemReactor {
	export class HeatStorage
	extends DamageableReactorComponent {
		constructor(heatStorage: number) {
			super(heatStorage);
		}

		canStoreHeat(item: ItemContainerSlot): boolean {
			return true;
		}

		getMaxHeat(item: ItemContainerSlot): number {
			return this.maxDamage;
		}

		getCurrentHeat(item: ItemContainerSlot): number {
			return this.getCustomDamage(item);
		}

		alterHeat(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heat: number): number {
			let myHeat = this.getCurrentHeat(item);
			let max = this.getMaxHeat(item);
			if ((myHeat += heat) > max) {
				reactor.setItemAt(x, y, 0, 0, 0);
				heat = max - myHeat + 1;
			} else {
				if (myHeat < 0) {
					heat = myHeat;
					myHeat = 0;
				} else {
					heat = 0;
				}
				this.setCustomDamage(item, myHeat);
			}
			return heat;
		}
	}
}