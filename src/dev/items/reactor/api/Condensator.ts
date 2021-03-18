/// <reference path="DamageableReactorComponent.ts" />

namespace ReactorItem {
	export class Condensator
	extends DamageableReactorComponent {
		canStoreHeat(item: ItemContainerSlot): boolean {
			return this.getCurrentHeat(item) < this.maxDamage;
		}

		getMaxHeat(item: ItemContainerSlot): number {
			return this.maxDamage;
		}

		getCurrentHeat(item: ItemContainerSlot): number {
			return this.getCustomDamage(item);
		}

		alterHeat(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heat: number): number {
			if (heat < 0) {
				return heat;
			}
			let currentHeat = this.getCurrentHeat(item);
			let amount = Math.min(heat, this.getMaxHeat(item) - currentHeat);
			this.setCustomDamage(item, currentHeat + amount);
			return heat - amount;
		}
	}
}