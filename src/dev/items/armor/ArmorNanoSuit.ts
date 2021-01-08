/// <reference path="./ArmorElectric.ts" />

class ArmorNanoSuit
extends ArmorElectric {
	isCharged: boolean
	chargedID: number
	dischargedID: number

	constructor(nameID: string, name: string, params: {type: ArmorType, defence: number, texture?: string}, isDischarged: boolean = false) {
		if (!params.texture) params.texture = "nano";
		super(nameID, name, params, 1000000, 2048, 3, !isDischarged);
		this.setRarity(1);
		this.isCharged = !isDischarged;
		if (!isDischarged) {
			this.createDischarged(params.defence - 1, params.texture);
			if (params.type == "helmet") UIbuttons.setArmorButton(this.id, "button_nightvision");
		}
	}

	getChargedID(): number {
		return this.chargedID;
	}

	getDischargedID(): number {
		return this.dischargedID;
	}

	createDischarged(defence: number, texture: string) {
		let nameID = this.nameID + "Discharged";
		let instance = new ArmorNanoSuit(nameID, this.name, {type: this.armorType, defence: defence, texture: texture}, true);
		instance.chargedID = this.id;
		this.dischargedID = instance.id;
	}

	getEnergyPerDamage(): number {
		return 2000;
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
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (this.isCharged && energyStored < this.getEnergyPerDamage()) {
			item.id = this.getDischargedID();
			return item;
		}
		if (!this.isCharged && energyStored >= this.getEnergyPerDamage()) {
			item.id = this.getChargedID();
			return item;
		}
		// night vision
		if (index == 0 && energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
			let pos = Entity.getPosition(player);
			let time = World.getWorldTime()%24000;
			let region = BlockSource.getDefaultForActor(player);
			if (region.getLightLevel(pos.x, pos.y, pos.z) > 13 && time <= 12000) {
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