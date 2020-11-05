/// <reference path="./ItemArmorIC2.ts" />

class ItemArmorHazmat
extends ItemArmorIC2
implements OnHurtListener, OnTickListener {
	constructor(nameID: string, name: string, params: {type: ArmorType, defence: number, texture?: string}) {
		super(nameID, name, params);
		this.setMaxDamage(64);
		RadiationAPI.registerHazmatArmor(this.id);
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, player: number): boolean {
		var type = params.type;
		if (type == 2 || type == 3 || type == 11) {
			item.data += Math.ceil(params.damage / 4);
			if (item.data >= Item.getMaxDamage(this.id)) {
				item.id = item.count = 0;
			}
			return true;
		}
		if (type == 9 && index == 0) {
			for (var i = 0; i < 36; i++) {
				var slot = Player.getInventorySlot(i);
				if (slot.id == ItemID.cellAir) {
					Game.prevent();
					Entity.addEffect(player, PotionEffect.waterBreathing, 1, 60);
					Player.setInventorySlot(i, slot.count > 1 ? slot.id : 0, slot.count - 1, 0);
					Player.addItemToInventory(ItemID.cellEmpty, 1, 0);
					break;
				}
			}
		}
		if (type == 5 && index == 3) {
			var Dp = Math.floor(params.damage/8);
			var Db = Math.floor(params.damage*7/16);
			if (Dp < 1) {
				Game.prevent();
			} else {
				Entity.setHealth(player, Entity.getHealth(player) + params.damage - Dp);
			}
			item.data += Db;
			if (item.data >= Item.getMaxDamage(this.id)) {
				item.id = item.count = 0;
			}
			return true;
		}
		return false;
	}

	onTick(item: ItemInstance, index: number, player: number): boolean {
		if (index == 0
			&& Entity.getArmorSlot(player, 1).id == ItemID.hazmatChestplate
			&& Entity.getArmorSlot(player, 2).id == ItemID.hazmatLeggings
			&& Entity.getArmorSlot(player, 3).id == ItemID.rubberBoots) {
			if (RadiationAPI.playerRad <= 0) {
				Entity.clearEffect(player, PotionEffect.poison);
			}
			Entity.clearEffect(player, PotionEffect.wither);
		}
		return false;
	}
}
