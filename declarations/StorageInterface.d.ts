declare namespace StorageInterface {
    const data: {};
    const directionsBySide: {
        x: number;
        y: number;
        z: number;
    }[];
    function getRelativeCoords(coords: any, side: number): {
        x: number;
        y: number;
        z: number;
    };
    function newInstance(id: number, tileEntity: any): {
        tileEntity: any;
        container: any;
        liquidStorage: any;
    };
    function createInterface(id: number, interface: any): void;
    function addItemToSlot(item: any, slot: any, count: number): number;
    function getNearestContainers(coords: any, side: number, excludeSide?: boolean): {};
    function getNearestLiquidStorages(coords: any, side: number, excludeSide?: boolean): {};
    function putItems(items: any, containers: any): void;
    function putItemToContainer(item: any, container: any, side: number, maxCount?: number): any;
    function extractItemsFromContainer(inputTile: any, container: any, side: number, maxCount?: number, oneStack?: boolean): number;
    function extractLiquid(liquid: any, maxAmount: number, input: any, output: any, inputSide: number): void;
    function transportLiquid(liquid: any, maxAmount: number, output: any, input: any, outputSide: number): void;
    function getContainerSlots(container: any, mode: number, side: number): (string | number)[];
    function checkHoppers(tile: any): void;
    function extractItems(items: any, containers: any, tile: any): void;
}
