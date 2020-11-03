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
var ItemArmorHazmat = /** @class */ (function (_super) {
    __extends(ItemArmorHazmat, _super);
    function ItemArmorHazmat(nameID, name, params) {
        var _this = _super.call(this, nameID, name, params) || this;
        _this.setMaxDamage(64);
        ItemArmor.registerFuncs(nameID, _this);
        RadiationAPI.registerHazmatArmor(_this.id);
        return _this;
    }
    ItemArmorHazmat.prototype.onHurt = function (params, item, index, maxDamage) {
        var type = params.type;
        if (type == 2 || type == 3 || type == 11) {
            item.data += Math.ceil(params.damage / 4);
            if (item.data >= maxDamage) {
                item.id = item.count = 0;
            }
            return true;
        }
        if (type == 9 && index == 0) {
            for (var i = 0; i < 36; i++) {
                var slot = Player.getInventorySlot(i);
                if (slot.id == ItemID.cellAir) {
                    Game.prevent();
                    Entity.addEffect(player, PotionEffect.waterBreathing, 1, 60);
                    Player.setInventorySlot(i, slot.count > 1 ? slot.id : 0, slot.count - 1, 0);
                    Player.addItemToInventory(ItemID.cellEmpty, 1, 0);
                    break;
                }
            }
        }
        if (type == 5 && index == 3) {
            var Dp = Math.floor(params.damage / 8);
            var Db = Math.floor(params.damage * 7 / 16);
            if (Dp < 1) {
                Game.prevent();
            }
            else {
                Entity.setHealth(player, Entity.getHealth(player) + params.damage - Dp);
            }
            item.data += Db;
            if (item.data >= maxDamage) {
                item.id = item.count = 0;
            }
            return true;
        }
        return false;
    };
    ItemArmorHazmat.prototype.onTick = function (item, index, maxDamage) {
        if (index == 0 && Player.getArmorSlot(1).id == ItemID.hazmatChestplate && Player.getArmorSlot(2).id == ItemID.hazmatLeggings && Player.getArmorSlot(3).id == ItemID.rubberBoots) {
            if (RadiationAPI.playerRad <= 0) {
                Entity.clearEffect(player, PotionEffect.poison);
            }
            Entity.clearEffect(player, PotionEffect.wither);
        }
        return false;
    };
    return ItemArmorHazmat;
}(ItemArmorIC2));
