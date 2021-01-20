/// <reference path="./ArmorElectric.ts" />

class ArmorQuantumSuit
extends ArmorElectric {
	static runTime: number = 0

	constructor(stringID: string, name: string, params: ArmorParams, isDischarged: boolean = false) {
		super(stringID, name, params, 1e7, 12000, 4);
		this.setRarity(EnumRarity.RARE);
		RadiationAPI.registerHazmatArmor(this.id);
	}

	getEnergyPerDamage(): number {
		return 5000;
	}

	getExtraDefence(): number {
		return 5;
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		let type = params.type;
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		let energyPerDamage = this.getEnergyPerDamage();
		if (energyStored >= energyPerDamage) {
			if (type == 2 || type == 3 || type == 11) {
				let energy = params.damage * energyPerDamage;
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energy, 0));
			}
			if (index == 3 && type == 5) {
				let damage = Math.min(Utils.getFallDamage(), params.damage);
				if (damage > 0) {
					let damageReduce = Math.min(damage, Math.floor(energyStored / energyPerDamage));
					let damageTaken = damage - damageReduce;
					if (damageTaken > 0) {
						Entity.setHealth(playerUid, Entity.getHealth(playerUid) + params.damage - damageTaken);
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
			Entity.addEffect(playerUid, PotionEffect.waterBreathing, 1, 60);
			ChargeItemRegistry.setEnergyStored(item, energyStored - 500);
		}
		if (index == 1 && type == 5) {
			Utils.fixFallDamage(playerUid, params.damage);
		}
		return item;
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored <= 0) return null;

		switch (index) {
		case 0:
			let newEnergyStored = energyStored;
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

			let player = new PlayerInterface(playerUid);
			let hunger = player.getHunger();
			if (hunger < 20 && newEnergyStored >= 500) {
				let i = World.getThreadTime()%36;
				let stack = player.getInventorySlot(i);
				if (stack.id == ItemID.tinCanFull) {
					let count = Math.min(20 - hunger, stack.count);
					player.setHunger(hunger + count);
					stack.decrease(count);
					player.setInventorySlot(i, stack);
					player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
					newEnergyStored -= 500;
					break;
				}
			}
			// night vision
			if (newEnergyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
				let coords = Entity.getPosition(playerUid);
				let time = World.getWorldTime() % 24000;
				let region = WorldRegion.getForActor(playerUid);
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
				let vel = Entity.getVelocity(playerUid);
				if (energyStored < 8 || Utils.isOnGround(playerUid)) {
					item.extra.putBoolean("hover", false);
					let client = Network.getClientForPlayer(playerUid);
					if (client) client.sendMessage("§4" + Translation.translate("Hover mode disabled"));
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
			let vel = Entity.getVelocity(playerUid);
			let horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z);
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
		return null;
	}
}

Callback.addCallback("EntityHurt", function(attacker: number, victim: number, damage: number, type: number) {
	if (damage > 0 && Entity.getType(victim) == 1 && (type == 2 || type == 3 || type == 11)) {
		let defencePoints = 0;
		for (let i = 0; i < 4; i++) {
			let item = Entity.getArmorSlot(victim, i);
			let armor = ItemRegistry.getInstanceOf(item.id);
			if (armor instanceof ArmorNanoSuit || armor instanceof ArmorQuantumSuit) {
				if (ChargeItemRegistry.getEnergyStored(item) >= armor.getEnergyPerDamage() * damage) {
					defencePoints += armor.getExtraDefence();
				}
			}
		}
		if (defencePoints > 0) {
			let damageGot = damage / 5;
			let damageReceived = damageGot * ( 20 - defencePoints) / 20;
			if (damageGot > 1) damageGot = Math.floor(damageGot);
			let damageAbsorbed = Math.ceil(damageGot - Math.floor(damageReceived));
			let health = Math.min(Entity.getMaxHealth(victim), Entity.getHealth(victim));
			if (damageReceived < 1) {
				if (damageGot < 1) {
					if (Math.random() >= damageReceived / damageGot) {
						runOnMainThread(() => {
							let curHealth = Entity.getHealth(victim);
							if (curHealth < health) {
								Entity.setHealth(victim, curHealth + 1);
							}
						});
					}
					return;
				}
				else if (Math.random() < damageReceived) {
					damageAbsorbed--;
				}
			}
			if (damageAbsorbed > 0) {
				Entity.setHealth(victim, health + damageAbsorbed);
			}
		}
	}
})

/** @deprecated */
const QUANTUM_ARMOR_FUNCS = {
	hurt: function(params: {attacker: number, damage: number, type: number, b1: boolean, b2: boolean}, item: ItemInstance, index: number) {
		return ArmorQuantumSuit.prototype.onHurt(params, item, index, Player.get())
	},
	tick: function(item: ItemInstance, index: number) {
		return ArmorQuantumSuit.prototype.onTick(item, index, Player.get())
	}
}