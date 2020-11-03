/// <reference path="./TileEntityMachine.ts" />
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
var TileEntityElectricMachine = /** @class */ (function (_super) {
    __extends(TileEntityElectricMachine, _super);
    function TileEntityElectricMachine(tier) {
        var _this = _super.call(this) || this;
        _this.energy_receive = 0;
        _this.last_energy_receive = 0;
        _this.voltage = 0;
        _this.last_voltage = 0;
        _this.defaultValues = {
            energy: 0
        };
        _this.tier = tier;
        return _this;
    }
    TileEntityElectricMachine.prototype.getTier = function () {
        return this.tier;
    };
    TileEntityElectricMachine.prototype.getEnergyStorage = function () {
        return 0;
    };
    TileEntityElectricMachine.prototype.energyTick = function (type, src) {
        this.last_energy_receive = this.energy_receive;
        this.energy_receive = 0;
        this.last_voltage = this.voltage;
        this.voltage = 0;
    };
    TileEntityElectricMachine.prototype.getMaxPacketSize = function () {
        return 8 << this.getTier() * 2;
    };
    TileEntityElectricMachine.prototype.energyReceive = function (type, amount, voltage) {
        var maxVoltage = this.getMaxPacketSize();
        if (voltage > maxVoltage) {
            if (ConfigIC.voltageEnabled) {
                World.setBlock(this.x, this.y, this.z, 0, 0);
                World.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.getExplosionPower(), true);
                SoundManager.playSoundAtBlock(this, "MachineOverload.ogg", 1, 32);
                this.selfDestroy();
                return 1;
            }
            var add = Math.min(maxVoltage, this.getEnergyStorage() - this.data.energy);
        }
        else {
            var add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
        }
        this.data.energy += add;
        this.energy_receive += add;
        this.voltage = Math.max(this.voltage, voltage);
        return add;
    };
    TileEntityElectricMachine.prototype.getExplosionPower = function () {
        return 1.2;
    };
    return TileEntityElectricMachine;
}(TileEntityMachine));
