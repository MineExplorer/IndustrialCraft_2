/// <reference path="battery.ts" />

class ItemBatteryCharging
extends ItemBattery {
	readMode(extra: ItemExtraData): number {
		if (!extra) return 0;
		return extra.getInt("mode");
	}

	onNoTargetUse(item: ItemStack, player: number) {
		let extra = item.extra || new ItemExtraData();
		let mode = (extra.getInt("mode") + 1) % 3;
		extra.putInt("mode", mode);
		Entity.setCarriedItem(player, item.id, 1, item.data, extra);

		let client = Network.getClientForPlayer(player);
		switch (mode) {
			case 0:
				BlockEngine.sendUnlocalizedMessage(client, "Mode: ", "charging.enabled");
			break;
			case 1:
				BlockEngine.sendUnlocalizedMessage(client, "Mode: ", "charging.not_in_hand");
			break;
			case 2:
				BlockEngine.sendUnlocalizedMessage(client, "Mode: ", "charging.disabled");
			break;
		}
	}

	getModeTooltip(mode: number): string {
		switch (mode) {
			case 0:
				return Translation.translate("Mode: ") + Translation.translate("charging.enabled");
			case 1:
				return Translation.translate("Mode: ") + Translation.translate("charging.not_in_hand");
			case 2:
				return Translation.translate("Mode: ") + Translation.translate("charging.disabled");
		}
	}

	onNameOverride(item: ItemInstance, name: string): string {
		let mode = this.readMode(item.extra);
		return super.onNameOverride(item, name) + '\n' + this.getModeTooltip(mode);
	}

	chargeItems(player: PlayerEntity, index: number, item: ItemInstance): void {
		let mode = this.readMode(item.extra);
		let energyStored = ChargeItemRegistry.getEnergyStored(item);
		if (mode == 2 || energyStored <= 0) return;
		for (let i = 0; i < 9; i++) {
			if (mode == 1 && player.getSelectedSlot() == i) continue;
			let stack = player.getInventorySlot(i);
			if (!ChargeItemRegistry.isValidStorage(stack.id, "Eu", 5)) {
				let energyAdd = ChargeItemRegistry.addEnergyTo(stack, "Eu", Math.min(energyStored, this.transferLimit * 20), this.tier, true);
				if (energyAdd > 0) {
					energyStored -= energyAdd;
					player.setInventorySlot(i, stack);
				}
			}
		}
		ChargeItemRegistry.setEnergyStored(item, energyStored);
		player.setInventorySlot(index, item);
	}

	static checkCharging(playerUid: number): void {
		let player = new PlayerEntity(playerUid);
		for (let i = 0; i < 36; i++) {
			let slot = player.getInventorySlot(i);
			let itemInstance = slot.getItemInstance();
			if (itemInstance instanceof ItemBatteryCharging) {
				itemInstance.chargeItems(player, i, slot);
			}
		}
	}
}

ItemRegistry.registerItem(new ItemBatteryCharging("chargingBattery", "charging_re_battery", 40000, 128, 1));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingAdvBattery", "adv_charging_battery", 400000, 1024, 2));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingCrystal", "charging_energy_crystal", 4000000, 8192, 3));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingLapotronCrystal", "charging_lapotron_crystal", 4e7, 32768, 4));
ItemRegistry.setRarity("chargingLapotronCrystal", EnumRarity.UNCOMMON);

Item.addCreativeGroup("chargingBatteryEU", Translation.translate("Charging Batteries"), [
	ItemID.chargingBattery,
	ItemID.chargingAdvBattery,
	ItemID.chargingCrystal,
	ItemID.chargingLapotronCrystal
]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: ItemID.chargingBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingBattery)}, [
		"xbx",
		"b b",
		"xbx"
	], ['x', ItemID.circuitBasic, 0, 'b', ItemID.storageBattery, -1], ChargeItemRegistry.transferEnergy);

	Recipes.addShaped({id: ItemID.chargingAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingAdvBattery)}, [
		"xbx",
		"b#b",
		"xbx"
	], ['#', ItemID.chargingBattery, -1, 'x', ItemID.heatExchanger, 1, 'b', ItemID.storageAdvBattery, -1], ChargeItemRegistry.transferEnergy);

	Recipes.addShaped({id: ItemID.chargingCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingCrystal)}, [
		"xbx",
		"b#b",
		"xbx"
	], ['#', ItemID.chargingAdvBattery, -1, 'x', ItemID.heatExchangerComponent, 1, 'b', ItemID.storageCrystal, -1], ChargeItemRegistry.transferEnergy);

	Recipes.addShaped({id: ItemID.chargingLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingLapotronCrystal)}, [
		"xbx",
		"b#b",
		"xbx"
	], ['#', ItemID.chargingCrystal, -1, 'x', ItemID.heatExchangerAdv, 1, 'b', ItemID.storageLapotronCrystal, -1], ChargeItemRegistry.transferEnergy);
});

Callback.addCallback("ServerPlayerTick", function(playerUid: number, isPlayerDead?: boolean) {
	if (World.getThreadTime() % 20 == 0 && !isPlayerDead) {
		ItemBatteryCharging.checkCharging(playerUid);
	}
});
