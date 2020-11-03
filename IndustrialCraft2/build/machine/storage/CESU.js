/// <reference path="./BatBox.ts" />
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
IDRegistry.genBlockID("storageCESU");
Block.createBlock("storageCESU", [
    { name: "CESU", texture: [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]], inCreative: true }
], "machine");
ToolAPI.registerBlockMaterial(BlockID.storageCESU, "stone", 1, true);
TileRenderer.setStandardModel(BlockID.storageCESU, 0, [["cesu_front", 0], ["cesu_back", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.setStandardModel(BlockID.storageCESU, 1, [["cesu_back", 0], ["cesu_front", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.storageCESU, 2, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);
Block.registerDropFunction("storageCESU", function (coords, blockID, blockData, level) {
    return [];
});
ItemName.addStorageBlockTooltip("storageCESU", 2, "300K");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.storageCESU, count: 1, data: 0 }, [
        "bxb",
        "aaa",
        "bbb"
    ], ['x', ItemID.cableCopper1, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.plateBronze, 0]);
});
var guiCESU = new UI.StandartWindow({
    standart: {
        header: { text: { text: Translation.translate("CESU") } },
        inventory: { standart: true },
        background: { standart: true }
    },
    drawing: [
        { type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE },
    ],
    elements: {
        "energyScale": { type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 441, y: 75, isValid: MachineRegistry.isValidEUItem },
        "slot2": { type: "slot", x: 441, y: 212, isValid: MachineRegistry.isValidEUStorage },
        "textInfo1": { type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/" },
        "textInfo2": { type: "text", x: 642, y: 172, width: 300, height: 30, text: "300000" }
    }
});
Callback.addCallback("LevelLoaded", function () {
    MachineRegistry.updateGuiHeader(guiCESU, "CESU");
});
var TileEntityCESU = /** @class */ (function (_super) {
    __extends(TileEntityCESU, _super);
    function TileEntityCESU() {
        return _super.call(this, 2, 300000, BlockID.storageCESU, guiCESU) || this;
    }
    return TileEntityCESU;
}(TileEntityBatteryBlock));
MachineRegistry.registerPrototype(BlockID.storageCESU, new TileEntityCESU());
MachineRegistry.setStoragePlaceFunction("storageCESU", true);
StorageInterface.createInterface(BlockID.storageCESU, BatteryBlockInterface);
