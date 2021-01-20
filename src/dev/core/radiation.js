let RadiationAPI = {
	items: {},
	playerRad: 0,
	sources: {},
	hazmatArmor: [],

	setRadioactivity: function(itemID, duration, stack) {
		this.items[itemID] = [duration, stack || false];
	},

	getRadioactivity: function(itemID) {
		return this.items[itemID];
	},

	isRadioactiveItem: function(itemID) {
		return !!this.items[itemID];
	},

	emitItemRadiation: function(itemID) {
		let radiation = this.getRadioactivity(itemID);
		if (radiation) {
			if (radiation[1]) {
				this.addRadiation(radiation[0]);
			} else {
				this.setRadiation(radiation[0]);
			}
			return true;
		}
		return false;
	},

	setRadiation: function(duration) {
		this.playerRad = Math.max(this.playerRad, duration);
	},

	addRadiation: function(duration) {
		this.playerRad = Math.max(this.playerRad + duration, 0);
	},

	registerHazmatArmor: function(id) {
		this.hazmatArmor.push(id);
	},

	checkPlayerArmor: function() {
		for (let i = 0; i < 4; i++) {
			let armorID = Player.getArmorSlot(i).id;
			if (this.hazmatArmor.indexOf(armorID) == -1) return true;
		}
		return false;
	},

	addEffect: function(ent, duration) {
		if (ent == Player.get()) {
			if (this.checkPlayerArmor()) {
				Entity.addEffect(Player.get(), PotionEffect.poison, 1, duration * 20);
				this.setRadiation(duration);
			}
		} else {
			Entity.addEffect(ent, PotionEffect.poison, 1, duration * 20);
			if (Entity.getHealth(ent) == 1) {
				Entity.damageEntity(ent, 1);
			}
		}
	},

	addEffectInRange: function(x, y, z, radius, duration) {
		let entities = Entity.getAll();
		for (let i in entities) {
			let ent = entities[i];
			if (canTakeDamage(ent, "radiation") && Entity.getHealth(ent) > 0) {
				let c = Entity.getPosition(ent);
				let xx = Math.abs(x - c.x), yy = Math.abs(y - c.y), zz = Math.abs(z - c.z);
				if (Math.sqrt(xx*xx + yy*yy + zz*zz) <= radius) {
					this.addEffect(ent, duration);
				}
			}
		}
	},

	addRadiationSource: function(x, y, z, radius, duration) {
		this.sources[x+':'+y+':'+z] = {
			x: x,
			y: y,
			z: z,
			radius: radius,
			timer: duration
		}
	},

	tick: function() {
		if (World.getThreadTime()%20 == 0) {
			let radiation = false;
			if (this.checkPlayerArmor()) {
				for (let i = 9; i < 45; i++) {
					let slot = Player.getInventorySlot(i);
					if (this.emitItemRadiation(slot.id)) {
						radiation = true;
					}
				}
			}
			if (!radiation) {
				this.addRadiation(-1);
			}
			let armor = Player.getArmorSlot(0);
			if (this.playerRad > 0 && !(armor.id == ItemID.quantumHelmet && ChargeItemRegistry.getEnergyStored(armor) >= 100000)) {
				Entity.addEffect(Player.get(), PotionEffect.poison, 1, this.playerRad * 20);
				if (Entity.getHealth(Player.get()) == 1) {
					Entity.damageEntity(Player.get(), 1);
				}
			}
			for (let i in this.sources) {
				let source = this.sources[i];
				this.addEffectInRange(source.x, source.y, source.z, source.radius, 10);
				source.timer--;
				if (source.timer <= 0) {
					delete this.sources[i];
				}
			}
		}
	}
}

Saver.addSavesScope("radiation",
    function read(scope) {
        RadiationAPI.playerRad = scope.duration || 0;
		RadiationAPI.sources = scope.sources || {};
    },
    function save() {
        return {
            duration: RadiationAPI.playerRad,
			sources: RadiationAPI.sources
        }
    }
);

Callback.addCallback("tick", function() {
	RadiationAPI.tick();
});

Callback.addCallback("EntityDeath", function(entity) {
	if (entity == Player.get()) {
		RadiationAPI.playerRad = 0;
	}
});
