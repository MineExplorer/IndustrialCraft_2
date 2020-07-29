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
var ItemArmorSolarHelmet = /** @class */ (function (_super) {
    __extends(ItemArmorSolarHelmet, _super);
    function ItemArmorSolarHelmet(nameID, name, params) {
        var _this = _super.call(this, nameID, name, params) || this;
        _this.canSeeSky = false;
        ItemArmor.registerFuncs(nameID, _this);
        return _this;
    }
    ItemArmorSolarHelmet.prototype.onHurt = function () {
        return false;
    };
    ItemArmorSolarHelmet.prototype.onTick = function () {
        var time = World.getWorldTime() % 24000;
        var p = Player.getPosition();
        if (World.getThreadTime() % 20 == 0 && GenerationUtils.canSeeSky(p.x, p.y + 1, p.z) &&
            (time >= 23500 || time < 12550) && (!World.getWeather().rain || World.getLightLevel(p.x, p.y + 1, p.z) > 14)) {
            for (var i = 1; i < 4; i++) {
                var energy = 20;
                var armor = Player.getArmorSlot(i);
                var energyAdd = ChargeItemRegistry.addEnergyTo(armor, "Eu", energy, 4);
                if (energyAdd > 0) {
                    energy -= energyAdd;
                    Player.setArmorSlot(i, armor.id, 1, armor.data, armor.extra);
                    if (energy <= 0)
                        break;
                }
            }
        }
        return false;
    };
    return ItemArmorSolarHelmet;
}(ItemArmorIC2));
