IDRegistry.genItemID("storageBattery");
Item.createItem("storageBattery", "Battery", {name: "re_battery", meta: 4}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageBattery, 10000, 0);

IDRegistry.genItemID("storageAdvBattery");
Item.createItem("storageAdvBattery", "Advanced Battery", {name: "adv_re_battery", meta: 4}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageAdvBattery, 100000, 1);

IDRegistry.genItemID("storageCrystal");
Item.createItem("storageCrystal", "Energy Crystal", {name: "energy_crystal", meta: 2}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageCrystal, 1000000, 2);

IDRegistry.genItemID("storageLapotronCrystal");
Item.createItem("storageLapotronCrystal", "Lapotron Crystal", {name: "lapotron_crystal", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageLapotronCrystal, 10000000, 3);

Item.registerNameOverrideFunction(ItemID.storageBattery, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.storageAdvBattery, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.storageCrystal, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.storageLapotronCrystal, ENERGY_ITEM_NAME);


var RECIPE_FUNC_TRANSPORT_ENERGY = function(api, field, result){
	var energy = 0;
	for(var i in field){
		if(!ChargeItemRegistry.isFlashStorage(field[i].id)){
			energy += ChargeItemRegistry.getEnergyFrom(field[i], 10000000, 3, true);
		}
		api.decreaseFieldSlot(i);
	}
	ChargeItemRegistry.addEnergyTo(result, energy, energy, 3);
}

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
], ['a', ItemID.storageCrystal, -1, 'x', ItemID.dustLapis, 0, '#', ItemID.circuitAdvanced, 0], RECIPE_FUNC_TRANSPORT_ENERGY);