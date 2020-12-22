/// <reference path="./core-engine.d.ts" />

declare type T_BackpackItem = IBackpackObjectItem | number | string;
/**
 * Object representing the item or group of items that can be stored in backpack
 */
interface IBackpackObjectItem {
    /**
     * The item id. May be number or regex string.
     */
    id: number | string;
    /**
     * The item data. May be number or regex string.
     * @default 0
     */
    data?: number | string;
}
declare enum BackpackKind {
    EXTRA = "extra",
    META = "meta"
}
declare type T_ValidationFunc = (id: number, count: number, data: number) => boolean;
/**
 * Object representing properties of the backpack
 */
interface IBackpackPrototype {
    /**
     * For backward compatibility.
     * @see kind
     * @deprecated
     */
    useExtraData?: boolean;
    /**
     * Specify where backpack id is stored.
     * @default <i>BackpackKind.META</i>
     */
    kind?: BackpackKind;
    /**
     * Backpack title.
     */
    title?: string;
    /**
     * Amount of slots in the backpack.
     * @default 10
     */
    slots?: number;
    /**
     * Do the slots center?
     * @default true
     */
    slotsCenter?: boolean;
    /**
     * Amount of slots in a one row.
     */
    inRow?: number;
    /**
     * Items that can be stored the backpack.
     * @default []
     */
    items?: T_BackpackItem[];
    /**
     * A function that checks whether an item can be put in a backpack. The default function checks if an item
     * is specified in the <i>items</i> field.
     * @param id - item id
     * @param count - item count
     * @param data - item data
     * @return {boolean} whether an item can be put in a backpack.
     */
    isValidItem?: T_ValidationFunc;
    /**
     * GUI of the backpack.
     */
    gui?: UI.Window | UI.WindowGroup;
}
interface IBackpacksSaverScope {
    nextUnique: number;
    containers: {
        [key: string]: UI.Container;
    };
}
declare class BackpackRegistry {
    /**
     * Next unique backpack identifier.
     */
    static nextUnique: number;
    /**
     * Containers of backpacks. Key is 'dIdentifier'. For example, 'd1'.
     */
    static containers: {
        [key: string]: UI.Container;
    };
    /**
     * Object that store prototypes of backpacks. Key is backpack id.
     */
    static prototypes: {
        [key: number]: IBackpackPrototype;
    };
    /**
     * Backpack registration function.
     * @param id - item id
     * @param prototype - object representing properties of the backpack
     */
    static register(id: number, prototype: IBackpackPrototype): void;
    /**
     * Checks whether an item can be put in the backpack.
     * @param id - item id
     * @param data - item data
     * @param items - items than can be put in the backpack
     * @returns whether an item can be put in the backpack.
     */
    static isValidFor(id: number, data: number, items: T_BackpackItem[]): boolean;
    /**
     * Open backpack gui.
     * @param item - item
     * @param notUpdateData - If false and no container has been created for the passed data, a new item will be set
     * in the player’s hand
     * @returns backpack container id.
     */
    static openGuiFor(item: ItemInstance, notUpdateData?: boolean): number | null;
    /**
     * Checks whether the item is backpack or not.
     * @param id - item id
     * @returns whether the item is backpack or not
     */
    static isBackpack(id: number): boolean;
    /**
     * Helper function for adding items to the gui.
     * @param gui - gui to which slots will be added
     * @param slots - amount of slots
     * @param isValidFunc - validation function
     * @param inRow - Amount of slots in one row
     * @param center - Do the slots center?
     * @param x - Initial x coordinate. Ignored if the center argument is true
     * @param y - Initial y coordinate.
     * @returns gui.
     */
    static addSlotsToGui(gui: UI.Window | UI.WindowGroup, slots: number, isValidFunc: T_ValidationFunc, inRow: number, center: boolean, x?: number, y?: number): UI.Window | UI.WindowGroup;
}
