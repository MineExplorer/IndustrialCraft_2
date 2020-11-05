/// <reference path="./ItemArmorElectric.ts" />

class ItemArmorQuantumSuit
extends ItemArmorElectric {
	static runTime: number = 0
	isCharged: boolean
	chargedID: number
	dischargedID: number

	constructor(nameID: string, name: string, params: {type: ArmorType, defence: number, texture?: string}, isDischarged: boolean = false) {
		if (!params.texture) params.texture = "quantum";
		super(nameID, name, params, 1e7, 12000, 4, !isDischarged);
		this.setRarity(2);
		this.isCharged = !isDischarged;
		RadiationAPI.registerHazmatArmor(this.id);
		if (!isDischarged) {
			this.createDischarged(params.defence - 1, params.texture);
		}
	}

	getCharged(): number {
		return this.chargedID;
	}

	getDischarged(): number {
		return this.dischargedID;
	}

	createDischarged(defence: number, texture: string) {
		var nameID = this.nameID + "Discharged";
		var instance = new ItemArmorQuantumSuit(nameID, this.name, {type: this.armorType, defence: defence, texture: texture}, true);
		instance.chargedID = this.id;
		this.dischargedID = instance.id;
	}

	getEnergyPerDamage(): number {
		return 5000;
	}

	canAbsorbDamage(item: ItemInstance, damage: number) {
		if (this.isCharged || ChargeItemRegistry.getEnergyStored(item) >= this.getEnergyPerDamage() * damage) {
			return item;
		}
		return false;
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, player: number): ItemInstance {
		var type = params.type;
		var energyStored = ChargeItemRegistry.getEnergyStored(item);
		var energyPerDamage = this.getEnergyPerDamage();
		if (energyStored >= energyPerDamage) {
			if ((type == 2 || type == 3 || type == 11) && params.damage > 0) {
				var energy = params.damage * energyPerDamage;
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energy, 0));
			}
			if (index == 3 && type == 5) {
				var damage = Math.min(Utils.getFallDamage(), params.damage);
				if (damage > 0) {
					var damageReduce = Math.min(damage, Math.floor(energyStored / energyPerDamage));
					var damageTaken = damage - damageReduce;
					if (damageTaken > 0) {
						Entity.setHealth(player, Entity.getHealth(player) + params.damage - damageTaken);
					} else {
						Game.prevent();
					}
					ChargeItemRegistry.setEnergyStored(item, energyStored - damageReduce * energyPerDamage);
				}
			}
			if (index == 3 && type == 22) {
				Game.prevent();
				ChargeItemRegistry.setEnergyStored(item, energyStored - energyPerDamage);
			}
		}
		if (index == 0 && type == 9 && energyStored >= 500) {
			Game.prevent();
			Entity.addEffect(player, PotionEffect.waterBreathing, 1, 60);
			ChargeItemRegistry.setEnergyStored(item, energyStored - 500);
		}
		if (index == 1 && type == 5) {
			Utils.fixFallDamage(params.damage);
		}
		return item;
	}

	onTick(item: ItemInstance, index: number, playerEnt: number): ItemInstance {
		var energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (this.isCharged && energyStored < this.getEnergyPerDamage()) {
			item.id = this.getDischarged();
			return item;
		}
		if (!this.isCharged && energyStored >= this.getEnergyPerDamage()) {
			item.id = this.getCharged();
			return item;
		}
		if (energyStored > 0) {
			switch (index) {
			case 0:
				var newEnergyStored = energyStored;
				if (RadiationAPI.playerRad > 0) {
					if (energyStored >= 100000) {
						RadiationAPI.playerRad = 0;
						Entity.clearEffect(playerEnt, PotionEffect.poison);
						newEnergyStored -= 100000;
					}
				} else {
					Entity.clearEffect(playerEnt, PotionEffect.poison);
				}
				Entity.clearEffect(playerEnt, PotionEffect.wither);
				
				let player = new PlayerActor(playerEnt);
				var hunger = player.getHunger();
				if (hunger < 20 && newEnergyStored >= 500) {
					var i = World.getThreadTime()%36;
					var slot = player.getInventorySlot(i);
					if (slot.id == ItemID.tinCanFull) {
						var count = Math.min(20 - hunger, slot.count);
						player.setHunger(hunger + count);
						slot.count -= count;
						player.setInventorySlot(i, slot.count ? slot.id : 0, slot.count, slot.data);
						player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
						newEnergyStored -= 500;
						break;
					}
				}
				// night vision
				if (newEnergyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
					var coords = Entity.getPosition(playerEnt);
					var time = World.getWorldTime()%24000;
					let region = BlockSource.getDefaultForActor(playerEnt);
					if (region.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
						Entity.addEffect(playerEnt, PotionEffect.blindness, 1, 25);
						Entity.clearEffect(playerEnt, PotionEffect.nightVision);
					} else {
						Entity.addEffect(playerEnt, PotionEffect.nightVision, 1, 225);
					}
					if (World.getThreadTime()%20 == 0) {
						newEnergyStored = Math.max(newEnergyStored - 20, 0);
					}
				}
				
				if (energyStored != newEnergyStored) {
					ChargeItemRegistry.setEnergyStored(item, newEnergyStored);
					return item;
				}
			break;
			case 1:
				if (item.extra && item.extra.getBoolean("hover")) {
					Utils.resetFallHeight();
					var vel = Entity.getVelocity(playerEnt);
					if (Utils.isPlayerOnGround() || energyStored < 8) {
						item.extra.putBoolean("hover", false);
						Game.message("§4" + Translation.translate("Hover mode disabled"));
						return item;
					}
					else if (vel.y < -0.1) {
						Entity.addVelocity(playerEnt, 0, Math.min(0.25, -0.1 - vel.y), 0);
						if (World.getThreadTime()%5 == 0) {
							ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
							return item;
						}
					}
				}
				Entity.setFire(playerEnt, 0, true);
			break;
			case 2:
				var vel = Entity.getVelocity(playerEnt);
				var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z);
				// Game.tipMessage(horizontalVel);
				if (horizontalVel <= 0.15) {
					ItemArmorQuantumSuit.runTime = 0;
				}
				else if (Utils.isPlayerOnGround()) {
					ItemArmorQuantumSuit.runTime++;
				}
				if (ItemArmorQuantumSuit.runTime > 2 && !Player.getFlying()) {
					Entity.addEffect(playerEnt, PotionEffect.movementSpeed, 6, 5);
					if (World.getThreadTime()%5 == 0) {
						ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - Math.floor(horizontalVel*600)));
						return item;
					}
				}
			break;
			}
		}
		return null;
	}
}


