/// <reference path="./ArmorIC2.ts" />
/// <reference path="./JetpackProvider.ts" />

class ArmorFuelJetpack extends ArmorIC2
implements IJetpack {
	static LIQUID_STORAGE = 4000;
	static FUEL_BURN_TICKS = 10;

	constructor() {
		super("fuelJetpack", "fuel_jetpack", {type: "chestplate", defence: 3, texture: "fuel_jetpack"});
		JetpackProvider.registerItem(this.id, this);
		this.setMaxDamage(ArmorFuelJetpack.LIQUID_STORAGE);
		LiquidItemRegistry.registerItem("biogas", ItemID.fuelJetpack, ItemID.fuelJetpack, ArmorFuelJetpack.LIQUID_STORAGE);
	}

	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance, index: number, playerUid: number): ItemInstance {
		if (params.type == 5 && !EntityHelper.isOnGround(playerUid)) {
			Game.prevent();
		}
		return item;
	}

	onTick(item: ItemInstance, index: number, playerUid: number): ItemInstance {
		const canFly = this.canFly(item, Entity.getPosition(playerUid));
		const vel = Entity.getVelocity(playerUid);
		if (item.extra && item.extra.getBoolean("hover")) {
			if (!canFly || EntityHelper.isOnGround(playerUid)) {
				item.extra.putBoolean("hover", false);
				const client = Network.getClientForPlayer(playerUid);
				if (client) BlockEngine.sendMessage(client, "§4", "message.hover_mode.disabled");
				return item;
			}
			else {
				if (vel.y < 0) {
					EntityHelper.resetFallHeight(playerUid);
				}
				if (JetpackProvider.getFlying(playerUid)) {
					return this.burnFuel(item, 2);
				}
				if (World.getThreadTime() % 5 == 0) {
					return this.burnFuel(item, 5);
				}
			}
		}
		else if (JetpackProvider.getFlying(playerUid)) {
			if (vel.y > -1.2 && vel.y < 0) {
				EntityHelper.resetFallHeight(playerUid);
			}
			return this.burnFuel(item, 2);
		}
		return null;
	}

	canFly(item: ItemInstance, playerPos: Vector): boolean {
		return playerPos.y < 256 && (item.data < this.maxDamage || item.extra?.getInt("burnTime") > 0);
	}

	burnFuel(item: ItemInstance, amount: number): ItemInstance {
		if (!item.extra) item.extra = new ItemExtraData();
		const burnTime = item.extra.getInt("burnTime");
		if (burnTime > amount) {
			item.extra.putInt("burnTime", burnTime - amount);
		} else if (item.data < this.maxDamage) {
			item.extra.putInt("burnTime", ArmorFuelJetpack.FUEL_BURN_TICKS);
			item.data++;
		} else {
			item.extra.putInt("burnTime", 0);
		}
		return item;
	}
}