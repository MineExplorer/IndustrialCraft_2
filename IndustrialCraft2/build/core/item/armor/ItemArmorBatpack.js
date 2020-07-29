/// <reference path="./ItemArmorElectric.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ItemArmorBatpack = /** @class */ (function (_super) {
    __extends(ItemArmorBatpack, _super);
    function ItemArmorBatpack(nameID, name, maxCharge, transferLimit, tier) {
        return _super.call(this, nameID, name, { type: "chestplate", defence: 3, texture: name }, maxCharge, transferLimit, tier) || this;
    }
    ItemArmorBatpack.prototype.getIcon = function (armorName) {
        return armorName;
    };
    ItemArmorBatpack.prototype.canProvideEnergy = function () {
        return true;
    };
    ItemArmorBatpack.prototype.onTick = function (slot) {
        if (World.getThreadTime() % 20 == 0) {
            var item = Player.getCarriedItem();
            if (ChargeItemRegistry.isValidItem(item.id, "Eu", this.tier, "tool")) {
                var energyStored = ChargeItemRegistry.getEnergyStored(slot);
                var energyAdd = ChargeItemRegistry.addEnergyTo(item, "Eu", energyStored, this.transferLimit * 20, this.tier);
                if (energyAdd > 0) {
                    ChargeItemRegistry.setEnergyStored(slot, energyStored - energyAdd);
                    Player.setCarriedItem(item.id, 1, item.data, item.extra);
                    Player.setArmorSlot(1, slot.id, 1, slot.data, slot.extra);
                }
            }
        }
        return false;
    };
    return ItemArmorBatpack;
}(ItemArmorElectric));
