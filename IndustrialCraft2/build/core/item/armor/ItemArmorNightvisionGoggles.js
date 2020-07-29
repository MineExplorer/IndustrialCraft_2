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
var ItemArmorNightvisionGoggles = /** @class */ (function (_super) {
    __extends(ItemArmorNightvisionGoggles, _super);
    function ItemArmorNightvisionGoggles() {
        var _this = _super.call(this, "nightvisionGoggles", "nightvision", { type: "helmet", defence: 1, texture: "nightvision" }, 100000, 256, 2) || this;
        UIbuttons.setArmorButton(_this.id, "button_nightvision");
        return _this;
    }
    ItemArmorNightvisionGoggles.prototype.onTick = function (slot) {
        var energyStored = ChargeItemRegistry.getEnergyStored(slot);
        if (energyStored > 0 && slot.extra && slot.extra.getBoolean("nv")) {
            var coords = Player.getPosition();
            var time = World.getWorldTime() % 24000;
            if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
                Entity.clearEffect(Player.get(), PotionEffect.nightVision);
                Entity.addEffect(Player.get(), PotionEffect.blindness, 1, 25);
            }
            else {
                Entity.addEffect(Player.get(), PotionEffect.nightVision, 1, 225);
            }
            if (World.getThreadTime() % 20 == 0) {
                ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
                Player.setArmorSlot(0, slot.id, 1, slot.data, slot.extra);
            }
        }
        return false;
    };
    return ItemArmorNightvisionGoggles;
}(ItemArmorElectric));
