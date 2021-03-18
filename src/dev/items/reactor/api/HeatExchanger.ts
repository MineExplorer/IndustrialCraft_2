/// <reference path="HeatStorage.ts" />

namespace ReactorItem {
	export class HeatExchanger
	extends HeatStorage {
		readonly switchSide: number;
		readonly switchReactor: number;
		constructor(heatStorage: number, switchSide: number, switchReactor: number) {
			super(heatStorage);
			this.switchSide = switchSide;
			this.switchReactor = switchReactor;
		}

		processChamber(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
			if (!heatrun) {
				return;
			}
			let myHeat = 0;
			let heatAcceptors: ReactorSlotCoord[] = [];
			if (this.switchSide > 0) {
				this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);

				for (let i in heatAcceptors) {
					let acceptor = heatAcceptors[i];
					let heatable = acceptor.getComponent();
					let mymed = this.getCurrentHeat(item) * 100 / this.getMaxHeat(item);
					let heatablemed = heatable.getCurrentHeat(acceptor.item) * 100 / heatable.getMaxHeat(acceptor.item);
					let add = Math.floor(heatable.getMaxHeat(acceptor.item) / 100 * (heatablemed + mymed / 2));
					if (add > this.switchSide) {
						add = this.switchSide;
					}
					if (heatablemed + mymed / 2 < 1) {
						add = this.switchSide / 2;
					}
					if (heatablemed + mymed / 2 < 0.75) {
						add = this.switchSide / 4;
					}
					if (heatablemed + mymed / 2 < 0.5) {
						add = this.switchSide / 8;
					}
					if (heatablemed + mymed / 2 < 0.25) {
						add = 1;
					}
					if (Math.round(heatablemed * 10) / 10 > Math.round(mymed * 10) / 10) {
						add -= 2 * add;
					} else if (Math.round(heatablemed * 10) / 10 == Math.round(mymed * 10) / 10) {
						add = 0;
					}
					myHeat -= add;
					add = heatable.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, add);
					myHeat += add;
				}
			}
			if (this.switchReactor > 0) {
				let mymed = this.getCurrentHeat(item) * 100 / this.getMaxHeat(item);
				let Reactormed = reactor.getHeat() * 100 / reactor.getMaxHeat();
				let add = Math.round(reactor.getMaxHeat() / 100 * (Reactormed + mymed / 2));
				if (add > this.switchReactor) {
					add = this.switchReactor;
				}
				if (Reactormed + mymed / 2 < 1) {
					add = this.switchSide / 2;
				}
				if (Reactormed + mymed / 2 < 0.75) {
					add = this.switchSide / 4;
				}
				if (Reactormed + mymed / 2 < 0.5) {
					add = this.switchSide / 8;
				}
				if (Reactormed + mymed / 2 < 0.25) {
					add = 1;
				}
				if (Math.round(Reactormed * 10) / 10 > Math.round(mymed * 10) / 10) {
					add -= 2 * add;
				} else if (Math.round(Reactormed * 10) / 10 == Math.round(mymed * 10) / 10) {
					add = 0;
				}
				myHeat -= add;
				reactor.setHeat(reactor.getHeat() + add);
			}
			this.alterHeat(item, reactor, x, y, myHeat);
		}

		checkHeatAcceptor(reactor: IReactor, x: number, y: number, heatAcceptors: ReactorSlotCoord[]): void {
			let item = reactor.getItemAt(x, y);
			if (item) {
				let component = getComponent(item.id);
				if (component && component.canStoreHeat(item)) {
					let acceptor = new ReactorSlotCoord(item, x, y);
					heatAcceptors.push(acceptor);
				}
			}
		}
	}
}