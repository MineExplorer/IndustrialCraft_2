IDRegistry.genItemID("scanner");
IDRegistry.genItemID("scannerAdvanced");
Item.createItem("scanner", "OD Scanner", {name: "scanner", meta: 0}, {stack: 1, isTech: true});
Item.createItem("scannerAdvanced", "OV Scanner", {name: "scanner", meta: 1}, {stack: 1, isTech: true});
ChargeItemRegistry.registerItem(ItemID.scanner, "Eu", 10000, 100, 1, "tool", true);
ChargeItemRegistry.registerItem(ItemID.scannerAdvanced, "Eu", 100000, 256, 2, "tool", true);

Item.registerNameOverrideFunction(ItemID.scanner, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.scannerAdvanced, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.scanner, count: 1, data: Item.getMaxDamage(ItemID.scanner)}, [
	"gdg",
	"cbc",
	"xxx"
], ['x', ItemID.cableCopper1, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);

Recipes.addShaped({id: ItemID.scannerAdvanced, count: 1, data: Item.getMaxDamage(ItemID.scannerAdvanced)}, [
	"gbg",
	"dcd",
	"xsx"
], ['x', ItemID.cableGold2, -1, 's', ItemID.scanner, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);


var scan_radius = 3;
var adv_scan_radius = 6;
var ore_blocks = [14, 15, 16, 21, 73, 74, 56, 129, 153];

Callback.addCallback("PreLoaded", function(coords, item, block){
	for(var id in BlockID){
		if(id[0]=='o' && id[1]=='r' && id[2]=='e' && !TileEntity.isTileEntityBlock(BlockID[id])){
			ore_blocks.push(BlockID[id]);
		}
	}
});

Item.registerUseFunction("scanner", function(coords, item, block){
	if(item.data + 50 < Item.getMaxDamage(item.id)){
		Player.setCarriedItem(item.id, 1, item.data + 50);
		SoundAPI.playSound("Tools/ODScanner.ogg");
		Game.message("Scan result for: " + coords.x + ", " + coords.y + ", " + coords.z);
		var ores = {};
		for(var x = coords.x - scan_radius; x <= coords.x + scan_radius; x++){
			for(var y = coords.y - scan_radius; y <= coords.y + scan_radius; y++){
				for(var z = coords.z - scan_radius; z <= coords.z + scan_radius; z++){
					var blockID = World.getBlockID(x, y, z);
					if(ore_blocks.indexOf(blockID) != -1){
						ores[blockID] = ores[blockID]+1 || 1;
					}
				}
			}
		}
		for(var id in ores){
			Game.message(Item.getName(id) + " - " + ores[id]);
		}
	}
});

Item.registerUseFunction("scannerAdvanced", function(coords, item, block){
	if(item.data + 200 < Item.getMaxDamage(item.id)){
		Player.setCarriedItem(item.id, 1, item.data + 200);
		SoundAPI.playSound("Tools/ODScanner.ogg");
		Game.message("Scan result for: " + coords.x + ", " + coords.y + ", " + coords.z);
		var ores = {};
		for(var x = coords.x - adv_scan_radius; x <= coords.x + adv_scan_radius; x++){
			for(var y = coords.y - adv_scan_radius; y <= coords.y + adv_scan_radius; y++){
				for(var z = coords.z - adv_scan_radius; z <= coords.z + adv_scan_radius; z++){
					var blockID = World.getBlockID(x, y, z);
					if(ore_blocks.indexOf(blockID) != -1){
						ores[blockID] = ores[blockID]+1 || 1;
					}
				}
			}
		}
		for(var id in ores){
			Game.message(Item.getName(id) + " - " + ores[id]);
		}
	}
});
