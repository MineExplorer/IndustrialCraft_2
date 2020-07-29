/// <reference path="./ItemArmorIC2.ts" />
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
var ItemArmorElectric = /** @class */ (function (_super) {
    __extends(ItemArmorElectric, _super);
    function ItemArmorElectric(nameID, name, params, maxCharge, transferLimit, tier, inCreative) {
        var _this = _super.call(this, nameID, name, params, false) || this;
        ItemArmor.registerFuncs(nameID, _this);
        ItemRegistry.registerNameOverrideFunction(_this);
        _this.maxCharge = maxCharge;
        _this.transferLimit = transferLimit;
        _this.tier = tier;
        var chargeType = _this.canProvideEnergy() ? "storage" : "armor";
        ChargeItemRegistry.registerExtraItem(_this.id, "Eu", maxCharge, transferLimit, tier, chargeType, true, inCreative);
        return _this;
    }
    ItemArmorElectric.prototype.canProvideEnergy = function () {
        return false;
    };
    ItemArmorElectric.prototype.overrideName = function (item, name) {
        if (this.rarity > 0) {
            name = ItemName.getRarityCode(this.rarity) + name;
        }
        return name + '\n' + ItemName.getItemStorageText(item);
    };
    ItemArmorElectric.prototype.onHurt = function (params, slot, index, maxDamage) {
        return false;
    };
    ItemArmorElectric.prototype.onTick = function (slot, index, maxDamage) {
        return false;
    };
    return ItemArmorElectric;
}(ItemArmorIC2));
