/// <reference path="battery.ts" />

class ItemBatteryCharging
extends ItemBattery {
	onUseNoTarget(item: ItemInstance, player: number) {
		var extra = item.extra || new ItemExtraData();
		var mode = (extra.getInt("mode") + 1) % 3;
		extra.putInt("mode", mode);
		if (mode == 0) {
			Game.message(Translation.translate("Mode: Enabled"));
		}
		if (mode == 1) {
			Game.message(Translation.translate("Mode: Charge items not in hand"));
		}
		if (mode == 2) {
			Game.message(Translation.translate("Mode: Disabled"));
		}
		Entity.setCarriedItem(player, item.id, 1, item.data, extra);
	}

	onNameOverride(item: ItemInstance, name: string) {
		var mode = item.extra? item.extra.getInt("mode") : 0;
		if (mode == 0) {
			var tooltip = Translation.translate("Mode: Enabled");
		}
		if (mode == 1) {
			var tooltip = Translation.translate("Mode: Charge items not in hand");
		}
		if (mode == 2) {
			var tooltip = Translation.translate("Mode: Disabled");
		}
		name = super.onNameOverride(item, name);
		return name + '\n' + tooltip;
	}
}

new ItemBatteryCharging("chargingBattery", "charging_re_battery", 40000, 128, 1);
new ItemBatteryCharging("chargingAdvBattery", "adv_charging_battery", 400000, 1024, 2);
new ItemBatteryCharging("chargingCrystal", "charging_energy_crystal", 4000000, 8192, 3);
new ItemBatteryCharging("chargingLapotronCrystal", "charging_lapotron_crystal", 4e7, 32768, 4).setRarity(1);

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
// TODO: in hand tick
/*function checkCharging() {
	for (var i = 0; i < 36; i++) {
		var slot = Player.getInventorySlot(i);
		if (ChargingBattery.itemIDs[slot.id]) {
			var mode = slot.extra? slot.extra.getInt("mode") : 0;
			var energyStored = ChargeItemRegistry.getEnergyStored(slot);
			if (mode == 2 || energyStored <= 0) continue;
			var chargeData = ChargeItemRegistry.getItemData(slot.id);
			for (var index = 0; index < 9; index++) {
				if (mode == 1 && Player.getSelectedSlotId() == index) continue;
				var item = Player.getInventorySlot(index);
				if (!ChargeItemRegistry.isValidStorage(item.id, "Eu", 5)) {
					var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", energyStored, chargeData.transferLimit*20, chargeData.tier);
					if (energyAdd > 0) {
						energyStored -= energyAdd;
						Player.setInventorySlot(index, item.id, 1, item.data, item.extra);
					}
				}
			}
			ChargeItemRegistry.setEnergyStored(slot, energyStored);
			Player.setInventorySlot(i, slot.id, 1, slot.data, slot.extra);
		}
	}
}

Callback.addCallback("tick", function() {
	if (World.getThreadTime() % 20 == 0) {
		checkCharging();
	}
});
*/