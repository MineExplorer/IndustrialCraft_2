IDRegistry.genItemID("cropSeedBag");
Item.createItem("cropSeedBag", "Seed Bag (%s)", { name: "crop_seed_bag" }, { stack: 1, isTech: true });
Item.registerUseFunction("cropSeedBag", function (coords, item, block) {
    if (block.id == BlockID.crop) {
        var te = World.getTileEntity(coords.x, coords.y, coords.z);
        if (!te.data.crop) {
            var data = {
                statGrowth: item.extra.getInt("growth"),
                statGain: item.extra.getInt("gain"),
                statResistance: item.extra.getInt("resistance"),
                scanLevel: item.extra.getInt("scan")
            };
            var isCropPlanted = te.tryPlantIn(item.data, 1, data.statGrowth, data.statGain, data.statResistance, data.scanLevel);
            if (isCropPlanted && Game.getGameMode() != 1) {
                Player.decreaseCarriedItem(1);
            }
        }
    }
});
Item.addCreativeGroup("cropSeedBag", Translation.translate("Seed Bags"), [ItemID.cropSeedBag]);
Item.registerNameOverrideFunction(ItemID.cropSeedBag, function (item, name) {
    var extra = item.extra || new ItemExtraData();
    var scanLvl = extra.getInt("scan");
    var cropClassName = scanLvl > 0 ? AgricultureAPI.cropCards[item.data].id : "Unknown";
    var translatedCropName = Translation.translate(cropClassName);
    var newName = name.replace("%s", translatedCropName) + '\n';
    if (scanLvl >= 4) {
        newName += "§2Gr: " + extra.getInt("growth") + '\n';
        newName += "§6Ga: " + extra.getInt("gain") + '\n';
        newName += "§bRe: " + extra.getInt("resistance");
    }
    if (ConfigIC.debugMode) {
        newName += "[DEBUG]scanLevel: " + scanLvl;
    }
    return newName;
});
