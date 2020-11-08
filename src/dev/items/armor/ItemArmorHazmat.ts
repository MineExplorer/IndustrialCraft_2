/// <reference path="./ItemArmorIC2.ts" />

class ItemArmorHazmat
extends ItemArmorIC2
implements OnHurtListener, OnTickListener {
	constructor(nameID: string, name: string, params: {type: ArmorType, defence: number, texture?: string}) {
		super(nameID, name, params);
		this.setMaxDamage(64);
		RadiationAPI.registerHazmatArmor(this.id);
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerEnt: number): ItemInstance {
		if (params.type == 9 && index == 0) {
			let player = new PlayerActor(playerEnt);
			for (var i = 0; i < 36; i++) {
				var slot = player.getInventorySlot(i);
				if (slot.id == ItemID.cellAir) {
					Game.prevent();
					Entity.addEffect(playerEnt, PotionEffect.waterBreathing, 1, 60);
					player.setInventorySlot(i, slot.id, slot.count - 1, 0);
					player.addItemToInventory(ItemID.cellEmpty, 1, 0, null, true);
					break;
				}
			}
		}
		if (params.type == 5 && index == 3) {
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
			return item;
		}
		return null;
	}

	onTick(item: ItemInstance, index: number, playerEnt: number): void {
		let player = new PlayerActor(playerEnt);
		if (index == 0
			&& player.getArmor(1).id == ItemID.hazmatChestplate
			&& player.getArmor(2).id == ItemID.hazmatLeggings
			&& player.getArmor(3).id == ItemID.rubberBoots) {
			if (RadiationAPI.playerRad <= 0) {
				Entity.clearEffect(playerEnt, PotionEffect.poison);
			}
			Entity.clearEffect(playerEnt, PotionEffect.wither);
		}
	}
}
