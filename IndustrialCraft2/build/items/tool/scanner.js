IDRegistry.genItemID("scanner");
IDRegistry.genItemID("scannerAdvanced");
Item.createItem("scanner", "OD Scanner", { name: "scanner", meta: 0 }, { stack: 1, isTech: true });
Item.createItem("scannerAdvanced", "OV Scanner", { name: "scanner", meta: 1 }, { stack: 1, isTech: true });
ChargeItemRegistry.registerExtraItem(ItemID.scanner, "Eu", 10000, 100, 1, "tool", true, true);
ChargeItemRegistry.registerExtraItem(ItemID.scannerAdvanced, "Eu", 100000, 256, 2, "tool", true, true);
Item.registerNameOverrideFunction(ItemID.scanner, ItemName.showItemStorage);
Item.registerNameOverrideFunction(ItemID.scannerAdvanced, ItemName.showItemStorage);
Recipes.addShaped({ id: ItemID.scanner, count: 1, data: 27 }, [
    "gdg",
    "cbc",
    "xxx"
], ['x', ItemID.cableCopper1, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.scannerAdvanced, count: 1, data: 27 }, [
    "gbg",
    "dcd",
    "xsx"
], ['x', ItemID.cableGold2, -1, 's', ItemID.scanner, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);
var scan_radius = 3;
var adv_scan_radius = 6;
var ore_blocks = [14, 15, 16, 21, 73, 74, 56, 129, 153];
Callback.addCallback("PreLoaded", function (coords, item, block) {
    for (var id in BlockID) {
        if (id.startsWith("ore") && !TileEntity.isTileEntityBlock(BlockID[id])) {
            ore_blocks.push(BlockID[id]);
        }
    }
});
function scanOres(coords, item, energy, radius) {
    if (ICTool.useElectricItem(item, energy)) {
        SoundManager.playSound("ODScanner.ogg");
        Game.message(Translation.translate("Scan Result: ") + coords.x + ", " + coords.y + ", " + coords.z);
        var ores = {};
        for (var x = coords.x - radius; x <= coords.x + radius; x++) {
            for (var y = coords.y - radius; y <= coords.y + radius; y++) {
                for (var z = coords.z - radius; z <= coords.z + radius; z++) {
                    var blockID = World.getBlockID(x, y, z);
                    if (ore_blocks.indexOf(blockID) != -1) {
                        ores[blockID] = ores[blockID] || 0;
                        ores[blockID]++;
                    }
                }
            }
        }
        for (var id in ores) {
            Game.message(Item.getName(id) + " - " + ores[id]);
        }
    }
}
Item.registerUseFunction("scanner", function (coords, item, block) {
    scanOres(coords, item, 50, scan_radius);
});
Item.registerUseFunction("scannerAdvanced", function (coords, item, block) {
    scanOres(coords, item, 200, adv_scan_radius);
});
