IDRegistry.genItemID("miningLaser");
Item.createItem("miningLaser", "Mining Laser", {name: "mining_laser", meta: 0});
ChargeItemRegistry.registerItem(ItemID.miningLaser, "Eu", 1000000, 3);
Item.setToolRender(ItemID.miningLaser, true);

Item.registerNameOverrideFunction(ItemID.miningLaser, NameOverrides.showItemStorage);

Recipes.addShaped({id: ItemID.miningLaser, count: 1, data: Item.getMaxDamage(ItemID.miningLaser)}, [
	"ccx",
	"aa#",
	" aa"
], ['#', ItemID.circuitAdvanced, 0, 'x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, "c", 331, 0], ChargeItemRegistry.transportEnergy);


Item.registerUseFunction("miningLaser", function(coords, item, block){
	var c = Player.getPosition();
	if(item.data + 2000 <= Item.getMaxDamage(item.id)){
		Player.setCarriedItem(item.id, 1, item.data + 2000);
		for(var t = 0; t < 20; t += 0.1){
			x = (coords.x - c.x)*t +c.x;
			y = (coords.y - c.y)*t +c.y;
			z = (coords.z - c.z)*t +c.z;
			var block = World.getBlock(x, y, z);
			if(block.id){
				var drop = getBlockDrop({x: x, y: y, z: z}, block.id, block.data, 100);
				if(drop){
					World.setBlock(x, y, z, 0);
					for(var i in drop){
						var item = drop[i]
						World.drop(x, y, z, item[0], item[1], item[2]);
					}
				}
			}
		}
	}
});