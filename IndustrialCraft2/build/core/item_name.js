var ItemName = {
    itemRarity: {},
    setRarity: function (id, lvl, regFunc) {
        this.itemRarity[id] = lvl;
        if (regFunc) {
            Item.registerNameOverrideFunction(id, function (item, name) {
                return ItemName.getRarityCode(lvl) + name;
            });
        }
    },
    getRarity: function (id) {
        return this.itemRarity[id] || 0;
    },
    getRarityCode: function (lvl) {
        if (lvl == 1)
            return "§e";
        if (lvl == 2)
            return "§b";
        if (lvl == 3)
            return "§d";
        return "";
    },
    addTierTooltip: function (id, tier) {
        Item.registerNameOverrideFunction(BlockID[id], function (item, name) {
            return name + "\n§7" + Translation.translate("Power Tier: ") + tier;
        });
    },
    addStorageBlockTooltip: function (id, tier, capacity) {
        Item.registerNameOverrideFunction(BlockID[id], function (item, name) {
            return ItemName.showBlockStorage(item, name, tier, capacity);
        });
    },
    addStoredLiquidTooltip: function (id) {
        Item.registerNameOverrideFunction(id, function (item, name) {
            return name += "\n§7" + (1000 - item.data) + " mB";
        });
    },
    showBlockStorage: function (item, name, tier, capacity) {
        var tierText = "§7" + Translation.translate("Power Tier: ") + tier;
        var energy = 0;
        if (item.extra) {
            energy = item.extra.getInt("energy");
        }
        var energyText = this.displayEnergy(energy) + "/" + capacity + " EU";
        return name + "\n" + tierText + "\n" + energyText;
    },
    getTooltip: function (name, tooltip) {
        return "\n" + tooltip;
    },
    getItemStorageText: function (item) {
        var capacity = ChargeItemRegistry.getMaxCharge(item.id);
        var energy = ChargeItemRegistry.getEnergyStored(item);
        return "§7" + this.displayEnergy(energy) + "/" + this.displayEnergy(capacity) + " EU";
    },
    showItemStorage: function (item, name) {
        var rarity = ItemName.getRarity(item.id);
        if (rarity > 0) {
            name = ItemName.getRarityCode(rarity) + name;
        }
        return name + '\n' + ItemName.getItemStorageText(item);
    },
    displayEnergy: function (energy) {
        if (!Config.debugMode) {
            if (energy >= 1e6) {
                return Math.floor(energy / 1e5) / 10 + "M";
            }
            if (energy >= 1000) {
                return Math.floor(energy / 100) / 10 + "K";
            }
        }
        return energy;
    },
    getSideName: function (side) {
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
        if (sideNames[Config.gameLanguage]) {
            return sideNames[Config.gameLanguage][side + 1];
        }
        else {
            return sideNames["en"][side + 1];
        }
    }
};
