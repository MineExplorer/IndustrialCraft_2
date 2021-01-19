/// <reference path="DamageableReactorComponent.ts" />

namespace ItemReactor {
	export class Reflector
	extends DamageableReactorComponent {
		acceptUraniumPulse(item: ItemContainerSlot, reactor: IReactor, pulsingItem: ItemContainerSlot, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			if (!heatrun) {
				let source = getComponent(pulsingItem.id);
				source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
			}
			else if (this.getCustomDamage(item) + 1 >= this.maxDamage) {
				reactor.setItemAt(youX, youY, 0, 0, 0);
			} else {
				this.applyCustomDamage(item, 1);
			}
			return true;
		}

		influenceExplosion(item: ItemContainerSlot, reactor: IReactor): number {
			return -1;
		}
	}

	export class ReflectorIridium
	extends ReactorComponent {
		acceptUraniumPulse(item: ItemContainerSlot, reactor: IReactor, pulsingItem: ItemContainerSlot, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			if (!heatrun) {
				let source = getComponent(pulsingItem.id);
				source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
			}
			return true;
		}

		influenceExplosion(item: ItemContainerSlot, reactor: IReactor): number {
			return -1;
		}
	}
}