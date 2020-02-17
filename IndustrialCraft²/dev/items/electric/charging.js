IDRegistry.genItemID("chargingBattery");
Item.createItem("chargingBattery", "Charging RE-Battery", {name: "charging_re_battery", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.chargingBattery, "Eu", 40000, 1, "storage", true, true);

IDRegistry.genItemID("chargingAdvBattery");
Item.createItem("chargingAdvBattery", "Advanced Charging Battery", {name: "adv_charging_battery", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.chargingAdvBattery, "Eu", 400000, 2, "storage", true, true);

IDRegistry.genItemID("chargingCrystal");
Item.createItem("chargingCrystal", "Charging Energy Crystal", {name: "charging_energy_crystal", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.chargingCrystal, "Eu", 4000000, 3, "storage", true, true);

IDRegistry.genItemID("chargingLapotronCrystal");
Item.createItem("chargingLapotronCrystal", "Charging Lapotron Crystal", {name: "charging_lapotron_crystal", meta: 0}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.chargingLapotronCrystal, "Eu", 40000000, 4, "storage", true, true);
ItemName.setRarity(ItemID.chargingLapotronCrystal, 1);

Item.registerIconOverrideFunction(ItemID.chargingBattery, function(item, name){
	var capacity = Item.getMaxDamage(item.id) - 1;
	var energy = capacity - item.data + 1;
	return {name: "charging_re_battery", meta: Math.round(energy / capacity * 4)}
});

Item.registerIconOverrideFunction(ItemID.chargingAdvBattery, function(item, name){
	var capacity = Item.getMaxDamage(item.id) - 1;
	var energy = capacity - item.data + 1;
	return {name: "adv_charging_battery", meta: Math.round(energy / capacity * 4)}
});

Item.registerIconOverrideFunction(ItemID.chargingCrystal, function(item, name){
	var capacity = Item.getMaxDamage(item.id) - 1;
	var energy = capacity - item.data + 1;
	return {name: "charging_energy_crystal", meta: Math.round(energy / capacity * 4)}
});

Item.registerIconOverrideFunction(ItemID.chargingLapotronCrystal, function(item, name){
	var capacity = Item.getMaxDamage(item.id) - 1;
	var energy = capacity - item.data + 1;
	return {name: "charging_lapotron_crystal", meta: Math.round(energy / capacity * 4)}
});

Callback.addCallback("PreLoaded", function(){
	Recipes.addShaped({id: ItemID.chargingBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingBattery)}, [
		"xbx",
		"b b",
		"xbx"
	], ['x', ItemID.circuitBasic, 0, 'b', ItemID.storageBattery, -1], ChargeItemRegistry.transportEnergy);

	Recipes.addShaped({id: ItemID.chargingAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingAdvBattery)}, [
		"xbx",
		"b#b",
		"xbx"
	], ['#', ItemID.chargingBattery, -1, 'x', ItemID.heatExchanger, 1, 'b', ItemID.storageAdvBattery, -1], ChargeItemRegistry.transportEnergy);

	Recipes.addShaped({id: ItemID.chargingCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingCrystal)}, [
		"xbx",
		"b#b",
		"xbx"
	], ['#', ItemID.chargingAdvBattery, -1, 'x', ItemID.heatExchangerComponent, 1, 'b', ItemID.storageCrystal, -1], ChargeItemRegistry.transportEnergy);
	
	Recipes.addShaped({id: ItemID.chargingLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingLapotronCrystal)}, [
		"xbx",
		"b#b",
		"xbx"
	], ['#', ItemID.chargingCrystal, -1, 'x', ItemID.heatExchangerAdv, 1, 'b', ItemID.storageLapotronCrystal, -1], ChargeItemRegistry.transportEnergy);
});

var charging_items = {}

function registerChargingItem(nameId, tier){
	var id = ItemID[nameId];
	charging_items[id] = tier;
	Item.registerNoTargetUseFunction(nameId, chargingItemSwitch);
	Item.registerNameOverrideFunction(id, function(item, name){
		var mode = item.extra? item.extra.getInt("mode") : 0;
		if(mode == 0){
			var tooltip = "Mode: Enabled";
		}
		if(mode == 1){
			var tooltip = "Mode: Charge items not in hand";
		}
		if(mode == 2){
			var tooltip = "Mode: Disabled";
		}
		tooltip = ItemName.getTooltip(name, tooltip);
		name = ItemName.showItemStorage(item, name);
		return name + tooltip;
	});
}

function chargingItemSwitch(item){
	var extra = item.extra;
	if(!extra){
		extra = new ItemExtraData();
	}
	var mode = (extra.getInt("mode")+1)%3;
	extra.putInt("mode", mode);
	if(mode == 0){
		Game.message("Mode: Enabled");
	}
	if(mode == 1){
		Game.message("Mode: Charge items not in hand");
	}
	if(mode == 2){
		Game.message("Mode: Disabled");
	}
	Player.setCarriedItem(item.id, 1, item.data, extra);
}

registerChargingItem("chargingBattery", 1);
registerChargingItem("chargingAdvBattery", 2);
registerChargingItem("chargingCrystal", 3);
registerChargingItem("chargingLapotronCrystal", 4);

function checkCharging(){
	for(var i = 9; i < 45; i++){
		var slot = Player.getInventorySlot(i);
		var tier = charging_items[slot.id];
		if(tier){
			var mode = slot.extra? slot.extra.getInt("mode") : 0;
			if(mode == 2) continue;
			var transfer = transferByTier(tier);
			var maxDamage = Item.getMaxDamage(slot.id);
			for(var index = 0; index < 9; index++){
				if(mode == 1 && Player.getSelectedSlotId() == index) continue;
				var item = Player.getInventorySlot(index);
				if(!ChargeItemRegistry.isValidStorage(item.id, "Eu", 5)){
					var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", maxDamage - slot.data, transfer*20, tier);
					if(energyAdd > 0){
						slot.data += energyAdd;
						Player.setInventorySlot(index, item.id, 1, item.data, item.extra);
					}
				}
			}
			Player.setInventorySlot(i, slot.id, 1, slot.data, slot.extra);
		}
	}
}

Callback.addCallback("tick", function(){
	if(World.getThreadTime() % 20 == 0){
		runOnMainThread(checkCharging);
	}
});