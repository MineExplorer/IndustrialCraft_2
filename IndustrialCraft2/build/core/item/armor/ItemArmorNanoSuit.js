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
var ItemArmorNanoSuit = /** @class */ (function (_super) {
    __extends(ItemArmorNanoSuit, _super);
    function ItemArmorNanoSuit(nameID, name, params, isDischarged) {
        if (isDischarged === void 0) { isDischarged = false; }
        var _this = _super.call(this, nameID, name, params, 1000000, 2048, 3, !isDischarged) || this;
        _this.setRarity(1);
        _this.isCharged = !isDischarged;
        if (!isDischarged) {
            _this.createDischarged(params.defence - 1, params.texture);
            if (params.type == "helmet")
                UIbuttons.setArmorButton(_this.id, "button_nightvision");
        }
        return _this;
    }
    ItemArmorNanoSuit.prototype.getChargedID = function () {
        return this.chargedID;
    };
    ItemArmorNanoSuit.prototype.getDischargedID = function () {
        return this.dischargedID;
    };
    ItemArmorNanoSuit.prototype.createDischarged = function (defence, texture) {
        var nameID = this.nameID + "Discharged";
        var instance = new ItemArmorNanoSuit(nameID, this.name, { type: this.armorType, defence: defence, texture: texture }, true);
        instance.chargedID = this.id;
        this.dischargedID = instance.id;
    };
    ItemArmorNanoSuit.prototype.getEnergyPerDamage = function () {
        return 2000;
    };
    ItemArmorNanoSuit.prototype.onHurt = function (params, slot, index) {
        var energyStored = ChargeItemRegistry.getEnergyStored(slot);
        var type = params.type;
        var energyPerDamage = this.getEnergyPerDamage();
        if (energyStored >= energyPerDamage) {
            if (type == 2 || type == 3 || type == 11) {
                var energy = params.damage * energyPerDamage;
                ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - energy, 0));
                return true;
            }
            if (index == 3 && type == 5) {
                var damage = Utils.getFallDamage();
                if (damage > 0) {
                    damage = Math.min(damage, params.damage);
                    var damageReduce = Math.min(Math.min(9, damage), Math.floor(energyStored / energyPerDamage));
                    var damageTaken = damage - damageReduce;
                    if (damageTaken > 0) {
                        Entity.setHealth(player, Entity.getHealth(player) + params.damage - damageTaken);
                    }
                    else {
                        Game.prevent();
                    }
                    ChargeItemRegistry.setEnergyStored(slot, energyStored - damageReduce * energyPerDamage);
                    return true;
                }
            }
        }
        return false;
    };
    ItemArmorNanoSuit.prototype.onTick = function (slot, index, maxDamage) {
        var energyStored = ChargeItemRegistry.getEnergyStored(slot);
        if (this.isCharged && energyStored < this.getEnergyPerDamage()) {
            slot.id = this.getDischargedID();
            Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
        }
        if (!this.isCharged && energyStored >= this.getEnergyPerDamage()) {
            slot.id = this.getChargedID();
            Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
        }
        // night vision
        if (index == 0 && energyStored > 0 && slot.extra && slot.extra.getBoolean("nv")) {
            var coords = Player.getPosition();
            var time = World.getWorldTime() % 24000;
            if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
                Entity.addEffect(Player.get(), PotionEffect.blindness, 1, 25);
                Entity.clearEffect(Player.get(), PotionEffect.nightVision);
            }
            else {
                Entity.addEffect(Player.get(), PotionEffect.nightVision, 1, 225);
            }
            Entity.addEffect(Player.get(), PotionEffect.nightVision, 1, 225);
            if (World.getThreadTime() % 20 == 0) {
                ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - 20, 0));
                Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
            }
        }
        return false;
    };
    return ItemArmorNanoSuit;
}(ItemArmorElectric));
