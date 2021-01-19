/// <reference path="ReactorComponent.ts" />

namespace ReactorItem {
	export abstract class DamageableReactorComponent
	extends ReactorComponent {
		maxDamage: number;

		constructor(durability: number) {
			super();
			this.maxDamage = durability;
		}

		getCustomDamage(item: ItemContainerSlot): number {
			return item.extra ? item.extra.getInt("damage") : 0;
		}

		setCustomDamage(item: ItemContainerSlot, damage: number): void {
			let extra = item.extra || new ItemExtraData();
			extra.putInt("damage", damage);
			let data = 1 + Math.ceil(damage / this.maxDamage * 26);
			item.set(item.id, item.count, data, extra);
		}

		applyCustomDamage(item: ItemContainerSlot, damage: number): void {
			this.setCustomDamage(item, this.getCustomDamage(item) + damage);
		}
	}
}