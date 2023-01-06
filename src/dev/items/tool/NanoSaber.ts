class ItemNanoSaber extends ElectricTool {
	damage = 4;
	constructor() {
		super("nanoSaber", "nano_saber", 1000000, 2048, 3);
		this.setToolParams({energyPerUse: 64, level: 0, damage: 16, efficiency: 4});
		this.setRarity(EnumRarity.UNCOMMON);
		//ICTool.setOnHandSound(this.id, "NanosaberIdle.ogg");
	}

	onIconOverride(item: ItemInstance): Item.TextureData {
		if (item.extra && item.extra.getBoolean("active")) {
			return {name: this.icon.name, meta: 1 + World.getThreadTime()%2}
		}
		return {name: this.icon.name, meta: 0};
	}

	onAttack(item: ItemInstance, victim: number, attacker: number): boolean {
		if (item.extra && item.extra.getBoolean("active")) {
			this.toolMaterial.damage = 16;
			SoundManager.playSoundAtEntity(attacker, "NanosaberSwing.ogg");
		} else {
			this.toolMaterial.damage = 0;
		}
		return true;
	}

	onNoTargetUse(item: ItemStack, player: number): void {
		let extra = item.extra || new ItemExtraData();
		if (extra.getBoolean("active")) {
			extra.putBoolean("active", false);
			Entity.setCarriedItem(player, item.id, 1, item.data, extra);
		}
		else if (ChargeItemRegistry.getEnergyStored(item) >= 64) {
			extra.putBoolean("active", true);
			Entity.setCarriedItem(player, item.id, 1, item.data, extra);
			SoundManager.playSoundAtEntity(player, "NanosaberPowerup.ogg");
		}
	}

	/** KEX compatibility for dynamic Nano Saber damage */
	getAttackDamageBonus(item: ItemInstance): number {
		return item.extra && item.extra.getBoolean("active") ? 16 : 0;
	}

	static onTick(playerUid: number): void {
		if (World.getThreadTime() % 20 == 0) {
			let player = new PlayerActor(playerUid);
			for (let i = 0; i < 36; i++) {
				let item = player.getInventorySlot(i);
				if (item.id == ItemID.nanoSaber && item.extra && item.extra.getBoolean("active")) {
					let energyStored = Math.max(ChargeItemRegistry.getEnergyStored(item) - 1280, 0);
					if (energyStored < 64) {
						item.extra.putBoolean("active", false);
					}
					ChargeItemRegistry.setEnergyStored(item, energyStored);
					player.setInventorySlot(i, item.id, 1, item.data, item.extra);
				}
			}
		}
	}
}

Callback.addCallback("ServerPlayerTick", function(playerUid: number, isPlayerDead?: boolean) {
	ItemNanoSaber.onTick(playerUid);
});