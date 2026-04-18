namespace ReactorItem {
	let reactorComponents: KeyValueMap<ReactorComponent> = {};

	export function registerComponent(id: number, component: ReactorComponent): void {
		if (component instanceof DamageableReactorComponent) {
			Item.setMaxDamage(id, 27);
		}
		reactorComponents[id] = component;
	}

	export function getComponent(id: number): ReactorComponent {
		return reactorComponents[id];
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