function canAbsorbDamage(damage: number) {
	for (var i = 0; i < 4; i++) {
		var slot = Player.getArmorSlot(i);
		var armor = ItemRegistry.getInstanceOf(slot.id);
		if (!(armor instanceof ItemArmorQuantumSuit && armor.canAbsorbDamage(slot, damage)))
			return false;
	}
	return slot;
}

Callback.addCallback("EntityHurt", function(attacker: number, victim: number, damage: number, type: number) {
	if (victim == player && Game.getGameMode() != 1 && damage > 0 && (type == 2 || type == 3 || type == 11) && canAbsorbDamage(damage)) {
		Game.prevent();
		if (type == 2) {	
			runOnMainThread(function() {
				Entity.damageEntity(player, 0, type, {attacker: attacker, bool1: true});
			});
		}
		if (type == 3) {	
			runOnMainThread(function() {
				Entity.damageEntity(player, 0, type, {attacker: -1, bool1: true});
			});
			var vel = Entity.getVelocity(attacker);
			var hs = Math.sqrt(vel.x * vel.x + vel.z * vel.z)
			Player.addVelocity(vel.x * 0.3 / hs, 0.25, vel.z * 0.3 / hs);
			Entity.remove(attacker);
		}
	}
});

Callback.addCallback("Explosion", function(coords: Vector, params: {power: number, entity: number, onFire: boolean, someBool: boolean, someFloat: number}) {
	var pos = Player.getPosition();
	var distance = Entity.getDistanceBetweenCoords(coords, pos);
	if (distance <= params.power && canAbsorbDamage(1)) {
		Entity.damageEntity(Player.get(), 0, 11, {attacker: params.entity, bool1: true});
	}
});

/** @deprecated */
var QUANTUM_ARMOR_FUNCS = {
	hurt: function(params: {attacker: number, damage: number, type: number, b1: boolean, b2: boolean}, item: ItemInstance, index: number) {
		return ItemArmorQuantumSuit.prototype.onHurt(params, item, index, Player.get())
	},
	tick: function(item: ItemInstance, index: number) {
		return ItemArmorQuantumSuit.prototype.onTick(item, index, Player.get())
	}
}