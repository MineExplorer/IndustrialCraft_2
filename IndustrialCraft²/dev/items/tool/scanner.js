IDRegistry.genItemID("scanner");
IDRegistry.genItemID("scannerAdvanced");
Item.createItem("scanner", "OD Scanner", {name: "scanner", meta: 0}, {stack: 1});
Item.createItem("scannerAdvanced", "OV Scanner", {name: "scanner", meta: 1}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.scanner, "Eu", 10000, 0);
ChargeItemRegistry.registerItem(ItemID.scannerAdvanced, "Eu", 10000, 0);

Item.registerNameOverrideFunction(ItemID.scanner, ENERGY_ITEM_NAME);
Item.registerNameOverrideFunction(ItemID.scannerAdvanced, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.scanner, count: 1, data: 250}, [
	" a ",
	"cbc",
	"xxx"
], ['x', ItemID.cableCopper1, 0, 'a', 348, 0, "b", ItemID.storageBattery, -1, "c", ItemID.circuitBasic, 0], ChargeItemRegistry.transportEnergy);

Recipes.addShaped({id: ItemID.scannerAdvanced, count: 1, data: 40}, [
	" a ",
	"asa",
	"xxx"
], ['x', ItemID.cableGold2, 0, 'a', 348, 0, "s", ItemID.scanner, -1], ChargeItemRegistry.transportEnergy);
/*
Item.registerUseFunction("scanner", function(coords, item, block){
	if(item.data < Item.getMaxDamage(item.id)){
		Player.setCarriedItem(item.id, 1, item.data-1);
	}
});
*/