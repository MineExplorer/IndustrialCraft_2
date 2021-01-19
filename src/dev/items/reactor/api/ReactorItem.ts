namespace ReactorItem {
	let reactor_components = {};

	export function registerComponent(id: number, component: ReactorComponent): void {
		if (component instanceof DamageableReactorComponent) {
			Item.setMaxDamage(id, 27);
		}
		reactor_components[id] = component;
	}

	export function getComponent(id: number): ReactorComponent {
		return reactor_components[id];
	}

	export function isReactorItem(id: number): boolean {
		return !!getComponent(id);
	}

	export class ReactorSlotCoord {
		item: ItemContainerSlot;
		x: number;
		y: number;

		constructor(item: ItemContainerSlot, x: number, y: number) {
			this.item = item;
			this.x = x;
			this.y = y;
		}

		getComponent() {
			return getComponent(this.item.id);
		}
	}
}
