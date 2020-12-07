interface StorageDescriptor {
    slots?: {
        [key: string]: SlotInterface;
    };
    isValidInput?(item: ItemInstance, side: number, tileEntity: TileEntity): boolean;
    addItem?(item: ItemInstance, side: number, maxCount?: number): number;
    getOutputSlots?(side: number): string[] | number[];
    canReceiveLiquid?(liquid: string, side?: number): boolean;
    canTransportLiquid?(liquid: string, side?: number): boolean;
    addLiquid?(liquid: string, amount: number): number;
    getLiquid?(liquid: string, amount: number): number;
    getLiquidStored?(storageName: string): string;
    getLiquidStorage?(storageName: string): string;
}
interface IStorage extends StorageDescriptor {
    isNativeContainer(): boolean;
    getSlot(name: string | number): ItemInstance;
    setSlot(name: string | number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    addItem(item: ItemInstance, side: number, maxCount?: number): number;
    getOutputSlots(side: number): string[] | number[];
}
interface SlotInterface {
    input?: boolean;
    output?: boolean;
    side?: number | "horizontal" | "down" | "up";
    isValid?(item: ItemInstance, side: number, tileEntity: TileEntity): boolean;
    canOutput?(item: ItemInstance, side: number, tileEntity: TileEntity): boolean;
}
declare class NativeContainerInterface implements IStorage {
    container: NativeTileEntity;
    constructor(container: NativeTileEntity);
    isNativeContainer(): boolean;
    getSlot(index: number): ItemInstance;
    setSlot(index: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    private isValidInputSlot;
    addItem(item: ItemInstance, side: number, maxCount: number): number;
    getOutputSlots(side: number): number[];
}
declare class TileEntityInterface implements IStorage {
    slots?: {
        [key: string]: SlotInterface;
    };
    container: UI.Container | ItemContainer;
    tileEntity: TileEntity;
    liquidStorage: any;
    constructor(tileEntity: TileEntity);
    isNativeContainer(): boolean;
    getSlot(name: string): ItemInstance;
    setSlot(name: string, id: number, count: number, data: number, extra?: ItemExtraData): void;
    isValidInput(item: ItemInstance, side: number, tileEntity: TileEntity): boolean;
    checkSide(slotSideTag: string | number, side: number): boolean;
    addItem(item: ItemInstance, side: number, maxCount?: number): number;
    getOutputSlots(side: number): string[];
    canReceiveLiquid(liquid: string, side?: number): boolean;
    canTransportLiquid(liquid: string, side?: number): boolean;
    addLiquid(liquid: string, amount: number): number;
    getLiquid(liquid: string, amount: number): number;
    getLiquidStored(storageName?: string): string;
    getLiquidStorage(storageName?: string): any;
}
declare let LIQUID_STORAGE_MAX_LIMIT: number;
declare type Container = NativeTileEntity | UI.Container | ItemContainer;
declare namespace StorageInterface {
    var data: {};
    var directionsBySide: {
        x: number;
        y: number;
        z: number;
    }[];
    function getRelativeCoords(coords: Vector, side: number): Vector;
    function setSlotMaxStackPolicy(container: ItemContainer, slotName: string, maxCount: number): void;
    function setSlotValidatePolicy(container: ItemContainer, slotName: string, func: (name: string, id: number, amount: number, data: number, extra: ItemExtraData, container: ItemContainer, playerUid: number) => boolean): void;
    function setGlobalValidatePolicy(container: ItemContainer, func: (name: string, id: number, amount: number, data: number, extra: ItemExtraData, container: ItemContainer, playerUid: number) => boolean): void;
    function newStorage(storage: TileEntity | Container): IStorage;
    function createInterface(id: number, descriptor: StorageDescriptor): void;
    function addItemToSlot(item: ItemInstance, slot: ItemInstance, count: number): number;
    function getStorage(region: BlockSource, x: number, y: number, z: number): Nullable<IStorage>;
    function getLiquidStorage(region: BlockSource, x: number, y: number, z: number): Nullable<TileEntityInterface>;
    function getNeighbourStorage(region: BlockSource, coords: Vector, side: number): Nullable<IStorage>;
    function getNeighbourLiquidStorage(region: BlockSource, coords: Vector, side: number): Nullable<TileEntityInterface>;
    function getNearestContainers(coords: Vector, side?: number, region?: BlockSource): object;
    function getNearestLiquidStorages(coords: Vector, side?: number, region?: BlockSource): object;
    function getContainerSlots(container: Container): string[] | number[];
    function putItems(items: ItemInstance[], containers: object): void;
    function putItemToContainer(item: ItemInstance, container: Container, side: number, maxCount?: number): number;
    function extractItemsFromContainer(inputContainer: TileEntity | Container, outputContainer: TileEntity | Container, side: number, maxCount?: number, oneStack?: boolean): number;
    function extractLiquid(liquid: Nullable<string>, maxAmount: number, inputStorage: TileEntity | IStorage, outputStorage: TileEntity | IStorage, inputSide: number): number;
    function transportLiquid(liquid: string, maxAmount: number, outputStorage: TileEntity | IStorage, inputStorage: TileEntity | IStorage, outputSide: number): number;
    function checkHoppers(tile: TileEntity): void;
}
