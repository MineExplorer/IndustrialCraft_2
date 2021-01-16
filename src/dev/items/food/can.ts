class ItemTinCanFull
extends ItemCommon
implements ItemBehavior {
	constructor() {
		super("tinCanFull", "Filled Tin Can", {name: "tin_can", meta: 1});
	}

	onNameOverride(item: ItemInstance, name: string): string {
		if (item.data > 0) {
			return name + "\n§7" + Translation.translate("This looks bad...");
		}
		return name;
	}

	onNoTargetUse(item: ItemInstance, playerUid: number): void {
		let player = new PlayerInterface(playerUid);
		let hunger = player.getHunger();
		let saturation = player.getSaturation();
		let count = Math.min(20 - hunger, item.count);
		if (count > 0) {
			player.setHunger(hunger + count);
			player.setSaturation(Math.min(20, saturation + count*0.6));
			if (item.data == 1 && Math.random() < 0.2*count) {
				Entity.addEffect(playerUid, PotionEffect.hunger, 1, 600);
			}
			if (item.data == 2) {
				Entity.addEffect(playerUid, PotionEffect.poison, 1, 80);
			}
			if (item.count == count) {
				Entity.setCarriedItem(playerUid, ItemID.tinCanEmpty, count, 0);
			} else {
				Entity.setCarriedItem(playerUid, item.id, item.count - count, item.data);
				player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
			}
			SoundManager.playSound("eat.ogg");
		}
	}
}

ItemRegistry.createItem("tinCanEmpty", {name: "Tin Can", icon: "tin_can"});

ItemRegistry.registerItem(new ItemTinCanFull());