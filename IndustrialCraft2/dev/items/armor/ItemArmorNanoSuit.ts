/// <reference path="./ItemArmorElectric.ts" />

class ItemArmorNanoSuit
extends ItemArmorElectric {
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
		let instance = new ItemArmorNanoSuit(nameID, this.name, {type: this.armorType, defence: defence, texture: texture}, true);
		instance.chargedID = this.id;
		this.dischargedID = instance.id;
	}

	getEnergyPerDamage(): number {
		return 2000;
	}
	
	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, player: number): boolean {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		let type = params.type;
		let energyPerDamage = this.getEnergyPerDamage();
		if (energyStored >= energyPerDamage) {
			if (type == 2 || type == 3 || type == 11) {
				let energy = params.damage * energyPerDamage;
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energy, 0));
				return true;
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
					return true;
				}
			}
		}
		return false;
	}

	onTick(item: ItemInstance, index: number, player: number): boolean {
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		let wasChanged = false;
		if (this.isCharged && energyStored < this.getEnergyPerDamage()) {
			item.id = this.getDischargedID();
			wasChanged = true;
		}
		if (!this.isCharged && energyStored >= this.getEnergyPerDamage()) {
			item.id = this.getChargedID();
			wasChanged = true;
		}
		// night vision
		if (index == 0 && energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
			let coords = Entity.getPosition(player);
			let time = World.getWorldTime()%24000;
			// let region = BlockSource.getDefaultForActor(player);
			// TODO: change to block source after Inner Core update
			if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
				Entity.addEffect(player, PotionEffect.blindness, 1, 25);
				Entity.clearEffect(player, PotionEffect.nightVision);
			} else {
				Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
			}
			Entity.addEffect(player, PotionEffect.nightVision, 1, 225);
			if (World.getThreadTime()%20 == 0) {
				ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
				return true;
			}
		}
		return wasChanged;
	}
}

/** @deprecated */
let NANO_ARMOR_FUNCS = {
	hurt: function(params: {attacker: number, damage: number, type: number, b1: boolean, b2: boolean}, item: ItemInstance, index: number) {
		return ItemArmorNanoSuit.prototype.onHurt(params, item, index, Player.get())
	},
	tick: function(item: ItemInstance, index: number): boolean {
		return ItemArmorNanoSuit.prototype.onTick(item, index, Player.get())
	}
}