IDRegistry.genItemID("wrenchBronze");
Item.createItem("wrenchBronze", "Wrench", {name: "bronze_wrench", meta: 0}, {stack: 1});
Item.setMaxDamage(ItemID.wrenchBronze, 161);

IDRegistry.genItemID("electricWrench");
Item.createItem("electricWrench", "Electric Wrench", {name: "electric_wrench", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.electricWrench, "Eu", 10000, 1);

Item.registerNameOverrideFunction(ItemID.electricWrench, NameOverrides.showItemStorage);

Recipes.addShaped({id: ItemID.wrenchBronze, count: 1, data: 0}, [
	"a a",
	"aaa",
	" a "
], ['a', ItemID.ingotBronze, 0]);

Recipes.addShapeless({id: ItemID.electricWrench, count: 1, data: Item.getMaxDamage(ItemID.electricWrench)}, [
	{id: ItemID.wrenchBronze, data: 0}, {id: ItemID.powerUnitSmall, data: 0}
]);

Callback.addCallback("DestroyBlockStart", function(coords, block){
	if(MachineRegistry.machineIDs[block.id]){
		var item = Player.getCarriedItem();
		if(item.id==ItemID.wrenchBronze || item.id==ItemID.electricWrench && item.data + 500 <= Item.getMaxDamage(item.id)){
			Block.setTempDestroyTime(block.id, 0);
		}
	}
});
