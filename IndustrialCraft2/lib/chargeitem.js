LIBRARY({
    name: "ChargeItem",
    version: 9,
    shared: true,
    api: "CoreEngine"
});
var ChargeItemRegistry;
(function (ChargeItemRegistry) {
    ChargeItemRegistry.chargeData = {};
    function registerItem(id, energyType, capacity, transferLimit, tier, canProvideEnergy, notInCreative) {
        if (typeof energyType == "string") {
            ChargeItemRegistry.chargeData[id] = {
                isFlash: false,
                canProvideEnergy: canProvideEnergy,
                energy: energyType,
                tier: tier || 0,
                maxCharge: capacity,
                transferLimit: transferLimit,
            };
        }
        else {
            var itemData = energyType;
            notInCreative = capacity;
            capacity = itemData.maxCharge;
            ChargeItemRegistry.chargeData[id] = itemData;
        }
        Item.setMaxDamage(id, 27);
        if (!notInCreative) {
            addToCreative(id, 1, capacity);
        }
    }
    ChargeItemRegistry.registerItem = registerItem;
    function registerFlashItem(id, energyType, amount, tier) {
        ChargeItemRegistry.chargeData[id] = {
            isFlash: true,
            canProvideEnergy: true,
            tier: tier || 0,
            energy: energyType,
            amount: amount
        };
    }
    ChargeItemRegistry.registerFlashItem = registerFlashItem;
    /** @deprecated Use registerItem instead */
    function registerExtraItem(id, energyType, capacity, transferLimit, tier, itemType, addScale, addToCreative) {
        registerItem(id, energyType, capacity, transferLimit, tier, itemType ? true : false, !addToCreative);
    }
    ChargeItemRegistry.registerExtraItem = registerExtraItem;
    function addToCreative(id, data, energy) {
        Item.addToCreative(id, 1, data, new ItemExtraData().putInt("energy", energy));
    }
    ChargeItemRegistry.addToCreative = addToCreative;
    function registerChargeFunction(id, func) {
        ChargeItemRegistry.chargeData[id].onCharge = func;
    }
    ChargeItemRegistry.registerChargeFunction = registerChargeFunction;
    function registerDischargeFunction(id, func) {
        ChargeItemRegistry.chargeData[id].onDischarge = func;
    }
    ChargeItemRegistry.registerDischargeFunction = registerDischargeFunction;
    function getItemData(id) {
        return ChargeItemRegistry.chargeData[id];
    }
    ChargeItemRegistry.getItemData = getItemData;
    function isFlashStorage(id) {
        var data = getItemData(id);
        return (data && data.isFlash);
    }
    ChargeItemRegistry.isFlashStorage = isFlashStorage;
    function isValidItem(id, energyType, tier) {
        var data = getItemData(id);
        return (data && !data.isFlash && data.energy == energyType && data.tier <= tier);
    }
    ChargeItemRegistry.isValidItem = isValidItem;
    function isValidStorage(id, energyType, tier) {
        var data = getItemData(id);
        return (data && data.canProvideEnergy && data.energy == energyType && data.tier <= tier);
    }
    ChargeItemRegistry.isValidStorage = isValidStorage;
    function getMaxCharge(id, energyType) {
        var data = getItemData(id);
        if (!data || energyType && data.energy != energyType) {
            return 0;
        }
        return data.maxCharge;
    }
    ChargeItemRegistry.getMaxCharge = getMaxCharge;
    function getEnergyStored(item, energyType) {
        var data = getItemData(item.id);
        if (!data || energyType && data.energy != energyType) {
            return 0;
        }
        if (data.isFlash) {
            return data.amount;
        }
        if (item.extra) {
            return item.extra.getInt("energy");
        }
        if (item.data < 1)
            item.data = 1;
        if (item.data > 27)
            item.data = 27;
        return Math.round((27 - item.data) / 26 * data.maxCharge);
    }
    ChargeItemRegistry.getEnergyStored = getEnergyStored;
    function setEnergyStored(item, amount) {
        var data = getItemData(item.id);
        if (!data)
            return;
        if (!item.extra)
            item.extra = new ItemExtraData();
        item.extra.putInt("energy", amount);
        item.data = Math.round((data.maxCharge - amount) / data.maxCharge * 26 + 1);
    }
    ChargeItemRegistry.setEnergyStored = setEnergyStored;
    function getEnergyFrom(item, energyType, amount, tier, getAll) {
        var data = getItemData(item.id);
        if (!data || data.energy != energyType || data.tier > tier || !data.canProvideEnergy) {
            return 0;
        }
        if (data.isFlash) {
            if (amount < 1) {
                return 0;
            }
            item.count--;
            if (item.count < 1) {
                item.id = item.data = 0;
            }
            return data.amount;
        }
        if (data.onDischarge) {
            return data.onDischarge(item, amount, tier, getAll);
        }
        if (!getAll) {
            amount = Math.min(amount, data.transferLimit);
        }
        var energyStored = getEnergyStored(item);
        var energyGot = Math.min(amount, energyStored);
        setEnergyStored(item, energyStored - energyGot);
        return energyGot;
    }
    ChargeItemRegistry.getEnergyFrom = getEnergyFrom;
    function getEnergyFromSlot(slot, energyType, amount, tier, getAll) {
        var energyGot = getEnergyFrom(slot, energyType, amount, tier, getAll);
        slot.setSlot(slot.id, slot.count, slot.data, slot.extra);
        return energyGot;
    }
    ChargeItemRegistry.getEnergyFromSlot = getEnergyFromSlot;
    function addEnergyTo(item, energyType, amount, tier, addAll) {
        var data = getItemData(item.id);
        if (!data || !isValidItem(item.id, energyType, tier)) {
            return 0;
        }
        if (data.onCharge) {
            return data.onCharge(item, amount, tier, addAll);
        }
        if (!addAll) {
            amount = Math.min(amount, data.transferLimit);
        }
        var energyStored = getEnergyStored(item);
        var energyAdd = Math.min(amount, data.maxCharge - energyStored);
        setEnergyStored(item, energyStored + energyAdd);
        return energyAdd;
    }
    ChargeItemRegistry.addEnergyTo = addEnergyTo;
    function addEnergyToSlot(slot, energyType, amount, tier, addAll) {
        var energyAdd = addEnergyTo(slot, energyType, amount, tier, addAll);
        slot.setSlot(slot.id, slot.count, slot.data, slot.extra);
        return energyAdd;
    }
    ChargeItemRegistry.addEnergyToSlot = addEnergyToSlot;
    function transferEnergy(api, field, result) {
        var data = getItemData(result.id);
        var amount = 0;
        for (var i in field) {
            if (!isFlashStorage(field[i].id)) {
                amount += getEnergyStored(field[i], data.energy);
            }
            api.decreaseFieldSlot(i);
        }
        addEnergyTo(result, data.energy, amount, data.tier, true);
    }
    ChargeItemRegistry.transferEnergy = transferEnergy;
})(ChargeItemRegistry || (ChargeItemRegistry = {}));
EXPORT("ChargeItemRegistry", ChargeItemRegistry);
