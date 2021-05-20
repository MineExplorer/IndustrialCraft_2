/// <reference path="./ArmorElectric.ts" />

class ArmorNanoSuit
extends ArmorElectric {
	constructor(stringID: string, name: string, params: ArmorParams, inCreative?: boolean) {
		super(stringID, name, params, 1000000, 2048, 3, inCreative);
		this.setRarity(EnumRarity.UNCOMMON);
	}

	getEnergyPerDamage(): number {
		return 4000;
	}

	getExtraDefence(): number {
		return 4;
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		let energyPerDamage = this.getEnergyPerDamage();
		let type = params.type;
		if (energyStored >= energyPerDamage && (type == 2 || type == 3 || type == 11)) {
			let energy = params.damage * energyPerDamage;
			ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energy, 0));
			return item;
		}
		return null;
	}
}

class ArmorNanoHelmet
extends ArmorNanoSuit {
	constructor(stringID: string, name: string, texture: string) {
		super(stringID, name, {type: "helmet", defence: 3, texture: texture});
		UIbuttons.setArmorButton(this.id, "button_nightvision");
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
			let pos = Entity.getPosition(playerUid);
			let time = World.getWorldTime() % 24000;
			let region = WorldRegion.getForActor(playerUid);
			if (region.getLightLevel(pos) > 13 && time <= 12000) {
				Entity.addEffect(playerUid, PotionEffect.blindness, 1, 25);
				Entity.clearEffect(playerUid, PotionEffect.nightVision);
			} else {
				Entity.addEffect(playerUid, PotionEffect.nightVision, 1, 225);
			}
			Entity.addEffect(playerUid, PotionEffect.nightVision, 1, 225);
			if (World.getThreadTime()%20 == 0) {
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
				return item;
			}
		}
		return null;
	}
}

class ArmorNanoChestplate
extends ArmorNanoSuit {
	constructor(stringID: string, name: string, texture: string) {
		super(stringID, name, {type: "chestplate", defence: 8, texture: texture});
	}
}

class ArmorNanoLeggings
extends ArmorNanoSuit {
	constructor(stringID: string, name: string, texture: string) {
		super(stringID, name, {type: "leggings", defence: 6, texture: texture});
	}
}

class ArmorNanoBoots
extends ArmorNanoSuit {
	constructor(stringID: string, name: string, texture: string) {
		super(stringID, name, {type: "boots", defence: 3, texture: texture});
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		let energyPerDamage = this.getEnergyPerDamage();
		if (params.type == 5 && energyStored >= energyPerDamage) {
			let damageReduce = Math.min(Math.min(9, params.damage), Math.floor(energyStored / energyPerDamage));
			let damageTaken = params.damage - damageReduce;
			if (damageTaken > 0) {
				Entity.setHealth(playerUid, Entity.getHealth(playerUid) + params.damage - damageTaken);
			} else {
				Game.prevent();
			}
			ChargeItemRegistry.setEnergyStored(item, energyStored - damageReduce * energyPerDamage);
			return item;
		}
		return super.onHurt(params, item, index, playerUid);
	}
}

/** @deprecated */
const NANO_ARMOR_FUNCS = {
	hurt: function(params: {attacker: number, damage: number, type: number, b1: boolean, b2: boolean}, item: ItemInstance, index: number) {
		return !!ArmorNanoSuit.prototype.onHurt(params, item, index, Player.get());
	},
	tick: function(item: ItemInstance, index: number) {
		return !!ArmorNanoSuit.prototype.onTick(item, index, Player.get());
	}
}