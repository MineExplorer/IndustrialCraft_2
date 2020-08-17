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
		var nameID = this.nameID + "Discharged";
		var instance = new ItemArmorNanoSuit(nameID, this.name, {type: this.armorType, defence: defence, texture: texture}, true);
		instance.chargedID = this.id;
		this.dischargedID = instance.id;
	}

	getEnergyPerDamage(): number {
		return 2000;
	}
	
	onHurt(params: {attacker: number, damage: number, type: number}, slot: ItemInstance, index: number): boolean {
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		var type = params.type;
		var energyPerDamage = this.getEnergyPerDamage();
		if (energyStored >= energyPerDamage) {
			if (type == 2 || type == 3 || type == 11) {
				var energy = params.damage * energyPerDamage;
				ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - energy, 0));
				return true;
			}
			if (index == 3 && type == 5) {
				var damage = Utils.getFallDamage();
				if (damage > 0) {
					damage = Math.min(damage, params.damage);
					var damageReduce = Math.min(Math.min(9, damage), Math.floor(energyStored / energyPerDamage));
					var damageTaken = damage - damageReduce;
					if (damageTaken > 0) {
						Entity.setHealth(player, Entity.getHealth(player) + params.damage - damageTaken);
					} else {
						Game.prevent();
					}
					ChargeItemRegistry.setEnergyStored(slot, energyStored - damageReduce * energyPerDamage);
					return true;
				}
			}
		}
		return false;
	}

	onTick(slot: ItemInstance, index: number): boolean {
		var energyStored = ChargeItemRegistry.getEnergyStored(slot);
		if (this.isCharged && energyStored < this.getEnergyPerDamage()) {
			slot.id = this.getDischargedID();
			Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
		}
		if (!this.isCharged && energyStored >= this.getEnergyPerDamage()) {
			slot.id = this.getChargedID();
			Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
		}
		// night vision
		if (index == 0 && energyStored > 0 && slot.extra && slot.extra.getBoolean("nv")) {
			var coords = Player.getPosition();
			var time = World.getWorldTime()%24000;
			if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
				Entity.addEffect(Player.get(), PotionEffect.blindness, 1, 25);
				Entity.clearEffect(Player.get(), PotionEffect.nightVision);
			} else {
				Entity.addEffect(Player.get(), PotionEffect.nightVision, 1, 225);
			}
			Entity.addEffect(Player.get(), PotionEffect.nightVision, 1, 225);
			if (World.getThreadTime()%20 == 0) {
				ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
				Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
			}
		}
		return false;
	}
}

// deprecated
var NANO_ARMOR_FUNCS = {
	hurt: function(params: {attacker: number, damage: number, type: number, b1: boolean, b2: boolean}, item: ItemInstance, index: number) {
		return ItemArmorNanoSuit.prototype.onHurt(params, item, index)
	},
	tick: function(item: ItemInstance, index: number): boolean {
		return ItemArmorNanoSuit.prototype.onTick(item, index)
	}
}