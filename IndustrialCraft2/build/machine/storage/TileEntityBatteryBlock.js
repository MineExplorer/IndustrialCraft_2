/// <reference path="../TileEntityElectricMachine.ts" />
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
var TileEntityBatteryBlock = /** @class */ (function (_super) {
    __extends(TileEntityBatteryBlock, _super);
    function TileEntityBatteryBlock(tier, capacity, defaultDrop, guiScreen) {
        var _this = _super.call(this, tier) || this;
        _this.capacity = capacity;
        _this.defaultDrop = defaultDrop;
        _this.guiScreen = guiScreen;
        return _this;
    }
    TileEntityBatteryBlock.prototype.getScreenByName = function (screenName) {
        return screenName == "main" ? this.guiScreen : null;
    };
    TileEntityBatteryBlock.prototype.init = function () {
        if (this.data.meta != undefined) {
            this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, this.data.meta + 2);
            delete this.data.meta;
        }
    };
    TileEntityBatteryBlock.prototype.onItemUse = function (coords, item, player) {
        if (ICTool.isValidWrench(item, 1)) {
            if (this.onWrenchUse(coords, item, player))
                ICTool.useWrench(coords, item, 1);
            return true;
        }
        return false;
    };
    TileEntityBatteryBlock.prototype.onWrenchUse = function (coords, item, player) {
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
    TileEntityBatteryBlock.prototype.getFacing = function () {
        return this.blockSource.getBlockData(this.x, this.y, this.z);
    };
    TileEntityBatteryBlock.prototype.setFacing = function (side) {
        if (this.getFacing() != side) {
            this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
            return true;
        }
        return false;
    };
    TileEntityBatteryBlock.prototype.tick = function () {
        StorageInterface.checkHoppers(this);
        var tier = this.getTier();
        var energyStorage = this.getEnergyStorage();
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), "Eu", energyStorage - this.data.energy, tier);
        this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), "Eu", this.data.energy, tier);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
        this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
        this.container.setText("textInfo2", energyStorage);
    };
    TileEntityBatteryBlock.prototype.getEnergyStorage = function () {
        return this.capacity;
    };
    TileEntityBatteryBlock.prototype.canReceiveEnergy = function (side) {
        return side != this.data.meta;
    };
    TileEntityBatteryBlock.prototype.canExtractEnergy = function (side) {
        return side == this.data.meta;
    };
    TileEntityBatteryBlock.prototype.destroyBlock = function (coords, player) {
        var itemID = Entity.getCarriedItem(player).id;
        var level = ToolAPI.getToolLevelViaBlock(itemID, this.blockID);
        var drop = MachineRegistry.getMachineDrop(coords, this.blockID, level, this.defaultDrop, this.data.energy);
        if (drop.length > 0) {
            this.blockSource.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, drop[0][0], drop[0][1], drop[0][2]);
        }
    };
    return TileEntityBatteryBlock;
}(TileEntityElectricMachine));
var BatteryBlockInterface = {
    slots: {
        "slot1": { input: true, output: true, isValid: function (item, side, tileEntity) {
                return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", tileEntity.getTier());
            },
            canOutput: function (item) {
                return ChargeItemRegistry.getEnergyStored(item) >= ChargeItemRegistry.getMaxCharge(item.id);
            }
        },
        "slot2": { input: true, output: true, isValid: function (item, side, tileEntity) {
                return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", tileEntity.getTier());
            },
            canOutput: function (item) {
                return ChargeItemRegistry.getEnergyStored(item) <= 0;
            }
        }
    }
};
