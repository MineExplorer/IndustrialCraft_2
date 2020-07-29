var ReactorAPI = {
    reactor_components: {},
    registerComponent: function (id, component) {
        if (component.maxDamage) {
            Item.setMaxDamage(id, 27);
        }
        if (component.getMaxHeat() > 0) {
            Item.addToCreative(id, 1, 1);
        }
        this.reactor_components[id] = component;
    },
    getComponent: function (id) {
        return this.reactor_components[id];
    },
    isReactorItem: function (id) {
        return this.getComponent(id) ? true : false;
    },
    reactorComponent: function () {
        this.processChamber = function (item, reactor, x, y, heatRun) { },
            this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
                return false;
            },
            this.canStoreHeat = function (item) {
                return false;
            },
            this.getMaxHeat = function (item) {
                return 0;
            },
            this.getCurrentHeat = function (item) {
                return 0;
            },
            this.alterHeat = function (item, reactor, x, y, heat) {
                return heat;
            },
            this.influenceExplosion = function (item, reactor) {
                return 0;
            };
    },
    damageableReactorComponent: function (durability) {
        this.parent = ReactorAPI.reactorComponent;
        this.parent();
        this.maxDamage = durability;
        this.getCustomDamage = function (item) {
            return item.extra ? item.extra.getInt("damage") : 0;
        };
        this.setCustomDamage = function (item, damage) {
            if (!item.extra)
                item.extra = new ItemExtraData();
            item.extra.putInt("damage", damage);
            item.data = 1 + Math.ceil(damage / this.maxDamage * 26);
        };
        this.applyCustomDamage = function (item, damage) {
            this.setCustomDamage(item, this.getCustomDamage(item) + damage);
        };
    },
    fuelRod: function (cells, durability, depleted) {
        this.parent = ReactorAPI.damageableReactorComponent;
        this.parent(durability);
        this.numberOfCells = cells;
        this.depletedItem = depleted;
        this.processChamber = function (item, reactor, x, y, heatRun) {
            var basePulses = parseInt(1 + this.numberOfCells / 2);
            for (var i_1 = 0; i_1 < this.numberOfCells; i_1++) {
                var dheat = 0;
                var pulses = basePulses;
                if (!heatRun) {
                    for (var i_2 = 0; i_2 < pulses; i_2++) {
                        this.acceptUraniumPulse(item, reactor, item, x, y, x, y, heatRun);
                    }
                    pulses += this.checkPulseable(reactor, x - 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x + 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x, y - 1, item, x, y, heatRun) + this.checkPulseable(reactor, x, y + 1, item, x, y, heatRun);
                    continue;
                }
                pulses += this.checkPulseable(reactor, x - 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x + 1, y, item, x, y, heatRun) + this.checkPulseable(reactor, x, y - 1, item, x, y, heatRun) + this.checkPulseable(reactor, x, y + 1, item, x, y, heatRun);
                var heat = this.triangularNumber(pulses) * 4;
                var heatAcceptors = [];
                this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
                heat = this.getFinalHeat(item, reactor, x, y, heat);
                for (var j = 0; j < heatAcceptors.length; j++) {
                    heat += dheat;
                    if (heat <= 0)
                        break;
                    dheat = heat / (heatAcceptors.length - j);
                    heat -= dheat;
                    var acceptor = heatAcceptors[j];
                    dheat = acceptor.comp.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, dheat);
                }
                if (heat <= 0)
                    continue;
                reactor.addHeat(heat);
            }
            if (!heatRun && this.getCustomDamage(item) + 1 >= this.maxDamage) {
                reactor.setItemAt(x, y, this.depletedItem, 1);
            }
            else if (!heatRun) {
                this.applyCustomDamage(item, 1);
            }
        };
        this.checkPulseable = function (reactor, x, y, slot, mex, mey, heatrun) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorAPI.getComponent(item.id);
                if (component && component.acceptUraniumPulse(item, reactor, slot, x, y, mex, mey, heatrun)) {
                    return 1;
                }
            }
            return 0;
        };
        this.triangularNumber = function (x) {
            return (x * x + x) / 2;
        };
        this.checkHeatAcceptor = function (reactor, x, y, heatAcceptors) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorAPI.getComponent(item.id);
                if (component && component.canStoreHeat(item)) {
                    var acceptor = { comp: component, item: item, x: x, y: y };
                    heatAcceptors.push(acceptor);
                }
            }
        };
        this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                reactor.addOutput(1);
            }
            return true;
        };
        this.getFinalHeat = function (item, reactor, x, y, heat) {
            return heat;
        };
        this.influenceExplosion = function (item, reactor) {
            return 2 * this.numberOfCells;
        };
    },
    fuelRodMOX: function (cells, durability, depleted) {
        this.parent = ReactorAPI.fuelRod;
        this.parent(cells, durability, depleted);
        this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                var breedereffectiveness = reactor.getHeat() / reactor.getMaxHeat();
                var output = 4 * breedereffectiveness + 1;
                reactor.addOutput(output);
            }
            return true;
        };
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
    plating: function (maxHeatAdd, effectModifier) {
        this.parent = ReactorAPI.reactorComponent;
        this.parent();
        this.maxHeatAdd = maxHeatAdd;
        this.effectModifier = effectModifier;
        this.processChamber = function (item, reactor, x, y, heatrun) {
            if (heatrun) {
                reactor.setMaxHeat(reactor.getMaxHeat() + this.maxHeatAdd);
                reactor.setHeatEffectModifier(reactor.getHeatEffectModifier() * this.effectModifier);
            }
        };
        this.influenceExplosion = function (item, reactor) {
            if (this.effectModifier >= 1) {
                return 0;
            }
            return this.effectModifier;
        };
    },
    reflector: function (maxDamage) {
        this.parent = ReactorAPI.damageableReactorComponent;
        this.parent(maxDamage);
        this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                var source = ReactorAPI.getComponent(pulsingItem.id);
                source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
            }
            else if (this.getCustomDamage + 1 >= this.maxDamage) {
                reactor.setItemAt(youX, youY, 0);
            }
            else {
                this.applyCustomDamage(item, 1);
            }
            return true;
        };
        this.influenceExplosion = function (item, reactor) {
            return -1;
        };
    },
    reflectorIridium: function () {
        this.parent = ReactorAPI.reactorComponent;
        this.parent();
        this.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                var source = ReactorAPI.getComponent(pulsingItem.id);
                source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
            }
            return true;
        };
        this.influenceExplosion = function (item, reactor) {
            return -1;
        };
    },
    heatStorage: function (heatStorage) {
        this.parent = ReactorAPI.damageableReactorComponent;
        this.parent(heatStorage);
        this.canStoreHeat = function (item) {
            return true;
        };
        this.getMaxHeat = function (item) {
            return this.maxDamage;
        };
        this.getCurrentHeat = function (item) {
            return this.getCustomDamage(item);
        };
        this.alterHeat = function (item, reactor, x, y, heat) {
            var myHeat = this.getCurrentHeat(item);
            var max = this.getMaxHeat(item);
            if ((myHeat += heat) > max) {
                reactor.setItemAt(x, y, 0);
                heat = max - myHeat + 1;
            }
            else {
                if (myHeat < 0) {
                    heat = myHeat;
                    myHeat = 0;
                }
                else {
                    heat = 0;
                }
                this.setCustomDamage(item, myHeat);
            }
            return heat;
        };
    },
    heatExchanger: function (heatStorage, switchSide, switchReactor) {
        this.parent = ReactorAPI.heatStorage;
        this.parent(heatStorage);
        this.switchSide = switchSide;
        this.switchReactor = switchReactor;
        this.processChamber = function (item, reactor, x, y, heatrun) {
            if (!heatrun) {
                return;
            }
            var myHeat = 0;
            var heatAcceptors = [];
            if (this.switchSide > 0) {
                this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
                for (var i_3 in heatAcceptors) {
                    var acceptor = heatAcceptors[i_3];
                    var heatable = acceptor.comp;
                    var mymed = this.getCurrentHeat(item) * 100 / this.getMaxHeat(item);
                    var heatablemed = heatable.getCurrentHeat(acceptor.item) * 100 / heatable.getMaxHeat(acceptor.item);
                    var add = parseInt(heatable.getMaxHeat(acceptor.item) / 100 * (heatablemed + mymed / 2));
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
                    }
                    else if (Math.round(heatablemed * 10) / 10 == Math.round(mymed * 10) / 10) {
                        add = 0;
                    }
                    myHeat -= add;
                    add = heatable.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, add);
                    myHeat += add;
                }
            }
            if (this.switchReactor > 0) {
                var mymed = this.getCurrentHeat(item, reactor, x, y) * 100 / this.getMaxHeat(item);
                var Reactormed = reactor.getHeat() * 100 / reactor.getMaxHeat();
                var add = Math.round(reactor.getMaxHeat() / 100 * (Reactormed + mymed / 2));
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
                }
                else if (Math.round(Reactormed * 10) / 10 == Math.round(mymed * 10) / 10) {
                    add = 0;
                }
                myHeat -= add;
                reactor.setHeat(reactor.getHeat() + add);
            }
            this.alterHeat(item, reactor, x, y, myHeat);
        };
        this.checkHeatAcceptor = function (reactor, x, y, heatAcceptors) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorAPI.getComponent(item.id);
                if (component && component.canStoreHeat(item)) {
                    var acceptor = { comp: component, item: item, x: x, y: y };
                    heatAcceptors.push(acceptor);
                }
            }
        };
    },
    heatVent: function (heatStorage, selfVent, reactorVent) {
        this.parent = ReactorAPI.heatStorage;
        this.parent(heatStorage);
        this.selfVent = selfVent;
        this.reactorVent = reactorVent;
        this.processChamber = function (item, reactor, x, y, heatrun) {
            if (heatrun) {
                if (this.reactorVent > 0) {
                    var rheat = reactor.getHeat();
                    var reactorDrain = rheat;
                    if (reactorDrain > this.reactorVent) {
                        reactorDrain = this.reactorVent;
                    }
                    rheat -= reactorDrain;
                    if ((reactorDrain = this.alterHeat(item, reactor, x, y, reactorDrain)) > 0) {
                        return;
                    }
                    reactor.setHeat(rheat);
                }
                var self = this.alterHeat(item, reactor, x, y, -this.selfVent);
                /* if (self <= 0) {
                    reactor.addEmitHeat(self + this.selfVent);
                } */
            }
        };
    },
    heatVentSpread: function (sideVent) {
        this.parent = ReactorAPI.reactorComponent;
        this.parent();
        this.sideVent = sideVent;
        this.processChamber = function (item, reactor, x, y, heatrun) {
            if (heatrun) {
                this.cool(reactor, x - 1, y);
                this.cool(reactor, x + 1, y);
                this.cool(reactor, x, y - 1);
                this.cool(reactor, x, y + 1);
            }
        };
        this.cool = function (reactor, x, y) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var comp = ReactorAPI.getComponent(item.id);
                if (comp && comp.canStoreHeat(item)) {
                    comp.alterHeat(item, reactor, x, y, -this.sideVent);
                    //reactor.addEmitHeat(self + this.sideVent);
                }
            }
        };
    },
    condensator: function (maxDmg) {
        this.parent = ReactorAPI.damageableReactorComponent;
        this.parent(maxDmg);
        this.canStoreHeat = function (item) {
            return this.getCurrentHeat(item) < this.maxDamage;
        };
        this.getMaxHeat = function (item) {
            return this.maxDamage;
        };
        this.getCurrentHeat = function (item) {
            return this.getCustomDamage(item);
        };
        this.alterHeat = function (item, reactor, x, y, heat) {
            if (heat < 0) {
                return heat;
            }
            var currentHeat = this.getCurrentHeat(item);
            var amount = Math.min(heat, this.getMaxHeat(item) - currentHeat);
            this.setCustomDamage(item, currentHeat + amount);
            return heat - amount;
        };
    },
};
