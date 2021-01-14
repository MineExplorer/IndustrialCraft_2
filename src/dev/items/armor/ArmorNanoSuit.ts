/// <reference path="./ArmorElectric.ts" />

class ArmorNanoSuit
extends ArmorElectric {
	constructor(stringID: string, name: string, params: {type: ArmorType, defence: number, texture?: string}) {
		if (!params.texture) params.texture = "nano";
		super(stringID, name, params, 1000000, 2048, 3);
		this.setRarity(1);
	}

	getEnergyPerDamage(): number {
		return 2000;
	}

	getExtraDefence(): number {
		return 4;
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, player: number): ItemInstance {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		let type = params.type;
		let energyPerDamage = this.getEnergyPerDamage();
		if (energyStored >= energyPerDamage) {
			if (type == 2 || type == 3 || type == 11) {
				let energy = params.damage * energyPerDamage;
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energy, 0));
			}
			if (index == 3 && type == 5) {
				let damage = Utils.getFallDamage();
				if (damage > 0) {
					damage = Math.min(damage, params.damage);
					let damageReduce = Math.min(Math.min(9, damage), Math.floor(energyStored / energyPerDamage));
					let damageTaken = damage - damageReduce;
					if (damageTaken > 0) {
						Entity.setHealth(player, Entity.getHealth(player) + params.damage - damageTaken);
					} else {
						Game.prevent();
					}
					ChargeItemRegistry.setEnergyStored(item, energyStored - damageReduce * energyPerDamage);
				}
			}
		}
		return item;
	}

	onTick(item: ItemInstance, index: number, player: number): ItemInstance {
		// night vision
		if (index == 0) {
			let energyStored = ChargeItemRegistry.getEnergyStored(item);
			if (energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
				let pos = Entity.getPosition(player);
				let time = World.getWorldTime()%24000;
				let region = WorldRegion.getForActor(player);
				if (region.getLightLevel(pos) > 13 && time <= 12000) {
					Entity.addEffect(player, PotionEffect.blindness, 1, 25);
					Entity.clearEffect(player, PotionEffect.nightVision);
				} else {
					Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
				}
				Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
				if (World.getThreadTime()%20 == 0) {
					ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
					return item;
				}
			}
		}
		return null;
	}
}

/** @deprecated */
let NANO_ARMOR_FUNCS = {
	hurt: function(params: {attacker: number, damage: number, type: number, b1: boolean, b2: boolean}, item: ItemInstance, index: number) {
		return ArmorNanoSuit.prototype.onHurt(params, item, index, Player.get())
	},
	tick: function(item: ItemInstance, index: number) {
		return ArmorNanoSuit.prototype.onTick(item, index, Player.get())
	}
}