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
var TileEntityTransformer = /** @class */ (function (_super) {
    __extends(TileEntityTransformer, _super);
    function TileEntityTransformer(tier) {
        var _this = _super.call(this, tier) || this;
        _this.defaultValues = {
            energy: 0,
            increaseMode: false
        };
        return _this;
    }
    TileEntityTransformer.prototype.getEnergyStorage = function () {
        return this.getMaxPacketSize();
    };
    TileEntityTransformer.prototype.init = function () {
        if (this.data.meta != undefined) {
            this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, this.data.meta + 2);
            delete this.data.meta;
        }
    };
    TileEntityTransformer.prototype.energyTick = function (type, src) {
        this.data.last_energy_receive = this.data.energy_receive;
        this.data.energy_receive = 0;
        this.data.last_voltage = this.data.voltage;
        this.data.voltage = 0;
        var maxVoltage = this.getMaxPacketSize();
        if (this.data.increaseMode) {
            if (this.data.energy >= maxVoltage) {
                this.data.energy += src.add(maxVoltage, maxVoltage) - maxVoltage;
            }
        }
        else {
            if (this.data.energy >= maxVoltage / 4) {
                var output = this.data.energy;
                this.data.energy += src.add(output, maxVoltage / 4) - output;
            }
        }
    };
    TileEntityTransformer.prototype.redstone = function (signal) {
        var newMode = signal.power > 0;
        if (newMode != this.data.increaseMode) {
            this.data.increaseMode = newMode;
            EnergyNetBuilder.rebuildTileNet(this);
        }
    };
    TileEntityTransformer.prototype.isEnergySource = function () {
        return true;
    };
    TileEntityTransformer.prototype.canReceiveEnergy = function (side) {
        if (side == this.data.meta) {
            return !this.data.increaseMode;
        }
        return this.data.increaseMode;
    };
    TileEntityTransformer.prototype.canExtractEnergy = function (side) {
        if (side == this.data.meta) {
            return this.data.increaseMode;
        }
        return !this.data.increaseMode;
    };
    TileEntityTransformer.prototype.onItemUse = function (coords, item, player) {
        if (ICTool.isValidWrench(item, 1)) {
            if (this.onWrenchUse(coords, item, player))
                ICTool.useWrench(coords, item, 1);
            return true;
        }
        return false;
    };
    TileEntityTransformer.prototype.onWrenchUse = function (coords, item, player) {
        var newFacing = coords.side;
        if (Entity.getSneaking(player)) {
            newFacing ^= 1;
        }
        if (this.setFacing(newFacing)) {
            EnergyNetBuilder.rebuildTileNet(this);
            return true;
        }
        return false;
    };
    TileEntityTransformer.prototype.getFacing = function () {
        return this.blockSource.getBlockData(this.x, this.y, this.z);
    };
    TileEntityTransformer.prototype.setFacing = function (side) {
        if (this.getFacing() != side) {
            this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
            return true;
        }
        return false;
    };
    return TileEntityTransformer;
}(TileEntityElectricMachine));
