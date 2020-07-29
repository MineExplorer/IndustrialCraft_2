IDRegistry.genItemID("chargingBattery");
Item.createItem("chargingBattery", "Charging RE-Battery", {name: "charging_re_battery", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.chargingBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingBattery, "Eu", 40000, 128, 1, "storage", true, true);

IDRegistry.genItemID("chargingAdvBattery");
Item.createItem("chargingAdvBattery", "Advanced Charging Battery", {name: "adv_charging_battery", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.chargingAdvBattery, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingAdvBattery, "Eu", 400000, 1024, 2, "storage", true, true);

IDRegistry.genItemID("chargingCrystal");
Item.createItem("chargingCrystal", "Charging Energy Crystal", {name: "charging_energy_crystal", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.chargingCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingCrystal, "Eu", 4000000, 8192, 3, "storage", true, true);

IDRegistry.genItemID("chargingLapotronCrystal");
Item.createItem("chargingLapotronCrystal", "Charging Lapotron Crystal", {name: "charging_lapotron_crystal", meta: 0}, {stack: 1, isTech: true});
Item.addToCreative(ItemID.chargingLapotronCrystal, 1, 27);
ChargeItemRegistry.registerExtraItem(ItemID.chargingLapotronCrystal, "Eu", 4e7, 32768, 4, "storage", true, true);
ItemName.setRarity(ItemID.chargingLapotronCrystal, 1);

Item.addCreativeGroup("chargingBatteryEU", Translation.translate("Charging Batteries") , [
	ItemID.chargingBattery,
	ItemID.chargingAdvBattery,
	ItemID.chargingCrystal,
	ItemID.chargingLapotronCrystal
]);

Item.registerIconOverrideFunction(ItemID.chargingBattery, function(item) {
	return {name: "charging_re_battery", meta: Math.round((27 - item.data) / 26 * 4)}
});

Item.registerIconOverrideFunction(ItemID.chargingAdvBattery, function(item) {
	return {name: "adv_charging_battery", meta: Math.round((27 - item.data) / 26 * 4)}
});

Item.registerIconOverrideFunction(ItemID.chargingCrystal, function(item) {
	return {name: "charging_energy_crystal", meta: Math.round((27 - item.data) / 26 * 4)}
});

Item.registerIconOverrideFunction(ItemID.chargingLapotronCrystal, function(item) {
	return {name: "charging_lapotron_crystal", meta: Math.round((27 - item.data) / 26 * 4)}
});

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

var ChargingBattery = {
	itemIDs: {},
	
	registerItem: function(nameID) {
		var id = ItemID[nameID];
		this.itemIDs[id] = true;
		Item.registerNoTargetUseFunction(nameID, this.switchFunction);
		Item.registerNameOverrideFunction(id, this.getName);
	},
	
	switchFunction: function(item) {
		var extra = item.extra;
		if (!extra) {
			extra = new ItemExtraData();
		}
		var mode = (extra.getInt("mode")+1)%3;
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
		Player.setCarriedItem(item.id, 1, item.data, extra);
	},
	
	getName: function(item, name) {
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
		name = ItemName.showItemStorage(item, name);
		return name + '\n' + tooltip;
	}
}

ChargingBattery.registerItem("chargingBattery");
ChargingBattery.registerItem("chargingAdvBattery");
ChargingBattery.registerItem("chargingCrystal");
ChargingBattery.registerItem("chargingLapotronCrystal");

function checkCharging() {
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
					var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", energyStored, chargeData.transferLimit*20, chargeData.level);
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