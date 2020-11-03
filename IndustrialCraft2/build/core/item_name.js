var ItemName;
(function (ItemName) {
    var itemRarity = {};
    function setRarity(id, lvl, regFunc) {
        itemRarity[id] = lvl;
        if (regFunc) {
            Item.registerNameOverrideFunction(id, function (item, name) {
                return ItemName.getRarityCode(lvl) + name;
            });
        }
    }
    ItemName.setRarity = setRarity;
    function getRarity(id) {
        return itemRarity[id] || 0;
    }
    ItemName.getRarity = getRarity;
    function getRarityCode(lvl) {
        if (lvl == 1)
            return "§e";
        if (lvl == 2)
            return "§b";
        if (lvl == 3)
            return "§d";
        return "";
    }
    ItemName.getRarityCode = getRarityCode;
    function addTooltip(id, tooltip) {
        Item.registerNameOverrideFunction(BlockID[id], function (item, name) {
            return name + "\n§7" + tooltip;
        });
    }
    ItemName.addTooltip = addTooltip;
    function addTierTooltip(id, tier) {
        addTooltip(id, Translation.translate("Power Tier: ") + tier);
    }
    ItemName.addTierTooltip = addTierTooltip;
    function addStorageBlockTooltip(stringID, tier, capacity) {
        Item.registerNameOverrideFunction(BlockID[stringID], function (item, name) {
            return ItemName.showBlockStorage(item, name, tier, capacity);
        });
    }
    ItemName.addStorageBlockTooltip = addStorageBlockTooltip;
    function addStoredLiquidTooltip(id) {
        Item.registerNameOverrideFunction(id, function (item, name) {
            return name += "\n§7" + (1000 - item.data) + " mB";
        });
    }
    ItemName.addStoredLiquidTooltip = addStoredLiquidTooltip;
    function showBlockStorage(item, name, tier, capacity) {
        var tierText = "§7" + Translation.translate("Power Tier: ") + tier;
        var energy = 0;
        if (item.extra) {
            energy = item.extra.getInt("energy");
        }
        var energyText = displayEnergy(energy) + "/" + capacity + " EU";
        return name + "\n" + tierText + "\n" + energyText;
    }
    ItemName.showBlockStorage = showBlockStorage;
    function getItemStorageText(item) {
        var capacity = ChargeItemRegistry.getMaxCharge(item.id);
        var energy = ChargeItemRegistry.getEnergyStored(item);
        return "§7" + displayEnergy(energy) + "/" + displayEnergy(capacity) + " EU";
    }
    ItemName.getItemStorageText = getItemStorageText;
    function showItemStorage(item, name) {
        var rarity = ItemName.getRarity(item.id);
        if (rarity > 0) {
            name = ItemName.getRarityCode(rarity) + name;
        }
        return name + '\n' + ItemName.getItemStorageText(item);
    }
    ItemName.showItemStorage = showItemStorage;
    function displayEnergy(energy) {
        if (!ConfigIC.debugMode) {
            if (energy >= 1e6) {
                return Math.floor(energy / 1e5) / 10 + "M";
            }
            if (energy >= 1000) {
                return Math.floor(energy / 100) / 10 + "K";
            }
        }
        return energy;
    }
    ItemName.displayEnergy = displayEnergy;
    function getSideName(side) {
        var sideNames = {
            en: [
                "first valid",
                "bottom",
                "top",
                "north",
                "south",
                "east",
                "west"
            ],
            ru: [
                "первой подходящей",
                "нижней",
                "верхней",
                "северной",
                "южной",
                "восточной",
                "западной"
            ],
            zh: [
                "初次生效",
                "底部",
                "顶部",
                "北边",
                "南边",
                "东边",
                "西边"
            ],
            es: [
                "Primera vez efectivo",
                "abajo",
                "arriba",
                "norte",
                "sur",
                "este",
                "oeste"
            ],
            pt: [
                "Primeira vez eficaz",
                "o lado de baixo",
                "o lado de cima",
                "o norte",
                "o sul",
                "o leste",
                "o oeste"
            ]
        };
        if (sideNames[ConfigIC.gameLanguage]) {
            return sideNames[ConfigIC.gameLanguage][side + 1];
        }
        else {
            return sideNames["en"][side + 1];
        }
    }
    ItemName.getSideName = getSideName;
})(ItemName || (ItemName = {}));
