/// <reference path="./core-engine.d.ts" />
declare type Container = NativeTileEntity | UI.Container | ItemContainer;
interface StorageDescriptor {
    slots?: {
        [key: string]: SlotData;
    };
    liquidUnitRatio?: number;
    isValidInput?(item: ItemInstance, side: number, tileEntity: TileEntity): boolean;
    addItem?(item: ItemInstance, side?: number, maxCount?: number): number;
    getInputSlots?(side?: number): string[] | number[];
    getOutputSlots?(side?: number): string[] | number[];
    canReceiveLiquid?(liquid: string, side: number): boolean;
    canTransportLiquid?(liquid: string, side: number): boolean;
    receiveLiquid?(liquidStorage: ILiquidStorage, liquid: string, amount: number): number;
    extractLiquid?(liquidStorage: ILiquidStorage, liquid: string, amount: number): number;
    getInputTank?(side: number): ILiquidStorage;
    getOutputTank?(side: number): ILiquidStorage;
}
interface Storage extends StorageDescriptor {
    container: Container;
    isNativeContainer: boolean;
    getSlot(name: string | number): ItemInstance;
    setSlot(name: string | number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    getContainerSlots(): string[] | number[];
    getInputSlots(side?: number): string[] | number[];
    getOutputSlots(side?: number): string[] | number[];
    getReceivingItemCount(item: ItemInstance, side?: number): number;
    addItemToSlot(name: string | number, item: ItemInstance, maxCount?: number): number;
    addItem(item: ItemInstance, side?: number, maxCount?: number): number;
    clearContainer(): void;
}
interface SlotData {
    input?: boolean;
    output?: boolean;
    side?: number | "horizontal" | "verctical" | "down" | "up";
    maxStack?: number;
    isValid?(item: ItemInstance, side: number, tileEntity: TileEntity): boolean;
    canOutput?(item: ItemInstance, side: number, tileEntity: TileEntity): boolean;
}
interface ILiquidStorage {
    getLiquidStored(): string;
    getLimit(liquid: string): number;
    getAmount(liquid: string): number;
    getLiquid(liquid: string, amount: number): number;
    addLiquid(liquid: string, amount: number): number;
    isFull(): boolean;
    isEmpty(): boolean;
}
declare class NativeContainerInterface implements Storage {
    readonly container: NativeTileEntity;
    readonly isNativeContainer = true;
    constructor(container: NativeTileEntity);
    getSlot(index: number): ItemInstance;
    setSlot(index: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    getContainerSlots(): any[];
    getInputSlots(side: number): number[];
    getReceivingItemCount(item: ItemInstance, side: number): number;
    addItemToSlot(index: number, item: ItemInstance, maxCount?: number): number;
    addItem(item: ItemInstance, side: number, maxCount?: number): number;
    getOutputSlots(): number[];
    clearContainer(): void;
}
declare class TileEntityInterface implements Storage {
    readonly liquidUnitRatio: number;
    readonly slots?: {
        [key: string]: SlotData;
    };
    readonly container: UI.Container | ItemContainer;
    readonly tileEntity: TileEntity;
    readonly isNativeContainer = false;
    constructor(tileEntity: TileEntity);
    getSlot(name: string): ItemInstance;
    setSlot(name: string, id: number, count: number, data: number, extra?: ItemExtraData): void;
    getSlotData(name: string): SlotData;
    getSlotMaxStack(name: string): number;
    private isValidSlotSide;
    private isValidSlotInput;
    getContainerSlots(): string[];
    private getDefaultSlots;
    getInputSlots(side?: number): string[];
    getReceivingItemCount(item: ItemInstance, side?: number): number;
    isValidInput(item: ItemInstance, side: number, tileEntity: TileEntity): boolean;
    addItemToSlot(name: string, item: ItemInstance, maxCount?: number): number;
    addItem(item: ItemInstance, side?: number, maxCount?: number): number;
    getOutputSlots(side?: number): string[];
    clearContainer(): void;
    canReceiveLiquid(liquid: string, side: number): boolean;
    canTransportLiquid(liquid: string, side: number): boolean;
    receiveLiquid(liquidStorage: ILiquidStorage, liquid: string, amount: number): number;
    extractLiquid(liquidStorage: ILiquidStorage, liquid: string, amount: number): number;
    getInputTank(side: number): ILiquidStorage;
    getOutputTank(side: number): ILiquidStorage;
}
declare namespace StorageInterface {
    type ContainersMap = {
        [key: number]: Container;
    };
    type StoragesMap = {
        [key: number]: Storage;
    };
    export var data: {
        [key: number]: StorageDescriptor;
    };
    export function getData(id: number): StorageDescriptor;
    export var directionsBySide: {
        x: number;
        y: number;
        z: number;
    }[];
    export function getRelativeCoords(coords: Vector, side: number): Vector;
    export function setSlotMaxStackPolicy(container: ItemContainer, slotName: string, maxCount: number): void;
    export function setSlotValidatePolicy(container: ItemContainer, slotName: string, func: (name: string, id: number, amount: number, data: number, extra: ItemExtraData, container: ItemContainer, playerUid: number) => boolean): void;
    export function setGlobalValidatePolicy(container: ItemContainer, func: (name: string, id: number, amount: number, data: number, extra: ItemExtraData, container: ItemContainer, playerUid: number) => boolean): void;
    /** Creates new interface instance for TileEntity or Container */
    export function getInterface(storage: TileEntity | Container): Storage;
    /** Registers interface for block container */
    export function createInterface(id: number, descriptor: StorageDescriptor): void;
    /** Trasfers item to slot
     * @count amount to transfer. Default is 64.
     * @returns transfered amount
     */
    export function addItemToSlot(item: ItemInstance, slot: ItemInstance, count?: number): number;
    /** Returns storage interface for container in the world */
    export function getStorage(region: BlockSource, x: number, y: number, z: number): Nullable<Storage>;
    /** Returns storage interface for TileEntity with liquid storage */
    export function getLiquidStorage(region: BlockSource, x: number, y: number, z: number): Nullable<TileEntityInterface>;
    /** Returns storage interface for neighbour container on specified side */
    export function getNeighbourStorage(region: BlockSource, coords: Vector, side: number): Nullable<Storage>;
    /** Returns storage interface for neighbour TileEntity with liquid storage on specified side */
    export function getNeighbourLiquidStorage(region: BlockSource, coords: Vector, side: number): Nullable<TileEntityInterface>;
    /**
     * Returns object containing neigbour containers where keys are block side numbers
     * @coords position from which check neighbour blocks
    */
    export function getNearestContainers(coords: Vector, region: BlockSource): ContainersMap;
    /**
     * Returns object containing neigbour liquid storages where keys are block side numbers
     * @coords position from which check neighbour blocks
    */
    export function getNearestLiquidStorages(coords: Vector, region: BlockSource): StoragesMap;
    /**
     * Returns array of slot indexes for vanilla container or array of slot names for mod container
    */
    export function getContainerSlots(container: Container): string[] | number[];
    /** Puts items to containers */
    export function putItems(items: ItemInstance[], containers: ContainersMap): void;
    /**
     * @side block side of container which receives item
     * @maxCount max count of item to transfer (optional)
    */
    export function putItemToContainer(item: ItemInstance, container: TileEntity | Container, side?: number, maxCount?: number): number;
    /**
     * Extracts items from one container to another
     * @inputContainer container to receive items
     * @outputContainer container to extract items
     * @inputSide block side of input container which is receiving items
     * @maxCount max total count of extracted items (optional)
     * @oneStack if true, will extract only 1 item
    */
    export function extractItemsFromContainer(inputContainer: TileEntity | Container, outputContainer: TileEntity | Container, inputSide: number, maxCount?: number, oneStack?: boolean): number;
    /**
     * Extracts items from one container to another
     * @inputStorage container interface to receive items
     * @outputStorage container interface to extract items
     * @inputSide block side of input container which is receiving items
     * @maxCount max total count of extracted items (optional)
     * @oneStack if true, will extract only 1 item
    */
    export function extractItemsFromStorage(inputStorage: Storage, outputStorage: Storage, inputSide: number, maxCount?: number, oneStack?: boolean): number;
    /**
     * Extract liquid from one storage to another
     * @liquid liquid to extract. If null, will extract liquid stored in output storage
     * @maxAmount max amount of liquid that can be transfered
     * @inputStorage storage to input liquid
     * @outputStorage storage to extract liquid
     * @inputSide block side of input storage which is receiving
     * @returns left liquid amount
    */
    export function extractLiquid(liquid: Nullable<string>, maxAmount: number, inputStorage: TileEntity | Storage, outputStorage: Storage, inputSide: number): number;
    /** Similar to StorageInterface.extractLiquid, but liquid must be specified */
    export function transportLiquid(liquid: string, maxAmount: number, outputStorage: TileEntity | Storage, inputStorage: Storage, outputSide: number): number;
    /**
     * Every 8 ticks checks neigbour hoppers and transfers items.
     * Use it in tick function of TileEntity
    */
    export function checkHoppers(tile: TileEntity): void;
    export {};
}
