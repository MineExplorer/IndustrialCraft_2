let ReactorAPI = {
	reactor_components: {},
	
	registerComponent: function(id, component) {
		if (component.maxDamage) {
			Item.setMaxDamage(id, component.maxDamage);
		}
		if (component.getMaxHeat() > 0) {
			Item.addToCreative(id, 1, 1);
		}
		this.reactor_components[id] = component;
	},
	
	getComponent: function(id) {
		return this.reactor_components[id];
	},
	
	isReactorItem: function(id) {
		return this.getComponent(id)? true : false;
	},
	
	reactorComponent: function() {
		this.processChamber = function(item, reactor, x, y, heatRun) { },
		
		this.acceptUraniumPulse = function(item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
			return false;
		},

		this.canStoreHeat = function(item) {
			return false;
		},

		this.getMaxHeat = function(item) {
			return 0;
		},

		this.getCurrentHeat = function(item) {
			return 0;
		},

		this.alterHeat = function(item, reactor, x, y, heat) {
			return heat;
		},

		this.influenceExplosion = function(item, reactor) {
			return 0;
		}
	},
	
	fuelRod: function(cells, durability, depleted) {
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		this.numberOfCells = cells;
		this.maxDamage = durability;
		this.depletedItem = depleted;
		this.processChamber = function(item, reactor, x, y, heatRun) {
			let basePulses = parseInt(1 + this.numberOfCells / 2);
			for (let i = 0; i < this.numberOfCells; i++) {
				let dheat = 0;
				let pulses = basePulses;
				if (!heatRun) {
					for (let i = 0; i < pulses; i++) {
						this.acceptUraniumPulse(item, reactor, item, x, y, x, y, heatRun);
					}
					pulses += this.checkPulseable(reactor, x - 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x + 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x, y - 1, item, x, y, heatRun) + this.checkPulseable(reactor, x, y + 1, item, x, y, heatRun);
					continue;
				}
				pulses += this.checkPulseable(reactor, x - 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x + 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x, y - 1, item, x, y, heatRun) + this.checkPulseable(reactor, x, y + 1, item, x, y, heatRun);
				let heat = this.triangularNumber(pulses) * 4;
				let heatAcceptors = [];
				this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
				heat = this.getFinalHeat(item, reactor, x, y, heat);
				for(let j = 0; j < heatAcceptors.length; j++){
					heat += dheat;
					if(heat <= 0) break;
					dheat = heat / (heatAcceptors.length - j);
					heat -= dheat;
					let acceptor = heatAcceptors[j];
					dheat = acceptor.comp.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, dheat);
				}
				if (heat <= 0) continue;
				reactor.addHeat(heat);
			}
			if (!heatRun && item.data >= this.maxDamage) {
				reactor.setItemAt(x, y, this.depletedItem, 1);
			} else if (!heatRun) {
				reactor.setItemAt(x, y, item.id, 1, item.data+1);
			}
		}
		
		this.checkPulseable = function(reactor, x, y, slot, mex, mey, heatrun) {
			let item = reactor.getItemAt(x, y);
			if(item){
				let component = ReactorAPI.getComponent(item.id);
				if(component && component.acceptUraniumPulse(item, reactor, slot, x, y, mex, mey, heatrun)){
					return 1;
				}
			}
			return 0;
		}

		this.triangularNumber = function(x) {
			return (x * x + x) / 2;
		}

		this.checkHeatAcceptor = function(reactor, x, y, heatAcceptors) {
			let item = reactor.getItemAt(x, y);
			if (item){
				let component = ReactorAPI.getComponent(item.id);
				if(component && component.canStoreHeat(item)){
					let acceptor = {comp: component, item: item, x: x, y: y}
					heatAcceptors.push(acceptor);
				}
			}
		}
		
		this.acceptUraniumPulse = function(item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
			if (!heatrun) {
				reactor.addOutput(1);
			}
			return true;
		}
		
		this.getFinalHeat = function(item, reactor, x, y, heat) {
			return heat;
		}
		
		this.influenceExplosion = function(item, reactor) {
			return 2 * this.numberOfCells;
		}
	},
	
	fuelRodMOX: function(cells, durability, depleted) {
		this.parent = ReactorAPI.fuelRod;
		this.parent(cells, durability, depleted);
		
		this.acceptUraniumPulse = function(item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
			if (!heatrun) {
				let breedereffectiveness = reactor.getHeat() / reactor.getMaxHeat();
				let output = 4 * breedereffectiveness + 1;
				reactor.addOutput(output);
			}
			return true;
		}
		/*
		this.getFinalHeat = function(item, reactor, x, y, heat) {
			let breedereffectiveness;
			if (reactor.isFluidCooled() && (breedereffectiveness = reactor.getHeat() / reactor.getMaxHeat()) > 0.5) {
				heat *= 2;
			}
			return heat;
		}
		*/
	},
	
	plating: function(maxHeatAdd, effectModifier) {
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		this.maxHeatAdd = maxHeatAdd;
		this.effectModifier = effectModifier;
		
		this.processChamber = function(item, reactor, x, y, heatrun) {
			if (heatrun) {
				reactor.setMaxHeat(reactor.getMaxHeat() + this.maxHeatAdd);
				reactor.setHeatEffectModifier(reactor.getHeatEffectModifier() * this.effectModifier);
			}
		}
		
		this.influenceExplosion = function(item, reactor) {
			if (this.effectModifier >= 1) {
				return 0;
			}
			return this.effectModifier;
		}
	},
	
	reflector: function(maxDamage) {
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		if(maxDamage){
			this.maxDamage = maxDamage;
		}
		
		this.acceptUraniumPulse = function(item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
			if (!heatrun) {
				let source = ReactorAPI.getComponent(pulsingItem.id);
				source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
			}
			else if (this.maxDamage){
				if (item.data >= this.maxDamage) {
					reactor.setItemAt(youX, youY, 0);
				} else {
					reactor.setItemAt(youX, youY, item.id, 1, item.data + 1);
				}
			}
			return true;
		}
		
		this.influenceExplosion = function(item, reactor) {
			return -1;
		}
	},
	
	heatStorage: function(heatStorage) {
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		this.maxDamage = heatStorage;
		
		this.canStoreHeat = function(item) {
			return true;
		}

		this.getMaxHeat = function(item) {
			return this.maxDamage;
		}
		
		this.getCurrentHeat = function(item){
			return item.data - 1;
		}

		this.alterHeat = function(item, reactor, x, y, heat) {
			let myHeat = this.getCurrentHeat(item);
			let max = this.getMaxHeat(item);
			if ((myHeat += heat) > max) {
				reactor.setItemAt(x, y, 0);
				heat = max - myHeat + 1;
			} else {
				if (myHeat < 0) {
					heat = myHeat;
					myHeat = 0;
				} else {
					heat = 0;
				}
				reactor.setItemAt(x, y, item.id, 1, myHeat + 1);
			}
			return heat;
		}
	},
	
	heatExchanger: function(heatStorage, switchSide, switchReactor) {
		this.parent = ReactorAPI.heatStorage;
		this.parent(heatStorage);
		
		this.switchSide = switchSide;
		this.switchReactor = switchReactor;
		
		this.processChamber = function(item, reactor, x, y, heatrun) {
			if (!heatrun) {
				return;
			}
			let myHeat = 0;
			let heatAcceptors = [];
			if (this.switchSide > 0) {
				this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
				this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
				
				for (let i in heatAcceptors) {
					let acceptor = heatAcceptors[i];
					let heatable = acceptor.comp;
					let mymed = this.getCurrentHeat(item) * 100 / this.getMaxHeat(item);
					let heatablemed = heatable.getCurrentHeat(acceptor.item) * 100 / heatable.getMaxHeat(acceptor.item);
					let add = parseInt(heatable.getMaxHeat(acceptor.item) / 100 * (heatablemed + mymed / 2));
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
				let mymed = this.getCurrentHeat(item, reactor, x, y) * 100 / this.getMaxHeat(item);
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

		this.checkHeatAcceptor = function(reactor, x, y, heatAcceptors) {
			let item = reactor.getItemAt(x, y);
			if (item){
				let component = ReactorAPI.getComponent(item.id);
				if(component && component.canStoreHeat(item)){
					let acceptor = {comp: component, item: item, x: x, y: y}
					heatAcceptors.push(acceptor);
				}
			}
		}
	},
	
	heatVent: function(heatStorage, selfVent, reactorVent) {
		this.parent = ReactorAPI.heatStorage;
		this.parent(heatStorage);
		
		this.selfVent = selfVent;
        this.reactorVent = reactorVent;
		this.processChamber = function(item, reactor, x, y, heatrun) {
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
				/* if (self <= 0) {
					reactor.addEmitHeat(self + this.selfVent);
				} */
			}
		}
	},
	
	heatVentSpread: function(sideVent) {
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		this.sideVent = sideVent;
		this.processChamber = function(item, reactor, x, y, heatrun) {
			if (heatrun) {
				this.cool(reactor, x - 1, y);
				this.cool(reactor, x + 1, y);
				this.cool(reactor, x, y - 1);
				this.cool(reactor, x, y + 1);
			}
		}

		this.cool = function(reactor, x, y) {
			let item = reactor.getItemAt(x, y);
			if (item) {
				let comp = ReactorAPI.getComponent(item.id);
				if(comp && comp.canStoreHeat(item)){
					comp.alterHeat(item, reactor, x, y, -this.sideVent);
					//reactor.addEmitHeat(self + this.sideVent);
				}
			}
		}
	},
	
	condensator: function(maxDmg) {
		this.parent = ReactorAPI.reactorComponent;
		this.parent();
		
		this.maxDamage = maxDmg;
		
		this.canStoreHeat = function(item) {
			return item.data < this.maxDamage;
		}
		
		this.getMaxHeat = function(item) {
			return this.maxDamage;
		}

		this.getCurrentHeat = function(item) {
			return item.data - 1;
		}
		
		this.alterHeat = function(item, reactor, x, y, heat) {
			if (heat < 0) {
				return heat;
			}
			let amount = Math.min(heat, this.getMaxHeat(item) - item.data);
			item.data += amount;
			return heat - amount;
		}
	},
}
