/// <reference path="ReactorComponent.ts" />

namespace ReactorItem {
	export class Plating
	extends ReactorComponent {
		maxHeatAdd: number;
		effectModifier: number;

		constructor(maxHeatAdd: number, effectModifier: number) {
			super();
			this.maxHeatAdd = maxHeatAdd;
			this.effectModifier = effectModifier;
		}

		processChamber(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
			if (heatrun) {
				reactor.setMaxHeat(reactor.getMaxHeat() + this.maxHeatAdd);
				reactor.setHeatEffectModifier(reactor.getHeatEffectModifier() * this.effectModifier);
			}
		}

		influenceExplosion(item: ItemContainerSlot, reactor: IReactor): number {
			if (this.effectModifier >= 1) {
				return 0;
			}
			return this.effectModifier;
		}
	}
}