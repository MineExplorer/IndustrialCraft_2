var RadiationAPI = {
    items: {},
    playerRad: 0,
    sources: {},
    hazmatArmor: [],
    regRadioactiveItem: function (id, duration, stack) {
        this.items[id] = [duration, stack || false];
    },
    getItemRadiation: function (id) {
        return this.items[id];
    },
    isRadioactiveItem: function (id) {
        return this.items[id] ? true : false;
    },
    emitItemRadiation: function (id) {
        var radiation = this.getItemRadiation(id);
        if (radiation) {
            if (radiation[1]) {
                this.addRadiation(radiation[0]);
            }
            else {
                this.setRadiation(radiation[0]);
            }
            return true;
        }
        return false;
    },
    setRadiation: function (duration) {
        this.playerRad = Math.max(this.playerRad, duration);
    },
    addRadiation: function (duration) {
        this.playerRad = Math.max(this.playerRad + duration, 0);
    },
    registerHazmatArmor: function (id) {
        this.hazmatArmor.push(id);
    },
    checkPlayerArmor: function () {
        for (var i_1 = 0; i_1 < 4; i_1++) {
            var armorID = Player.getArmorSlot(i_1).id;
            if (this.hazmatArmor.indexOf(armorID) == -1)
                return true;
        }
        return false;
    },
    addEffect: function (ent, duration) {
        if (ent == player) {
            if (this.checkPlayerArmor()) {
                Entity.addEffect(player, PotionEffect.poison, 1, duration * 20);
                this.setRadiation(duration);
            }
        }
        else {
            Entity.addEffect(ent, PotionEffect.poison, 1, duration * 20);
            if (Entity.getHealth(ent) == 1) {
                Entity.damageEntity(ent, 1);
            }
        }
    },
    addEffectInRange: function (x, y, z, radius, duration) {
        var entities = Entity.getAll();
        for (var i_2 in entities) {
            var ent = entities[i_2];
            if (canTakeDamage(ent, "radiation") && Entity.getHealth(ent) > 0) {
                var c = Entity.getPosition(ent);
                var xx = Math.abs(x - c.x), yy = Math.abs(y - c.y), zz = Math.abs(z - c.z);
                if (Math.sqrt(xx * xx + yy * yy + zz * zz) <= radius) {
                    this.addEffect(ent, duration);
                }
            }
        }
    },
    addRadiationSource: function (x, y, z, radius, duration) {
        this.sources[x + ':' + y + ':' + z] = {
            x: x,
            y: y,
            z: z,
            radius: radius,
            timer: duration
        };
    },
    tick: function () {
        if (World.getThreadTime() % 20 == 0) {
            var radiation = false;
            if (this.checkPlayerArmor()) {
                for (var i_3 = 9; i_3 < 45; i_3++) {
                    var slot = Player.getInventorySlot(i_3);
                    if (this.emitItemRadiation(slot.id)) {
                        radiation = true;
                    }
                }
            }
            if (!radiation) {
                this.addRadiation(-1);
            }
            var armor = Player.getArmorSlot(0);
            if (this.playerRad > 0 && !(armor.id == ItemID.quantumHelmet && ChargeItemRegistry.getEnergyStored(armor) >= 100000)) {
                Entity.addEffect(player, PotionEffect.poison, 1, this.playerRad * 20);
                if (Entity.getHealth(player) == 1) {
                    Entity.damageEntity(player, 1);
                }
            }
            for (var i_4 in this.sources) {
                var source = this.sources[i_4];
                this.addEffectInRange(source.x, source.y, source.z, source.radius, 10);
                source.timer--;
                if (source.timer <= 0) {
                    delete this.sources[i_4];
                }
            }
        }
    }
};
Saver.addSavesScope("radiation", function read(scope) {
    RadiationAPI.playerRad = scope.duration || 0;
    RadiationAPI.sources = scope.sources || {};
}, function save() {
    return {
        duration: RadiationAPI.playerRad,
        sources: RadiationAPI.sources
    };
});
Callback.addCallback("tick", function () {
    RadiationAPI.tick();
});
Callback.addCallback("EntityDeath", function (entity) {
    if (entity == player) {
        RadiationAPI.playerRad = 0;
    }
});
