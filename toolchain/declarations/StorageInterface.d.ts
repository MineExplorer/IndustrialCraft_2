/// <reference path="./core-engine.d.ts" />

declare namespace StorageInterface {
    const data: {};
    const directionsBySide: {
        x: number;
        y: number;
        z: number;
    }[];
    function getRelativeCoords(coords: Vector, side: number): {
        x: number;
        y: number;
        z: number;
    };
    function setSlotMaxStackPolicy(container: ItemContainer, slotName: string, maxCount: number): void;
    function setSlotValidatePolicy(container: ItemContainer, slotName: string, func: (id: number, amount: number, data: number, extra: ItemExtraData, container: ItemContainer, name: string, playerUid: number) => boolean): void;
    function setGlobalValidatePolicy(container: ItemContainer, func: (id: number, amount: number, data: number, extra: ItemExtraData, container: ItemContainer, name: string, playerUid: number) => boolean): void;
    function newInstance(id: number, tileEntity: TileEntity): {
        tileEntity: TileEntity;
        container: ItemContainer;
        liquidStorage: any;
    };
    function createInterface(id: number, interface: any): void;
    function addItemToSlot(item: ItemInstance, slot: ItemInstance, count: number): number;
    function getNearestContainers(coords: Vector, side: number, excludeSide?: boolean): {};
    function getNearestLiquidStorages(coords: Vector, side: number, excludeSide?: boolean): {};
    function putItems(items: ItemInstance[], containers: any): void;
    function putItemToContainer(item: ItemInstance, container: NativeTileEntity | UI.Container | ItemContainer, side: number, maxCount?: number): number;
    function extractItemsFromContainer(inputTile: TileEntity, container: NativeTileEntity | UI.Container | ItemContainer, side: number, maxCount?: number, oneStack?: boolean): number;
    function extractLiquid(liquid: string, maxAmount: number, input: TileEntity, output: TileEntity, inputSide: number): void;
    function transportLiquid(liquid: string, maxAmount: number, output: TileEntity, input: TileEntity, outputSide: number): void;
    function getContainerSlots(container: NativeTileEntity | UI.Container | ItemContainer, mode?: number, side?: number): (string | number)[];
    function checkHoppers(tile: TileEntity): void;
    function extractItems(items: ItemInstance[], containers: any, tile: TileEntity): void;
}
