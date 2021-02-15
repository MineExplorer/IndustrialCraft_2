/// <reference path="battery.ts" />

class ItemBatteryCharging
extends ItemBattery {
	onNoTargetUse(item: ItemStack, player: number) {
		let extra = item.extra || new ItemExtraData();
		let mode = (extra.getInt("mode") + 1) % 3;
		extra.putInt("mode", mode);
		Entity.setCarriedItem(player, item.id, 1, item.data, extra);

		let client = Network.getClientForPlayer(player);
		if (client) {
			if (mode == 0) {
				client.sendMessage(Translation.translate("Mode: Enabled"));
			}
			if (mode == 1) {
				client.sendMessage(Translation.translate("Mode: Charge items not in hand"));
			}
			if (mode == 2) {
				client.sendMessage(Translation.translate("Mode: Disabled"));
			}
		}
	}

	onNameOverride(item: ItemInstance, name: string): string {
		let mode = item.extra? item.extra.getInt("mode") : 0;
		if (mode == 0) {
			var tooltip = Translation.translate("Mode: Enabled");
		}
		if (mode == 1) {
			var tooltip = Translation.translate("Mode: Charge items not in hand");
		}
		if (mode == 2) {
			var tooltip = Translation.translate("Mode: Disabled");
		}
		return super.onNameOverride(item, name) + '\n' + tooltip;
	}

	static checkCharging(playerUid: number): void {
		let player = new PlayerEntity(playerUid);
		for (let i = 0; i < 36; i++) {
			let slot = player.getInventorySlot(i);
			let itemInstance = slot.getItemInstance();
			if (itemInstance instanceof ItemBatteryCharging) {
				let mode = slot.extra? slot.extra.getInt("mode") : 0;
				let energyStored = ChargeItemRegistry.getEnergyStored(slot);
				if (mode == 2 || energyStored <= 0) continue;
				for (let index = 0; index < 9; index++) {
					if (mode == 1 && player.getSelectedSlot() == index) continue;
					let stack = player.getInventorySlot(index);
					if (!ChargeItemRegistry.isValidStorage(stack.id, "Eu", 5)) {
						let energyAdd = ChargeItemRegistry.addEnergyTo(stack, "Eu", Math.min(energyStored, itemInstance.transferLimit*20), itemInstance.tier, true);
						if (energyAdd > 0) {
							energyStored -= energyAdd;
							player.setInventorySlot(index, stack);
						}
					}
				}
				ChargeItemRegistry.setEnergyStored(slot, energyStored);
				player.setInventorySlot(i, slot);
			}
		}
	}
}

ItemRegistry.registerItem(new ItemBatteryCharging("chargingBattery", "charging_re_battery", 40000, 128, 1));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingAdvBattery", "adv_charging_battery", 400000, 1024, 2));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingCrystal", "charging_energy_crystal", 4000000, 8192, 3));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingLapotronCrystal", "charging_lapotron_crystal", 4e7, 32768, 4));
ItemRegistry.setRarity("chargingLapotronCrystal", EnumRarity.UNCOMMON);

Item.addCreativeGroup("chargingBatteryEU", Translation.translate("Charging Batteries") , [
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
