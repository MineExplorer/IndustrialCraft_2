/// <reference path="DamageableReactorComponent.ts" />

namespace ReactorItem {
	export class FuelRod
	extends DamageableReactorComponent {
		readonly numberOfCells: number;

		constructor(cells: number, durability: number) {
			super(durability);
			this.numberOfCells = cells;
		}

		getDepletedItem(): number {
			switch (this.numberOfCells) {
				case 1: return ItemID.fuelRodDepletedUranium;
				case 2: return ItemID.fuelRodDepletedUranium2;
				case 4: return ItemID.fuelRodDepletedUranium4;
			}
		}

		processChamber(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
			let basePulses = Math.floor(1 + this.numberOfCells / 2);
			for (let i = 0; i < this.numberOfCells; i++) {
				let dheat = 0;
				let pulses = basePulses;
				if (!heatrun) {
					for (let i = 0; i < pulses; i++) {
						this.acceptUraniumPulse(item, reactor, item, x, y, x, y, heatrun);
					}
					pulses += (this.checkPulseable(reactor, x - 1, y, item, x, y, heatrun) +
					this.checkPulseable(reactor, x + 1, y, item, x, y, heatrun) +
					this.checkPulseable(reactor, x, y - 1, item, x, y, heatrun) +
					this.checkPulseable(reactor, x, y + 1, item, x, y, heatrun));
					continue;
				}
				pulses += (this.checkPulseable(reactor, x - 1, y, item, x, y, heatrun) +
				this.checkPulseable(reactor, x + 1, y, item, x, y, heatrun) +
				this.checkPulseable(reactor, x, y - 1, item, x, y, heatrun) +
				this.checkPulseable(reactor, x, y + 1, item, x, y, heatrun));

				let heat = this.triangularNumber(pulses) * 4;
				let heatAcceptors: ReactorSlotCoord[] = [];
				this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
				heat = this.getFinalHeat(item, reactor, x, y, heat);
				for (let j = 0; j < heatAcceptors.length; j++) {
					heat += dheat;
					if (heat <= 0) break;
					dheat = heat / (heatAcceptors.length - j);
					heat -= dheat;
					let acceptor = heatAcceptors[j];
					let component = acceptor.getComponent();
					dheat = component.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, dheat);
				}
				if (heat <= 0) continue;
				reactor.addHeat(heat);
			}
			if (!heatrun && this.getCustomDamage(item) + 1 >= this.maxDamage) {
				reactor.setItemAt(x, y, this.getDepletedItem(), 1, 0);
			} else if (!heatrun) {
				this.applyCustomDamage(item, 1);
			}
		}

		checkPulseable(reactor: IReactor, x: number, y: number, slot: ItemContainerSlot, meX: number, meY: number, heatrun: boolean): number {
			let item = reactor.getItemAt(x, y);
			if (item) {
				let component = getComponent(item.id);
				if (component && component.acceptUraniumPulse(item, reactor, slot, x, y, meX, meY, heatrun)) {
					return 1;
				}
			}
			return 0;
		}

		triangularNumber(x: number): number {
			return (x * x + x) / 2;
		}

		checkHeatAcceptor(reactor: IReactor, x: number, y: number, heatAcceptors: ReactorSlotCoord[]) {
			let item = reactor.getItemAt(x, y);
			if (item) {
				let component = getComponent(item.id);
				if (component && component.canStoreHeat(item)) {
					let acceptor = new ReactorSlotCoord(item, x, y);
					heatAcceptors.push(acceptor);
				}
			}
		}

		acceptUraniumPulse(item: ItemContainerSlot, reactor: IReactor, pulsingItem: ItemContainerSlot, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			if (!heatrun) {
				reactor.addOutput(1);
			}
			return true;
		}

		getFinalHeat(item: ItemContainerSlot, reactor: IReactor, x: number, y: number, heat: number): number {
			return heat;
		}

		influenceExplosion(item: ItemContainerSlot, reactor: IReactor): number {
			return 2 * this.numberOfCells;
		}
	}
}