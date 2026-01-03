/// <reference path="./ArmorElectric.ts" />
/// <reference path="./JetpackProvider.ts" />

class ArmorElectricJetpack extends ArmorElectric
implements IJetpack {
	constructor() {
		super("jetpack", "electric_jetpack", {type: "chestplate", defence: 3, texture: "electric_jetpack"}, 30000, 100, 1);
		JetpackProvider.registerItem(this.id, this);
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		if (BlockEngine.getMainGameVersion() >= 16 && params.type == 5 && !EntityHelper.isOnGround(playerUid)) {
			Game.prevent();
		}
		return item;
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		return JetpackProvider.onTick(item, playerUid);
	}
	
	canFly(item: ItemInstance, playerPos: Vector): boolean {
		return playerPos.y < 256 && ChargeItemRegistry.getEnergyStored(item) >= 8;
	}
}