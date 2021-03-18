/// <reference path="./ArmorIC2.ts" />

class ArmorHazmat
extends ArmorIC2
implements OnHurtListener, OnTickListener {
	constructor(stringID: string, name: string, params: ArmorParams) {
		super(stringID, name, params);
		this.setMaxDamage(64);
		RadiationAPI.registerHazmatArmor(this.id);
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		if (params.type == 9 && index == 0) {
			let player = new PlayerEntity(playerUid);
			for (let i = 0; i < 36; i++) {
				let stack = player.getInventorySlot(i);
				if (stack.id == ItemID.cellAir) {
					Game.prevent();
					Entity.addEffect(playerUid, PotionEffect.waterBreathing, 1, 60);
					stack.decrease(1);
					player.setInventorySlot(i, stack);
					player.addItemToInventory(ItemID.cellEmpty, 1, 0);
					break;
				}
			}
		}
		if (params.type == 5 && index == 3) {
			let Dp = Math.floor(params.damage/8);
			let Db = Math.floor(params.damage*7/16);
			if (Dp < 1) {
				Game.prevent();
			} else {
				Entity.setHealth(playerUid, Entity.getHealth(playerUid) + params.damage - Dp);
			}
			item.data += Db;
			if (item.data >= Item.getMaxDamage(this.id)) {
				item.id = item.count = 0;
			}
			return item;
		}
		return null;
	}

	onTick(item: ItemInstance, index: number, playerUid: number): void {
		let player = new PlayerActor(playerUid);
		if (index == 0
			&& player.getArmor(1).id == ItemID.hazmatChestplate
			&& player.getArmor(2).id == ItemID.hazmatLeggings
			&& player.getArmor(3).id == ItemID.rubberBoots) {
			if (RadiationAPI.getRadiation(playerUid) <= 0) {
				Entity.clearEffect(playerUid, PotionEffect.poison);
			}
			Entity.clearEffect(playerUid, PotionEffect.wither);
		}
	}
}
