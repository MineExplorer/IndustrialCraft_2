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
var ItemArmorQuantumSuit = /** @class */ (function (_super) {
    __extends(ItemArmorQuantumSuit, _super);
    function ItemArmorQuantumSuit(nameID, name, params, isDischarged) {
        if (isDischarged === void 0) { isDischarged = false; }
        var _this = _super.call(this, nameID, name, params, 1e7, 12000, 4, !isDischarged) || this;
        _this.setRarity(2);
        _this.isCharged = !isDischarged;
        RadiationAPI.registerHazmatArmor(_this.id);
        if (!isDischarged) {
            _this.createDischarged(params.defence - 1, params.texture);
        }
        return _this;
    }
    ItemArmorQuantumSuit.prototype.getCharged = function () {
        return this.chargedID;
    };
    ItemArmorQuantumSuit.prototype.getDischarged = function () {
        return this.dischargedID;
    };
    ItemArmorQuantumSuit.prototype.createDischarged = function (defence, texture) {
        var nameID = this.nameID + "Discharged";
        var instance = new ItemArmorQuantumSuit(nameID, this.name, { type: this.armorType, defence: defence, texture: texture }, true);
        instance.chargedID = this.id;
        this.dischargedID = instance.id;
    };
    ItemArmorQuantumSuit.prototype.getEnergyPerDamage = function () {
        return 5000;
    };
    ItemArmorQuantumSuit.prototype.canAbsorbDamage = function (item, damage) {
        if (this.isCharged || ChargeItemRegistry.getEnergyStored(item) >= this.getEnergyPerDamage() * damage) {
            return true;
        }
        return false;
    };
    ItemArmorQuantumSuit.prototype.onHurt = function (params, slot, index) {
        var type = params.type;
        var energyStored = ChargeItemRegistry.getEnergyStored(slot);
        var energyPerDamage = this.getEnergyPerDamage();
        if (energyStored >= energyPerDamage) {
            if ((type == 2 || type == 3 || type == 11) && params.damage > 0) {
                var energy = params.damage * energyPerDamage;
                ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - energy, 0));
                return true;
            }
            if (index == 3 && type == 5) {
                var damage = Math.min(Utils.getFallDamage(), params.damage);
                if (damage > 0) {
                    var damageReduce = Math.min(damage, Math.floor(energyStored / energyPerDamage));
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
            if (index == 3 && type == 22) {
                Game.prevent();
                ChargeItemRegistry.setEnergyStored(slot, energyStored - energyPerDamage);
                return true;
            }
        }
        if (index == 0 && type == 9 && energyStored >= 500) {
            Game.prevent();
            Entity.addEffect(player, PotionEffect.waterBreathing, 1, 60);
            ChargeItemRegistry.setEnergyStored(slot, energyStored - 500);
            return true;
        }
        if (index == 1 && type == 5) {
            Utils.fixFallDamage(params.damage);
        }
        return false;
    };
    ItemArmorQuantumSuit.prototype.onTick = function (slot, index) {
        var energyStored = ChargeItemRegistry.getEnergyStored(slot);
        if (this.isCharged && energyStored < this.getEnergyPerDamage()) {
            slot.id = this.getDischarged();
            Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
        }
        if (!this.isCharged && energyStored >= this.getEnergyPerDamage()) {
            slot.id = this.getCharged();
            Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
        }
        if (energyStored > 0) {
            switch (index) {
                case 0:
                    var newEnergyStored = energyStored;
                    if (RadiationAPI.playerRad > 0) {
                        if (energyStored >= 100000) {
                            RadiationAPI.playerRad = 0;
                            Entity.clearEffect(player, PotionEffect.poison);
                            newEnergyStored -= 100000;
                        }
                    }
                    else {
                        Entity.clearEffect(player, PotionEffect.poison);
                    }
                    Entity.clearEffect(player, PotionEffect.wither);
                    var hunger = Player.getHunger();
                    if (hunger < 20 && newEnergyStored >= 500) {
                        var i = World.getThreadTime() % 36;
                        var item = Player.getInventorySlot(i);
                        if (item.id == ItemID.tinCanFull) {
                            var count = Math.min(20 - hunger, item.count);
                            Player.setHunger(hunger + count);
                            item.count -= count;
                            Player.setInventorySlot(i, item.count ? item.id : 0, item.count, item.data);
                            Player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
                            newEnergyStored -= 500;
                            break;
                        }
                    }
                    // night vision
                    if (newEnergyStored > 0 && slot.extra && slot.extra.getBoolean("nv")) {
                        var coords = Player.getPosition();
                        var time = World.getWorldTime() % 24000;
                        if (World.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
                            Entity.addEffect(Player.get(), PotionEffect.blindness, 1, 25);
                            Entity.clearEffect(Player.get(), PotionEffect.nightVision);
                        }
                        else {
                            Entity.addEffect(Player.get(), PotionEffect.nightVision, 1, 225);
                        }
                        if (World.getThreadTime() % 20 == 0) {
                            newEnergyStored = Math.max(newEnergyStored - 20, 0);
                        }
                    }
                    if (energyStored != newEnergyStored) {
                        ChargeItemRegistry.setEnergyStored(slot, newEnergyStored);
                        Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
                    }
                    break;
                case 1:
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
                    Entity.setFire(player, 0, true);
                    break;
                case 2:
                    var vel = Player.getVelocity();
                    var horizontalVel = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
                    // Game.tipMessage(horizontalVel);
                    if (horizontalVel <= 0.15) {
                        ItemArmorQuantumSuit.runTime = 0;
                    }
                    else if (Utils.isPlayerOnGround()) {
                        ItemArmorQuantumSuit.runTime++;
                    }
                    if (ItemArmorQuantumSuit.runTime > 2 && !Player.getFlying()) {
                        Entity.addEffect(player, PotionEffect.movementSpeed, 6, 5);
                        if (World.getThreadTime() % 5 == 0) {
                            ChargeItemRegistry.setEnergyStored(slot, Math.max(energyStored - Math.floor(horizontalVel * 600)));
                            Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
                        }
                    }
                    break;
            }
        }
        return false;
    };
    ItemArmorQuantumSuit.runTime = 0;
    return ItemArmorQuantumSuit;
}(ItemArmorElectric));
function canAbsorbDamage(damage) {
    for (var i = 0; i < 4; i++) {
        var slot = Player.getArmorSlot(i);
        var armor = ItemRegistry.getInstanceOf(slot.id);
        if (!(armor instanceof ItemArmorQuantumSuit && armor.canAbsorbDamage(slot, damage)))
            return false;
    }
    return true;
}
Callback.addCallback("EntityHurt", function (attacker, victim, damage, type) {
    if (victim == player && Game.getGameMode() != 1 && damage > 0 && (type == 2 || type == 3 || type == 11) && canAbsorbDamage(damage)) {
        Game.prevent();
        if (type == 2) {
            runOnMainThread(function () {
                Entity.damageEntity(player, 0, type, { attacker: attacker, bool1: true });
            });
        }
        if (type == 3) {
            runOnMainThread(function () {
                Entity.damageEntity(player, 0, type, { attacker: -1, bool1: true });
            });
            var vel = Entity.getVelocity(attacker);
            var hs = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
            Player.addVelocity(vel.x * 0.3 / hs, 0.25, vel.z * 0.3 / hs);
            Entity.remove(attacker);
        }
    }
});
Callback.addCallback("Explosion", function (coords, params) {
    var pos = Player.getPosition();
    var distance = Entity.getDistanceBetweenCoords(coords, pos);
    if (distance <= params.power && canAbsorbDamage(1)) {
        Entity.damageEntity(Player.get(), 0, 11, { attacker: params.entity, bool1: true });
    }
});
