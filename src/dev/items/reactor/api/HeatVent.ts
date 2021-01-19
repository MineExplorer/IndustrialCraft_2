/// <reference path="HeatStorage.ts" />

namespace ReactorItem {
	export class HeatVent
	extends HeatStorage {
		selfVent: number;
		reactorVent: number;

		constructor(heatStorage: number, selfVent: number, reactorVent: number) {
			super(heatStorage);
			this.selfVent = selfVent;
			this.reactorVent = reactorVent;
		}

		processChamber(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
			if (heatrun) {
				if (this.reactorVent > 0) {
					let rheat = reactor.getHeat();
					let reactorDrain = rheat;
					if (reactorDrain > this.reactorVent) {
						reactorDrain = this.reactorVent;
					}
					rheat -= reactorDrain;
					if ((reactorDrain = this.alterHeat(item, reactor, x, y, reactorDrain)) > 0) {
						return;
					}
					reactor.setHeat(rheat);
				}
				let self = this.alterHeat(item, reactor, x, y, -this.selfVent);
				if (self <= 0) {
					reactor.addEmitHeat(self + this.selfVent);
				}
			}
		}
	}

	export class HeatVentSpread
	extends ReactorComponent {
		sideVent: number;

		constructor(sideVent: number) {
			super();
			this.sideVent = sideVent;
		}

		processChamber(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
			if (heatrun) {
				this.cool(reactor, x - 1, y);
				this.cool(reactor, x + 1, y);
				this.cool(reactor, x, y - 1);
				this.cool(reactor, x, y + 1);
			}
		}

		cool(reactor: IReactor, x: number, y: number): void {
			let item = reactor.getItemAt(x, y);
			if (item) {
				let component = getComponent(item.id);
				if (component && component.canStoreHeat(item)) {
					let self = component.alterHeat(item, reactor, x, y, -this.sideVent);
					reactor.addEmitHeat(self + this.sideVent);
				}
			}
		}
	}
}