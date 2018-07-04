IDRegistry.genItemID("storageBattery");
Item.createItem("storageBattery", "Battery", {name: "re_battery", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageBattery, "Eu", 10000, 0, true);

IDRegistry.genItemID("storageAdvBattery");
Item.createItem("storageAdvBattery", "Advanced Battery", {name: "adv_re_battery", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageAdvBattery, "Eu", 100000, 1, true);

IDRegistry.genItemID("storageCrystal");
Item.createItem("storageCrystal", "Energy Crystal", {name: "energy_crystal", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageCrystal, "Eu", 1000000, 2, true);

IDRegistry.genItemID("storageLapotronCrystal");
Item.createItem("storageLapotronCrystal", "Lapotron Crystal", {name: "lapotron_crystal", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageLapotronCrystal, "Eu", 10000000, 3, true);

IDRegistry.genItemID("debugItem");
Item.createItem("debugItem", "debug.item", {name: "debug_item", meta: 0}, {isTech: !debugMode});

Item.registerNameOverrideFunction(ItemID.storageBattery, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.storageAdvBattery, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.storageCrystal, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.storageLapotronCrystal, ENERGY_ITEM_NAME);

Item.registerIconOverrideFunction(ItemID.storageBattery, function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = energyStorage - item.data + 1;
	return {name: "re_battery", meta: Math.round(energyStored/energyStorage * 4)}
});

Item.registerIconOverrideFunction(ItemID.storageAdvBattery, function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = energyStorage - item.data + 1;
	return {name: "adv_re_battery", meta: Math.round(energyStored/energyStorage * 4)}
});

Item.registerIconOverrideFunction(ItemID.storageCrystal, function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = energyStorage - item.data + 1;
	return {name: "energy_crystal", meta: Math.round(energyStored/energyStorage * 4)}
});

Item.registerIconOverrideFunction(ItemID.storageLapotronCrystal, function(item, name){
	var energyStorage = Item.getMaxDamage(item.id) - 1;
	var energyStored = energyStorage - item.data + 1;
	return {name: "lapotron_crystal", meta: Math.round(energyStored/energyStorage * 4)}
});


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.storageBattery, count: 1, data: Item.getMaxDamage(ItemID.storageBattery)}, [
		" x ",
		"a#a",
		"a#a"
	], ['x', ItemID.cableTin1, 0, 'a', ItemID.casingTin, 0, '#', 331, 0]);
	
	Recipes.addShaped({id: ItemID.storageAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.storageAdvBattery)}, [
		"xbx",
		"bab",
		"bcb"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.dustSulfur, 0, 'b', ItemID.casingBronze, 0, 'c', ItemID.dustLead, 0]);

	Recipes.addShaped({id: ItemID.storageLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageLapotronCrystal)}, [
		"x#x",
		"xax",
		"x#x"
	], ['a', ItemID.storageCrystal, -1, 'x', ItemID.dustLapis, 0, '#', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transportEnergy);
});

Item.registerUseFunction("debugItem", function(coords, item, block){
	Game.message(block.id+":"+block.data);
	var machine = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
	if(machine){
		for(var i in machine.data){
			if(i != "energy_storage"){
				if(i == "energy"){
				Game.message("energy: " + machine.data[i] + "/" + machine.getEnergyStorage());}
				else{
				Game.message(i + ": " + machine.data[i]);}
			}
		}
	}
});
