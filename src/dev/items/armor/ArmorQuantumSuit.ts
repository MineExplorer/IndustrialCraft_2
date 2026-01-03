/// <reference path="./ArmorElectric.ts" />
/// <reference path="./JetpackProvider.ts" />
/// <reference path="./PowerArmorDamageAbsorption.ts" />

class ArmorQuantumSuit extends ArmorElectric {
	constructor(stringID: string, name: string, params: ArmorParams, inCreative?: boolean) {
		super(stringID, name, params, 1e7, 12000, 4, inCreative);
		this.setRarity(EnumRarity.RARE);
		RadiationAPI.registerHazmatArmor(this.id);
	}

	getEnergyPerDamage(): number {
		return 10000;
	}

	getExtraDefence(): number {
		return 5;
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		const energyStored = ChargeItemRegistry.getEnergyStored(item);
		const energyPerDamage = this.getEnergyPerDamage();
		if (energyStored >= energyPerDamage && EntityHelper.isPhysicalDamage(params.type)) {
			if (params.type == EDamageCause.LAVA) { // fix lava damage being called each tick
				Entity.addEffect(playerUid, EPotionEffect.FIRE_RESISTANCE, 1, 10);
			}
			const energy = params.damage * energyPerDamage;
			ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energy, 0));
			return item;
		}
		return null;
	}
}

class ArmorQuantumHelmet extends ArmorQuantumSuit {
	constructor(stringID: string, name: string, texture: string) {
		super(stringID, name, {type: "helmet", defence: 3, texture: texture});
		ToolHUD.setButtonFor(this.id, "button_nightvision");
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		const energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (params.type == 9 && energyStored >= 500) {
			Game.prevent();
			Entity.addEffect(playerUid, EPotionEffect.WATER_BREATHING, 1, 60);
			ChargeItemRegistry.setEnergyStored(item, energyStored - 500);
		}
		return super.onHurt(params, item, index, playerUid);
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		const energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored <= 0) return null;

		let newEnergyStored = energyStored;
		if (newEnergyStored >= 10000 && RadiationAPI.getRadiation(playerUid)) {
			RadiationAPI.setRadiation(playerUid, 0);
			newEnergyStored -= 10000;
		}
		if (newEnergyStored >= 10000 && Entity.getEffect(playerUid, EPotionEffect.POISON).duration > 0) {
			Entity.clearEffect(playerUid, EPotionEffect.POISON);
			newEnergyStored -= 10000;
		}
		if (newEnergyStored >= 25000 && Entity.getEffect(playerUid, EPotionEffect.WITHER).duration > 0) {
			Entity.clearEffect(playerUid, EPotionEffect.WITHER);
			newEnergyStored -= 25000;
		}

		const player = new PlayerEntity(playerUid);
		const hunger = player.getHunger();
		if (hunger < 20 && newEnergyStored >= 500) {
			const i = World.getThreadTime()%36;
			const stack = player.getInventorySlot(i);
			if (stack.id == ItemID.tinCanFull) {
				const count = Math.min(20 - hunger, stack.count);
				player.setHunger(hunger + count);
				stack.decrease(count);
				player.setInventorySlot(i, stack);
				player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
				newEnergyStored -= 500;
			}
		}

		// night vision
		if (newEnergyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
			const coords = Entity.getPosition(playerUid);
			const time = World.getWorldTime() % 24000;
			const region = WorldRegion.getForActor(playerUid);
			if (region.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
				Entity.addEffect(playerUid, EPotionEffect.BLINDNESS, 1, 25);
				Entity.clearEffect(playerUid, EPotionEffect.NIGHT_VISION);
			} else {
				Entity.addEffect(playerUid, EPotionEffect.NIGHT_VISION, 1, 225);
			}
			if (World.getThreadTime()%20 == 0) {
				newEnergyStored = Math.max(newEnergyStored - 20, 0);
			}
		}

		if (energyStored != newEnergyStored) {
			ChargeItemRegistry.setEnergyStored(item, newEnergyStored);
			return item;
		}
		return null;
	}
}

class ArmorQuantumChestplate extends ArmorQuantumSuit
implements IJetpack {
	constructor(stringID: string, name: string, texture: string) {
		super(stringID, name, {type: "chestplate", defence: 8, texture: texture});
		JetpackProvider.registerItem(this.id, this);
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		if (BlockEngine.getMainGameVersion() >= 16 && params.type == 5 && !EntityHelper.isOnGround(playerUid)) {
			Game.prevent();
		}
		return super.onHurt(params, item, index, playerUid);
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		const energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored > this.getEnergyPerDamage()) {
			Entity.setFire(playerUid, 0, true);
		}
		return JetpackProvider.onTick(item, playerUid);
	}

	canFly(item: ItemInstance, playerPos: Vector): boolean {
		return playerPos.y < 256 && ChargeItemRegistry.getEnergyStored(item) >= 8;
	}
}

class ArmorQuantumLeggings extends ArmorQuantumSuit {
	runTime: number;

	constructor(stringID: string, name: string, texture: string) {
		super(stringID, name, {type: "leggings", defence: 6, texture: texture});
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		const energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored <= 0) return null;

		const vel = Entity.getVelocity(playerUid);
		const horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z);
		// Game.tipMessage(horizontalVel);
		if (horizontalVel <= 0.15) {
			this.runTime = 0;
		}
		else if (EntityHelper.isOnGround(playerUid)) {
			this.runTime++;
		}
		if (this.runTime > 2 && !Player.getFlying()) {
			Entity.addEffect(playerUid, EPotionEffect.MOVEMENT_SPEED, 6, 5);
			if (World.getThreadTime()%5 == 0) {
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - Math.floor(horizontalVel*600)));
				return item;
			}
		}
		return null;
	}
}

class ArmorQuantumBoots extends ArmorQuantumSuit {
	constructor(stringID: string, name: string, texture: string) {
		super(stringID, name, {type: "boots", defence: 3, texture: texture});
		ToolHUD.setButtonFor(this.id, "button_jump")
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		const energyStored = ChargeItemRegistry.getEnergyStored(item);
		const energyPerDamage = this.getEnergyPerDamage();
		if (params.type == 5) {
			const damageReduce = Math.min(params.damage, Math.floor(energyStored / energyPerDamage));
			const damageTaken = params.damage - damageReduce;
			if (damageTaken > 0) {
				Entity.setHealth(playerUid, Entity.getHealth(playerUid) + params.damage - damageTaken);
			} else {
				Game.prevent();
			}
			ChargeItemRegistry.setEnergyStored(item, energyStored - damageReduce * energyPerDamage);
		}
		if (params.type == 22) {
			Game.prevent();
			ChargeItemRegistry.setEnergyStored(item, energyStored - energyPerDamage);
		}
		return super.onHurt(params, item, index, playerUid);
	}
}

/** @deprecated */
const QUANTUM_ARMOR_FUNCS = {
	hurt: function(params: {attacker: number, damage: number, type: number, b1: boolean, b2: boolean}, item: ItemInstance, index: number) {
		return !!ArmorQuantumSuit.prototype.onHurt(params, item, index, Player.get());
	},
	tick: function(item: ItemInstance, index: number) {
		return !!ArmorQuantumSuit.prototype.onTick(item, index, Player.get());
	}
}