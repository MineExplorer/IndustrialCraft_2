namespace ItemReactor {
	let reactor_components = {};

	export function registerComponent(id: number, component: ReactorComponent): void {
		if (component instanceof DamageableReactorComponent) {
			Item.setMaxDamage(id, 27);
		}
		if (component.getMaxHeat() > 0) {
			Item.addToCreative(id, 1, 1);
		}
		reactor_components[id] = component;
	}

	export function getComponent(id: number): ReactorComponent {
		return reactor_components[id];
	}

	export function isReactorItem(id: number): boolean {
		return !!getComponent(id);
	}

	export class ReactorItemStack
	extends ItemStack {
		x: number;
		y: number;

		constructor(item: ItemInstance, x: number, y: number) {
			super(item);
			this.x = x;
			this.y = y;
		}

		getComponent() {
			return getComponent(this.id);
		}
	}

	export abstract class ReactorComponent {
		processChamber(item: ItemInstance, reactor: IReactor, x: number, y: number, heatrun: boolean): void {}

		acceptUraniumPulse(item: ItemInstance, reactor: IReactor, pulsingItem: ItemInstance, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			return false;
		}

		canStoreHeat(item: ItemInstance): boolean {
			return false;
		}

		getMaxHeat(item?: ItemInstance): number {
			return 0;
		}

		getCurrentHeat(item: ItemInstance): number {
			return 0;
		}

		alterHeat(item: ItemInstance, reactor: IReactor, x: number, y: number, heat: number): number {
			return heat;
		}

		influenceExplosion(item: ItemInstance, reactor: IReactor): number {
			return 0;
		}
	}

	export abstract class DamageableReactorComponent
	extends ReactorComponent {
		maxDamage: number;

		constructor(durability: number) {
			super();
			this.maxDamage = durability;
		}

		getCustomDamage(item: ItemInstance): number {
			return item.extra ? item.extra.getInt("damage") : 0;
		}

		setCustomDamage(item: ItemInstance, damage: number): void {
			if (!item.extra) item.extra = new ItemExtraData();
			item.extra.putInt("damage", damage);
			item.data = 1 + Math.ceil(damage / this.maxDamage * 26);
		}

		applyCustomDamage(item: ItemInstance, damage: number): void {
			this.setCustomDamage(item, this.getCustomDamage(item) + damage);
		}
	}

	export class FuelRod
	extends DamageableReactorComponent {
		numberOfCells: number;
		depletedItem: number;

		constructor(cells: number, durability: number, depleted: number) {
			super(durability);
			this.numberOfCells = cells;
			this.depletedItem = depleted;
		}

		processChamber(item: ItemInstance, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
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
				let heatAcceptors: ReactorItemStack[] = [];
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
					dheat = component.alterHeat(acceptor, reactor, acceptor.x, acceptor.y, dheat);
				}
				if (heat <= 0) continue;
				reactor.addHeat(heat);
			}
			if (!heatrun && this.getCustomDamage(item) + 1 >= this.maxDamage) {
				reactor.setItemAt(x, y, this.depletedItem, 1, 0);
			} else if (!heatrun) {
				this.applyCustomDamage(item, 1);
			}
		}

		checkPulseable(reactor: IReactor, x: number, y: number, slot: ItemInstance, meX: number, meY: number, heatrun: boolean): number {
			let item = reactor.getItemAt(x, y);
			if (item) {
				let component = ItemReactor.getComponent(item.id);
				if (component && component.acceptUraniumPulse(item, reactor, slot, x, y, meX, meY, heatrun)) {
					return 1;
				}
			}
			return 0;
		}

		triangularNumber(x: number): number {
			return (x * x + x) / 2;
		}

		checkHeatAcceptor(reactor: IReactor, x: number, y: number, heatAcceptors: ReactorItemStack[]) {
			let item = reactor.getItemAt(x, y);
			if (item) {
				let component = ItemReactor.getComponent(item.id);
				if (component && component.canStoreHeat(item)) {
					let acceptor = new ReactorItemStack(item, x, y);
					heatAcceptors.push(acceptor);
				}
			}
		}

		acceptUraniumPulse(item: ItemInstance, reactor: IReactor, pulsingItem: ItemInstance, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			if (!heatrun) {
				reactor.addOutput(1);
			}
			return true;
		}

		getFinalHeat(item: ItemInstance, reactor: IReactor, x: number, y: number, heat: number): number {
			return heat;
		}

		influenceExplosion(item: ItemInstance, reactor: IReactor): number {
			return 2 * this.numberOfCells;
		}
	}

	export class FuelRodMOX
	extends FuelRod {
		acceptUraniumPulse(item: ItemInstance, reactor: IReactor, pulsingItem: ItemInstance, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			if (!heatrun) {
				let effectiveness = reactor.getHeat() / reactor.getMaxHeat();
				let output = 4 * effectiveness + 1;
				reactor.addOutput(output);
			}
			return true;
		}

		getFinalHeat(item: ItemInstance, reactor: IReactor, x: number, y: number, heat: number): number {
			if (reactor.isFluidCooled() && reactor.getHeat() / reactor.getMaxHeat() > 0.5) {
				heat *= 2;
			}
			return heat;
		}
	}

	export class Plating
	extends ReactorComponent {
		maxHeatAdd: number;
		effectModifier: number;

		constructor(maxHeatAdd: number, effectModifier: number) {
			super();
			this.maxHeatAdd = maxHeatAdd;
			this.effectModifier = effectModifier;
		}

		processChamber(item: ItemInstance, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
			if (heatrun) {
				reactor.setMaxHeat(reactor.getMaxHeat() + this.maxHeatAdd);
				reactor.setHeatEffectModifier(reactor.getHeatEffectModifier() * this.effectModifier);
			}
		}

		influenceExplosion(item: ItemInstance, reactor: IReactor): number {
			if (this.effectModifier >= 1) {
				return 0;
			}
			return this.effectModifier;
		}
	}

	export class Reflector
	extends DamageableReactorComponent {
		acceptUraniumPulse(item: ItemInstance, reactor: IReactor, pulsingItem: ItemInstance, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			if (!heatrun) {
				let source = ItemReactor.getComponent(pulsingItem.id);
				source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
			}
			else if (this.getCustomDamage(item) + 1 >= this.maxDamage) {
				reactor.setItemAt(youX, youY, 0, 0, 0);
			} else {
				this.applyCustomDamage(item, 1);
			}
			return true;
		}

		influenceExplosion(item: ItemInstance, reactor: IReactor): number {
			return -1;
		}
	}

	export class ReflectorIridium
	extends ReactorComponent {
		acceptUraniumPulse(item: ItemInstance, reactor: IReactor, pulsingItem: ItemInstance, youX: number, youY: number, pulseX: number, pulseY: number, heatrun: boolean): boolean {
			if (!heatrun) {
				let source = ItemReactor.getComponent(pulsingItem.id);
				source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
			}
			return true;
		}

		influenceExplosion(item: ItemInstance, reactor: IReactor): number {
			return -1;
		}
	}

	export class HeatStorage
	extends DamageableReactorComponent {
		constructor(heatStorage: number) {
			super(heatStorage);
		}

		canStoreHeat(item: ItemInstance): boolean {
			return true;
		}

		getMaxHeat(item: ItemInstance): number {
			return this.maxDamage;
		}

		getCurrentHeat(item: ItemInstance): number {
			return this.getCustomDamage(item);
		}

		alterHeat(item: ItemInstance, reactor: IReactor, x: number, y: number, heat: number): number {
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

	export class HeatExchanger
	extends HeatStorage {
		switchSide: number;
		switchReactor: number;
		constructor(heatStorage: number, switchSide: number, switchReactor: number) {
			super(heatStorage);
			this.switchSide = switchSide;
			this.switchReactor = switchReactor;
		}

		processChamber(item: ItemInstance, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
			if (!heatrun) {
				return;
			}
			let myHeat = 0;
			let heatAcceptors: ReactorItemStack[] = [];
			if (this.switchSide > 0) {
				this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);

				for (let i in heatAcceptors) {
					let acceptor = heatAcceptors[i];
					let heatable = acceptor.getComponent();
					let mymed = this.getCurrentHeat(item) * 100 / this.getMaxHeat(item);
					let heatablemed = heatable.getCurrentHeat(acceptor) * 100 / heatable.getMaxHeat(acceptor);
					let add = Math.floor(heatable.getMaxHeat(acceptor) / 100 * (heatablemed + mymed / 2));
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
					add = heatable.alterHeat(acceptor, reactor, acceptor.x, acceptor.y, add);
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

		checkHeatAcceptor(reactor: IReactor, x: number, y: number, heatAcceptors: ReactorItemStack[]): void {
			let item = reactor.getItemAt(x, y);
			if (item) {
				let component = ItemReactor.getComponent(item.id);
				if (component && component.canStoreHeat(item)) {
					let acceptor = new ReactorItemStack(item, x, y);
					heatAcceptors.push(acceptor);
				}
			}
		}
	}

	export class HeatVent
	extends HeatStorage {
		selfVent: number;
		reactorVent: number;

		constructor(heatStorage: number, selfVent: number, reactorVent: number) {
			super(heatStorage);
			this.selfVent = selfVent;
			this.reactorVent = reactorVent;
		}

		processChamber(item: ItemInstance, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
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

		processChamber(item: ItemInstance, reactor: IReactor, x: number, y: number, heatrun: boolean): void {
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
				let component = ItemReactor.getComponent(item.id);
				if (component && component.canStoreHeat(item)) {
					let self = component.alterHeat(item, reactor, x, y, -this.sideVent);
					reactor.addEmitHeat(self + this.sideVent);
				}
			}
		}
	}

	export class Condensator
	extends DamageableReactorComponent {
		canStoreHeat(item: ItemInstance): boolean {
			return this.getCurrentHeat(item) < this.maxDamage;
		}

		getMaxHeat(item: ItemInstance): number {
			return this.maxDamage;
		}

		getCurrentHeat(item: ItemInstance): number {
			return this.getCustomDamage(item);
		}

		alterHeat(item: ItemInstance, reactor: IReactor, x: number, y: number, heat: number): number {
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
