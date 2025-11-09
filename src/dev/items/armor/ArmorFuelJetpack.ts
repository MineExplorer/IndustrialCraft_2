/// <reference path="./ArmorIC2.ts" />
/// <reference path="./JetpackProvider.ts" />

class ArmorFuelJetpack extends ArmorIC2
implements IJetpack, LiquidItem {
	liquidStorage = 3000;
	/** Amount of ticks of active flying that 1 mB of fuel provides */
	static FUEL_BURN_TICKS = 5;

	constructor() {
		super("fuelJetpack", "fuel_jetpack", {type: "chestplate", defence: 3, texture: "fuel_jetpack"}, false);
		JetpackProvider.registerItem(this.id, this);
		this.setMaxDamage(this.liquidStorage + 1);
		Item.addToCreative(this.id, 1, 1);
		LiquidItemRegistry.registerItemInterface(this.id, this);
	}

	onNameOverride(item: ItemInstance, name: string): string {
		const amount = this.getAmount(item.data);
		if (amount == 0) {
			return name + "\n§7" + Translation.translate("generic.text.empty");
		}
		return `${name}\n§7${Translation.translate("biogas")} ${amount} mB`;
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
				if (World.getThreadTime() % ArmorFuelJetpack.FUEL_BURN_TICKS == 0) {
					return this.burnFuel(item, ArmorFuelJetpack.FUEL_BURN_TICKS);
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
			item.extra.putInt("burnTime", ArmorFuelJetpack.FUEL_BURN_TICKS * 2);
			item.data++;
		} else {
			item.extra.putInt("burnTime", 0);
		}
		return item;
	}

	isValidLiquid(liquid: string): boolean {
		return liquid == "biogas";
	}

	getLiquidStored(itemData: number): string {
		return itemData < this.maxDamage ? "biogas" : null;
	}

	getAmount(itemData: number): number {
		return this.maxDamage - itemData;
	}

	getEmptyItem(): ItemInstance {
		return new ItemStack(this.id, 1, this.maxDamage);
	}

	getFullItem(liquid: string): Nullable<ItemInstance> {
		return this.isValidLiquid(liquid) ? new ItemStack(this.id, 1, 1) : null;
	}

	getLiquid(item: ItemInstance, amount: number): number {
		amount = Math.min(this.getAmount(item.data), amount);
		item.data += amount;
		return amount;
	}

	addLiquid(item: ItemInstance, liquid: string, amount: number): number {
		amount = Math.min(this.liquidStorage - this.getAmount(item.data), amount);
		item.data -= amount;
		return amount;
	}
}