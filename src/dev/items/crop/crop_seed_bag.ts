class ItemSeedBag
extends ItemCommon
implements ItemBehavior {
    constructor() {
        super("cropSeedBag", "Seed Bag (%s)", "crop_seed_bag", false);
        this.setMaxStack(1);
    }

    onNameOverride(item: ItemInstance, name: string): string {
        let extra = item.extra || new ItemExtraData();
        let scanLvl = extra.getInt("scan");
        let cropClassName = scanLvl > 0 ? AgricultureAPI.cropCards[item.data].id : "Unknown";
        let translatedCropName = Translation.translate(cropClassName);

        let newName = name.replace("%s", translatedCropName) + '\n';
        if (scanLvl >= 4) {
            newName += "§2Gr: " + extra.getInt("growth") + '\n';
            newName += "§6Ga: " + extra.getInt("gain") + '\n';
            newName += "§bRe: " + extra.getInt("resistance");
        }
        if (ConfigIC.debugMode) {
            newName += "[DEBUG]scanLevel: " + scanLvl;
        }
        return newName;
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void {
        if (block.id == BlockID.crop) {
            let region = WorldRegion.getForActor(player);
            let te = region.getTileEntity(coords);
            if (!te.data.crop) {
                let extra = item.extra;
                let data = {
                    statGrowth: extra.getInt("growth"),
                    statGain: extra.getInt("gain"),
                    statResistance: extra.getInt("resistance"),
                    scanLevel: extra.getInt("scan")
                };
                let isCropPlanted = te.tryPlantIn(item.data, 1, data.statGrowth, data.statGain, data.statResistance, data.scanLevel);
                if (isCropPlanted && Game.isItemSpendingAllowed(player)) {
                    Entity.setCarriedItem(player, item.id, item.count - 1, item.data, item.extra);
                }
            }
        }
    }
}

ItemRegistry.registerItem(new ItemSeedBag());

Item.addCreativeGroup("cropSeedBag", Translation.translate("Seed Bags"), [ItemID.cropSeedBag]);