IDRegistry.genItemID("miningLaser");
Item.createItem("miningLaser", "Mining Laser", {name: "mining_laser", meta: 0});
ChargeItemRegistry.registerItem(ItemID.miningLaser, "Eu", 1000000, 2);
Item.setToolRender(ItemID.miningLaser, true);

Item.registerNameOverrideFunction(ItemID.miningLaser, ENERGY_ITEM_NAME);

Recipes.addShaped({id: ItemID.miningLaser, count: 1, data: Item.getMaxDamage(ItemID.miningLaser)}, [
	"ccx",
	"aa#",
	" aa"
], ['#', ItemID.circuitAdvanced, 0, 'x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, "c", 331, 0], ChargeItemRegistry.transportEnergy);
