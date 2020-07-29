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
var ItemArmorJetpackElectric = /** @class */ (function (_super) {
    __extends(ItemArmorJetpackElectric, _super);
    function ItemArmorJetpackElectric() {
        var _this = _super.call(this, "jetpack", "electric_jetpack", { type: "chestplate", defence: 3, texture: "electric_jetpack" }, 30000, 100, 1) || this;
        UIbuttons.setArmorButton(_this.id, "button_fly");
        UIbuttons.setArmorButton(_this.id, "button_hover");
        return _this;
    }
    ItemArmorJetpackElectric.prototype.getIcon = function (armorName) {
        return armorName;
    };
    ItemArmorJetpackElectric.prototype.onHurt = function (params, slot, index) {
        if (params.type == 5) {
            Utils.fixFallDamage(params.damage);
        }
        return false;
    };
    ItemArmorJetpackElectric.prototype.onTick = function (slot, index) {
        var energyStored = ChargeItemRegistry.getEnergyStored(slot);
        if (slot.extra && slot.extra.getBoolean("hover")) {
            Utils.resetFallHeight();
            var vel = Player.getVelocity();
            if (Utils.isPlayerOnGround() || energyStored < 8) {
                slot.extra.putBoolean("hover", false);
                Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
                Game.message("§4" + Translation.translate("Hover mode disabled"));
            }
            else if (vel.y < -0.1) {
                Player.addVelocity(0, Math.min(0.25, -0.1 - vel.y), 0);
                if (World.getThreadTime() % 5 == 0) {
                    ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
                    Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
                }
            }
        }
        return false;
    };
    return ItemArmorJetpackElectric;
}(ItemArmorElectric));
