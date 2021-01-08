/// <reference path="./ArmorElectric.ts" />

class ArmorQuantumSuit
extends ArmorElectric {
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
		var instance = new ArmorQuantumSuit(nameID, this.name, {type: this.armorType, defence: defence, texture: texture}, true);
		instance.chargedID = this.id;
		this.dischargedID = instance.id;
	}

	getEnergyPerDamage(): number {
		return 5000;
	}

	absorbDamage(player: number, type: number, damage: number) {
		let absorbedDamage = damage;
		for (let i = 0; i < 4; i++) {
			let item = Entity.getArmorSlot(player, i);
			let armor = ItemRegistry.getInstanceOf(item.id);
			if (armor instanceof ArmorQuantumSuit) {
				var energyStored = ChargeItemRegistry.getEnergyStored(item);
				absorbedDamage = Math.min(absorbedDamage, Math.floor(energyStored / armor.getEnergyPerDamage()));
			}
			else return;
		}
		if (absorbedDamage > 0) {
			let receivedDamage = (type == 11)? Math.floor(absorbedDamage / 5) : Math.ceil(absorbedDamage / 5);
			let playerHealth = Math.min(Entity.getMaxHealth(player), Entity.getHealth(player));
			Entity.setHealth(player, playerHealth + receivedDamage);
		}
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, player: number): ItemInstance {
		var type = params.type;
		var energyStored = ChargeItemRegistry.getEnergyStored(item);
		var energyPerDamage = this.getEnergyPerDamage();
		if (energyStored >= energyPerDamage) {
			if (type == 2 || type == 3 || type == 11) {
				if (index == 0) this.absorbDamage(player, type, params.damage);
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
			Utils.fixFallDamage(player, params.damage);
		}
		return item;
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
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
						Entity.clearEffect(playerUid, PotionEffect.poison);
						newEnergyStored -= 100000;
					}
				} else {
					Entity.clearEffect(playerUid, PotionEffect.poison);
				}
				Entity.clearEffect(playerUid, PotionEffect.wither);

				let player = new PlayerActor(playerUid);
				var hunger = player.getHunger();
				if (hunger < 20 && newEnergyStored >= 500) {
					var i = World.getThreadTime()%36;
					var slot = player.getInventorySlot(i);
					if (slot.id == ItemID.tinCanFull) {
						var count = Math.min(20 - hunger, slot.count);
						player.setHunger(hunger + count);
						slot.count -= count;
						player.setInventorySlot(i, slot.count ? slot.id : 0, slot.count, slot.data, slot.extra);
						player.addItemToInventory(ItemID.tinCanEmpty, count, 0, null, true);
						newEnergyStored -= 500;
						break;
					}
				}
				// night vision
				if (newEnergyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
					var coords = Entity.getPosition(playerUid);
					var time = World.getWorldTime()%24000;
					let region = BlockSource.getDefaultForActor(playerUid);
					if (region.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
						Entity.addEffect(playerUid, PotionEffect.blindness, 1, 25);
						Entity.clearEffect(playerUid, PotionEffect.nightVision);
					} else {
						Entity.addEffect(playerUid, PotionEffect.nightVision, 1, 225);
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
					var vel = Entity.getVelocity(playerUid);
					if (energyStored < 8 || Utils.isOnGround(playerUid)) {
						item.extra.putBoolean("hover", false);
						Game.message("§4" + Translation.translate("Hover mode disabled"));
						return item;
					}
					else if (vel.y < -0.1) {
						Entity.addVelocity(playerUid, 0, Math.min(0.25, -0.1 - vel.y), 0);
						if (World.getThreadTime()%5 == 0) {
							ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
							return item;
						}
					}
				}
				Entity.setFire(playerUid, 0, true);
			break;
			case 2:
				var vel = Entity.getVelocity(playerUid);
				var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z);
				// Game.tipMessage(horizontalVel);
				if (horizontalVel <= 0.15) {
					ArmorQuantumSuit.runTime = 0;
				}
				else if (Utils.isOnGround(playerUid)) {
					ArmorQuantumSuit.runTime++;
				}
				if (ArmorQuantumSuit.runTime > 2 && !Player.getFlying()) {
					Entity.addEffect(playerUid, PotionEffect.movementSpeed, 6, 5);
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

/** @deprecated */
var QUANTUM_ARMOR_FUNCS = {
	hurt: function(params: {attacker: number, damage: number, type: number, b1: boolean, b2: boolean}, item: ItemInstance, index: number) {
		return ArmorQuantumSuit.prototype.onHurt(params, item, index, Player.get())
	},
	tick: function(item: ItemInstance, index: number) {
		return ArmorQuantumSuit.prototype.onTick(item, index, Player.get())
	}
}