/// <reference path="./TileEntityElectricMachine.ts" />
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
var TileEntityGenerator = /** @class */ (function (_super) {
    __extends(TileEntityGenerator, _super);
    function TileEntityGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TileEntityGenerator.prototype.canReceiveEnergy = function () {
        return false;
    };
    TileEntityGenerator.prototype.isEnergySource = function () {
        return true;
    };
    TileEntityGenerator.prototype.energyTick = function (type, src) {
        this.data.last_energy_receive = this.data.energy_receive;
        this.data.energy_receive = 0;
        this.data.last_voltage = this.data.voltage;
        this.data.voltage = 0;
        var output = this.getMaxPacketSize();
        if (this.data.energy >= output) {
            this.data.energy += src.add(output) - output;
        }
    };
    return TileEntityGenerator;
}(TileEntityElectricMachine));
