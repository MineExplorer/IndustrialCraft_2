declare namespace BlockEngine {
    function getGameVersion(): number[];
    function getMainGameVersion(): number;
    function sendUnlocalizedMessage(client: NetworkClient, ...texts: string[]): void;
}
declare enum Side {
    Client = 0,
    Server = 1
}
declare namespace BlockEngine {
    namespace Decorators {
        function ClientSide(target: TileEntityBase, propertyName: string): void;
        function NetworkEvent(side: Side): (target: TileEntityBase, propertyName: string) => void;
        function ContainerEvent(side: Side): (target: TileEntityBase, propertyName: string) => void;
    }
}
declare class Vector3 implements Vector {
    static readonly DOWN: Vector3;
    static readonly UP: Vector3;
    static readonly NORTH: Vector3;
    static readonly SOUTH: Vector3;
    static readonly EAST: Vector3;
    static readonly WEST: Vector3;
    static getDirection(side: number): Vector3;
    x: number;
    y: number;
    z: number;
    constructor(vx: number, vy: number, vz: number);
    constructor(vx: Vector);
    copy(dst?: Vector3): Vector3;
    set(vx: number, vy: number, vz: number): Vector3;
    set(vx: Vector): Vector3;
    add(vx: number, vy: number, vz: number): Vector3;
    add(vx: Vector): Vector3;
    addScaled(v: Vector, scale: number): Vector3;
    sub(vx: number, vy: number, vz: number): Vector3;
    sub(vx: Vector): Vector3;
    cross(vx: number, vy: number, vz: number): Vector3;
    cross(vx: Vector): Vector3;
    dot(vx: number, vy: number, vz: number): Vector3;
    dot(vx: any): Vector3;
    normalize(): Vector3;
    lengthSquared(): number;
    length(): number;
    negate(): Vector3;
    distanceSquared(vx: number, vy: number, vz: number): number;
    distanceSquared(vx: Vector): number;
    distance(vx: number, vy: number, vz: number): number;
    distance(vx: Vector): number;
    scale(factor: number): Vector3;
    scaleTo(len: number): Vector3;
    toString(): string;
}
/**
 * Class to work with world based on BlockSource
 */
declare class WorldRegion {
    blockSource: BlockSource;
    constructor(blockSource: BlockSource);
    /**
     * @returns interface to given dimension
     * (null if given dimension is not loaded and this interface
     * was not created yet)
     */
    static getForDimension(dimension: number): Nullable<WorldRegion>;
    /**
     * @returns interface to the dimension where the given entity is
     * (null if given entity does not exist or the dimension is not loaded
     * and interface was not created)
     */
    static getForActor(entityUid: number): Nullable<WorldRegion>;
    static getCurrentWorldGenRegion(): Nullable<WorldRegion>;
    /**
     * @returns the dimension id to which the following object belongs
     */
    getDimension(): number;
    /**
     * @returns BlockState object of the block at coords
     */
    getBlock(coords: Vector): BlockState;
    getBlock(x: number, y: number, z: number): BlockState;
    /**
     * @returns block's id at coords
     */
    getBlockId(coords: Vector): number;
    getBlockId(x: number, y: number, z: number): number;
    /**
     * @returns block's data at coords
     */
    getBlockData(coords: Vector): number;
    getBlockData(x: number, y: number, z: number): number;
    /**
     * Sets block on coords
     * @param id - id of the block to set
     * @param data - data of the block to set
     */
    setBlock(coords: Vector, state: BlockState): void;
    setBlock(coords: Vector, id: number, data: number): void;
    setBlock(x: number, y: number, z: number, state: BlockState): void;
    setBlock(x: number, y: number, z: number, id: number, data: number): void;
    /**
     * Destroys block on coords producing appropriate drop and particles.
     * @param drop whether to provide drop for the block or not
     * @param player player entity if the block was destroyed by player
     */
    destroyBlock(coords: Vector, drop?: boolean, player?: number): void;
    destroyBlock(x: number, y: number, z: number, drop?: boolean, player?: number): void;
    /**
     * @returns interface to the vanilla TileEntity (chest, furnace, etc.) on the coords
     */
    getNativeTileEntity(coords: Vector): NativeTileEntity;
    getNativeTileEntity(x: number, y: number, z: number): NativeTileEntity;
    /**
     * @returns TileEntity located on the specified coordinates if it is initialized
     */
    getTileEntity(coords: Vector): TileEntity;
    getTileEntity(x: number, y: number, z: number): TileEntity;
    /**
     * If the block on the specified coordinates is a TileEntity block and is
     * not initialized, initializes it and returns created TileEntity object
     * @returns TileEntity if one was created, null otherwise
     */
    addTileEntity(coords: Vector): TileEntity;
    addTileEntity(x: number, y: number, z: number): TileEntity;
    /**
     * If the block on the specified coordinates is a TileEntity, destroys
     * it, dropping its container
     * @returns true if the TileEntity was destroyed successfully, false
     * otherwise
     */
    removeTileEntity(coords: Vector): boolean;
    removeTileEntity(x: number, y: number, z: number): boolean;
    /**
     * @returns if the block on the specified coordinates is a TileEntity, returns
     * its container, if the block is a NativeTileEntity, returns it, if
     * none of above, returns null
     */
    getContainer(coords: Vector): NativeTileEntity | UI.Container | ItemContainer;
    getContainer(x: number, y: number, z: number): NativeTileEntity | UI.Container | ItemContainer;
    /**
     * Causes an explosion on coords
     * @param power defines radius of the explosion and what blocks it can destroy
     * @param fire if true, puts the crater on fire
     */
    explode(coords: Vector, power: number, fire?: boolean): void;
    explode(x: number, y: any, z: any, power: number, fire?: boolean): void;
    /**
     * @returns biome id at X and Z coord
     */
    getBiome(x: number, z: number): number;
    /**
     * Sets biome id by coords
     * @param id - id of the biome to set
     */
    setBiome(x: number, z: number, biomeID: number): void;
    /**
     * @returns temperature of the biome on coords
     */
    getBiomeTemperatureAt(coords: Vector): number;
    getBiomeTemperatureAt(x: number, y: number, z: number): number;
    /**
     * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns true if chunk is loaded, false otherwise
     */
    isChunkLoaded(chunkX: number, chunkZ: number): boolean;
    /**
     * @param x X coord of the position
     * @param z Z coord of the position
     * @returns true if chunk on the position is loaded, false otherwise
     */
    isChunkLoadedAt(x: number, z: number): boolean;
    /**
     * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns the loading state of the chunk by chunk coords
     */
    getChunkState(chunkX: number, chunkZ: number): number;
    /**
     * @param x X coord of the position
     * @param z Z coord of the position
     * @returns the loading state of the chunk by coords
     */
    getChunkStateAt(x: number, z: number): number;
    /**
     * @returns light level on the specified coordinates, from 0 to 15
     */
    getLightLevel(coords: Vector): number;
    getLightLevel(x: number, y: number, z: number): number;
    /**
     * @returns whether the sky can be seen from coords
     */
    canSeeSky(coords: Vector): boolean;
    canSeeSky(x: number, y: number, z: number): boolean;
    /**
     * @returns grass color on coords
     */
    getGrassColor(coords: Vector): number;
    getGrassColor(x: number, y: number, z: number): number;
    /**
     * Creates dropped item and returns entity id
     * @param x X coord of the place where item will be dropped
     * @param y Y coord of the place where item will be dropped
     * @param z Z coord of the place where item will be dropped
     * @param item object representing item stack
     * @returns drop entity id
     */
    dropItem(x: number, y: number, z: number, item: ItemInstance): number;
    dropItem(x: number, y: number, z: number, id: number, count: number, data: number, extra?: ItemExtraData): number;
    /**
     * Spawns entity of given numeric type on coords
     */
    spawnEntity(x: number, y: number, z: number, type: number | string): number;
    spawnEntity(x: number, y: number, z: number, namespace: string, type: string, init_data: string): number;
    /**
     * Spawns experience orbs on coords
     * @param amount experience amount
     */
    spawnExpOrbs(x: number, y: number, z: number, amount: number): void;
    /**
     * @returns the list of entity IDs in given box,
     * that are equal to the given type, if blacklist value is false,
     * and all except the entities of the given type, if blacklist value is true
     */
    listEntitiesInAABB(pos1: Vector, pos2: Vector, type?: number, blacklist?: boolean): number[];
    listEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type?: number, blacklist?: boolean): number[];
    /**
     * Plays standart Minecraft sound on the specified coordinates
     * @param name sound name
     * @param volume sound volume from 0 to 1. Default is 1.
     * @param pitch sound pitch, from 0 to 1. Default is 1.
     */
    playSound(x: number, y: number, z: number, name: string, volume?: number, pitch?: number): void;
    /**
     * Plays standart Minecraft sound from the specified entity
     * @param name sound name
     * @param volume sound volume from 0 to 1. Default is 1.
     * @param pitch sound pitch, from 0 to 1. Default is 1.
     */
    playSoundAtEntity(ent: number, name: string, volume?: number, pitch?: number): void;
    /**
     * Sends network packet for players in a radius from specified coords
     * @param packetName name of the packet to send
     * @param data packet data object
     */
    sendPacketInRadius(coords: Vector, radius: number, packetName: string, data: object): void;
}
declare class PlayerEntity {
    actor: PlayerActor;
    playerUid: number;
    constructor(playerUid: number);
    /**
     * @returns player's unique numeric entity id
     */
    getUid(): number;
    /**
     * @returns the id of dimension where player is.
     */
    getDimension(): number;
    /**
     * @returns player's gamemode.
     */
    getGameMode(): number;
    /**
     * Adds item to player's inventory
     * @param dropRemainings if true, surplus will be dropped near player
     */
    addItemToInventory(item: ItemInstance): void;
    addItemToInventory(id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * @returns inventory slot's contents.
     */
    getInventorySlot(slot: number): ItemStack;
    /**
     * Sets inventory slot's contents.
     */
    setInventorySlot(slot: number, item: ItemInstance): void;
    setInventorySlot(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * @returns item in player's hand
    */
    getCarriedItem(): ItemStack;
    /**
     * Sets item in player's hand
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    setCarriedItem(item: ItemInstance): void;
    setCarriedItem(id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * Decreases carried item count by specified number
     * @param amount amount of items to decrease, default is 1
     */
    decreaseCarriedItem(amount?: number): void;
    /**
     * @returns armor slot's contents.
     */
    getArmor(slot: number): ItemInstance;
    /**
     * Sets armor slot's contents.
     */
    setArmor(slot: number, item: ItemInstance): void;
    setArmor(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * Sets respawn coords for the player.
     */
    setRespawnCoords(x: number, y: number, z: number): void;
    /**
     * Spawns exp on coords.
     * @param value experience points value
     */
    spawnExpOrbs(x: number, y: number, z: number, value: number): void;
    /**
     * @returns whether the player is a valid entity.
     */
    isValid(): boolean;
    /**
     * @returns player's selected slot.
     */
    getSelectedSlot(): number;
    /**
     * Sets player's selected slot.
     */
    setSelectedSlot(slot: number): void;
    /**
     * @returns player's experience.
     */
    getExperience(): number;
    /**
     * Sets player's experience.
     */
    setExperience(value: number): void;
    /**
     * Add experience to player.
     */
    addExperience(amount: number): void;
    /**
     * @returns player's xp level.
     */
    getLevel(): number;
    /**
     * Sets player's xp level.
     */
    setLevel(level: number): void;
    /**
     * @returns player's exhaustion.
     */
    getExhaustion(): number;
    /**
     * Sets player's exhaustion.
     */
    setExhaustion(value: number): void;
    /**
     * @returns player's hunger.
     */
    getHunger(): number;
    /**
     * Sets player's hunger.
     */
    setHunger(value: number): void;
    /**
     * @returns player's saturation.
     */
    getSaturation(): number;
    /**
     * Sets player's saturation.
     */
    setSaturation(value: number): void;
    /**
     * @returns player's score.
     */
    getScore(): number;
    /**
     * Sets player's score.
     */
    setScore(value: number): void;
}
declare namespace EntityCustomData {
    function getAll(): {
        [key: number]: object;
    };
    function getData(entity: number): object;
    function putData(entity: number, data: object): void;
    function getField(entity: number, key: string): any;
    function putField(entity: number, key: string, value: any): void;
}
declare class ItemStack implements ItemInstance {
    id: number;
    count: number;
    data: number;
    extra?: ItemExtraData;
    constructor();
    constructor(item: ItemInstance);
    constructor(id: number, count: number, data?: number, extra?: ItemExtraData);
    getItemInstance(): Nullable<ItemBase>;
    getMaxStack(): number;
    getMaxDamage(): number;
    decrease(count: number): void;
    clear(): void;
    applyDamage(damage: number): void;
}
interface ItemBehavior {
    onNameOverride?(item: ItemInstance, translation: string, name: string): string;
    onIconOverride?(item: ItemInstance, isModUi: boolean): Item.TextureData;
    onItemUse?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
    onNoTargetUse?(item: ItemStack, player: number): void;
    onUsingReleased?(item: ItemStack, ticks: number, player: number): void;
    onUsingComplete?(item: ItemStack, player: number): void;
    onDispense?(coords: Callback.ItemUseCoordinates, item: ItemStack, region: WorldRegion): void;
}
declare class ItemBase {
    readonly stringID: string;
    readonly id: number;
    name: string;
    icon: {
        name: string;
        meta: number;
    };
    maxStack: number;
    maxDamage: number;
    item: Item.NativeItem;
    constructor(stringID: string, name?: string, icon?: string | Item.TextureData);
    setName(name: string): void;
    setIcon(texture: string, index?: number): void;
    /**
     * Sets item creative category
     * @param category item category, should be integer from 1 to 4.
     */
    setCategory(category: number): void;
    /**
     * Sets item maximum stack size
     * @param maxStack maximum stack size for the item
     */
    setMaxStack(maxStack: number): void;
    /**
     * Sets item maximum data value
     * @param maxDamage maximum data value for the item
     */
    setMaxDamage(maxDamage: number): void;
    /**
    * Specifies how the player should hold the item
    * @param enabled if true, player holds the item as a tool, not as a simple
    * item
    */
    setHandEquipped(enabled: boolean): void;
    /**
     * Allows item to be put in off hand
     */
    allowInOffHand(): void;
    /**
     * Allows item to click on liquid blocks
     */
    setLiquidClip(): void;
    /**
     * Specifies how the item can be enchanted
     * @param type enchant type defining whan enchants can or cannot be
     * applied to this item, one of the Native.EnchantType
     * @param enchantability quality of the enchants that are applied, the higher this
     * value is, the better enchants you get with the same level
     */
    setEnchantType(type: number, enchantability: number): void;
    /**
     * Sets item as glint (like enchanted tools or golden apple)
     * @param enabled if true, the item will be displayed as glint item
     */
    setGlint(enabled: boolean): void;
    /**
     * Adds material that can be used to repair the item in the anvil
     * @param itemID item id to be used as repair material
     */
    addRepairItem(itemID: number): void;
    setRarity(rarity: number): void;
}
declare class ItemCommon extends ItemBase {
    constructor(stringID: string, name?: string, icon?: string | Item.TextureData, inCreative?: boolean);
}
declare class ItemFood extends ItemBase {
    constructor(stringID: string, name?: string, icon?: string | Item.TextureData, food?: number, inCreative?: boolean);
    onFoodEaten(item: ItemInstance, food: number, saturation: number, player: number): void;
}
declare class ItemThrowable extends ItemBase {
    constructor(stringID: string, name?: string, icon?: string | Item.TextureData, inCreative?: boolean);
    onProjectileHit(projectile: number, item: ItemInstance, target: Callback.ProjectileHitTarget): void;
}
interface OnHurtListener {
    onHurt: (params: {
        attacker: number;
        type: number;
        damage: number;
        bool1: boolean;
        bool2: boolean;
    }, item: ItemInstance, slot: number, player: number) => ItemInstance | void;
}
interface OnTickListener {
    onTick: (item: ItemInstance, slot: number, player: number) => ItemInstance | void;
}
interface OnTakeOnListener {
    onTakeOn: (item: ItemInstance, slot: number, player: number) => void;
}
interface OnTakeOffListener {
    onTakeOff: (item: ItemInstance, slot: number, player: number) => void;
}
declare type ArmorMaterial = {
    durabilityFactor: number;
    enchantability?: number;
    repairMaterial?: number;
};
declare type ArmorType = "helmet" | "chestplate" | "leggings" | "boots";
declare type ArmorParams = {
    type: ArmorType;
    defence: number;
    texture: string;
    material?: string | ArmorMaterial;
};
declare class ItemArmor extends ItemBase {
    private static maxDamageArray;
    armorMaterial: ArmorMaterial;
    armorType: ArmorType;
    defence: number;
    texture: string;
    constructor(stringID: string, name: string, icon: string | Item.TextureData, params: ArmorParams, inCreative?: boolean);
    setArmorTexture(texture: string): void;
    setMaterial(armorMaterial: string | ArmorMaterial): void;
    preventDamaging(): void;
    static registerListeners(id: number, armorFuncs: ItemArmor | OnHurtListener | OnTickListener | OnTakeOnListener | OnTakeOffListener): void;
}
interface ToolParams extends ToolAPI.ToolParams {
    handEquipped?: boolean;
    enchantType?: number;
    blockTypes?: string[];
    onItemUse?: (coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number) => void;
}
interface ToolMaterial extends ToolAPI.ToolMaterial {
    enchantability?: number;
    repairMaterial?: number;
}
declare namespace ToolType {
    let SWORD: ToolParams;
    let SHOVEL: ToolParams;
    let PICKAXE: ToolParams;
    let AXE: ToolParams;
    let HOE: ToolParams;
    let SHEARS: ToolParams;
}
declare class ItemTool extends ItemCommon implements ToolParams {
    handEquipped: boolean;
    brokenId: number;
    damage: number;
    isWeapon: boolean;
    blockTypes: string[];
    toolMaterial: ToolMaterial;
    enchantType: number;
    constructor(stringID: string, name: string, icon: string | Item.TextureData, toolMaterial: string | ToolMaterial, toolData?: ToolParams, inCreative?: boolean);
}
declare enum ItemCategory {
    BUILDING = 1,
    NATURE = 2,
    EQUIPMENT = 3,
    ITEMS = 4
}
declare enum EnumRarity {
    COMMON = 0,
    UNCOMMON = 1,
    RARE = 2,
    EPIC = 3
}
declare namespace ItemRegistry {
    export function isBlock(id: number): boolean;
    export function isItem(id: number): boolean;
    export function getInstanceOf(itemID: string | number): Nullable<ItemBase>;
    /**
     * @returns EnumRarity value for item
     * @param itemID item's id
     */
    export function getRarity(itemID: number): number;
    /**
     * @returns chat color for rarity
     * @param rarity one of EnumRarity values
     */
    export function getRarityColor(rarity: number): string;
    /**
     * @returns chat color for item's rarity
     * @param itemID item's id
     */
    export function getItemRarityColor(itemID: number): string;
    export function setRarity(id: string | number, rarity: number, preventNameOverride?: boolean): void;
    export function addArmorMaterial(name: string, material: ArmorMaterial): void;
    export function getArmorMaterial(name: string): ArmorMaterial;
    export function addToolMaterial(name: string, material: ToolMaterial): void;
    export function getToolMaterial(name: string): ToolMaterial;
    export function registerItem(itemInstance: ItemBase): ItemBase;
    export function registerItemFuncs(itemID: string | number, itemFuncs: ItemBase | ItemBehavior): void;
    interface ItemDescription {
        name: string;
        icon: string | Item.TextureData;
        type?: "common" | "food" | "throwable";
        stack?: number;
        inCreative?: boolean;
        category?: number;
        maxDamage?: number;
        handEquipped?: boolean;
        allowedInOffhand?: boolean;
        glint?: boolean;
        enchant?: {
            type: number;
            value: number;
        };
        rarity?: number;
        food?: number;
    }
    export function createItem(stringID: string, params: ItemDescription): void;
    interface ArmorDescription extends ArmorParams {
        name: string;
        icon: string | Item.TextureData;
        inCreative?: boolean;
        category?: number;
        glint?: boolean;
        rarity?: number;
    }
    export function createArmor(stringID: string, params: ArmorDescription): ItemArmor;
    interface ToolDescription {
        name: string;
        icon: string | Item.TextureData;
        material: string | ToolAPI.ToolMaterial;
        inCreative?: boolean;
        category?: number;
        glint?: boolean;
        rarity?: number;
    }
    export function createTool(stringID: string, params: ToolDescription, toolData?: ToolParams): ItemTool;
    export {};
}
declare namespace IDConverter {
    type IDDataPair = {
        id: number;
        data: number;
    };
    export function registerOld(stringId: string, oldId: number, oldData: number): void;
    export function getStack(stringId: string, count?: number, data?: number, extra?: ItemExtraData): ItemStack;
    export function getIDData(stringId: string): IDDataPair;
    export function getID(stringId: string): number;
    export function getData(stringId: string): number;
    export {};
}
declare abstract class TileEntityBase implements TileEntity {
    constructor();
    x: number;
    y: number;
    z: number;
    readonly dimension: number;
    readonly blockID: number;
    readonly useNetworkItemContainer: boolean;
    remove: boolean;
    isLoaded: boolean;
    __initialized: boolean;
    data: {
        [key: string]: any;
    };
    defaultValues: {};
    client: {
        load?: () => void;
        unload?: () => void;
        tick?: () => void;
        events?: {
            [packetName: string]: (packetData: any, packetExtra: any) => void;
        };
        containerEvents?: {
            [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.TabbedWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
        };
    };
    events: {};
    containerEvents: {};
    container: ItemContainer;
    liquidStorage: LiquidRegistry.Storage;
    blockSource: BlockSource;
    networkData: SyncedNetworkData;
    networkEntity: NetworkEntity;
    /**
     * Interface for BlockSource of the TileEntity. Provides more functionality.
     */
    region: WorldRegion;
    private _runInit;
    created(): void;
    init(): void;
    load(): void;
    unload(): void;
    tick(): void;
    /**
     * Called when a TileEntity is created
     */
    onCreate(): void;
    /**
     * Called when a TileEntity is initialised in the world
     */
    onInit(): void;
    /**
     * Called when a chunk with TileEntity is loaded
     */
    onLoad(): void;
    /**
     * Called when a chunk with TileEntity is unloaded
     */
    onUnload(): void;
    /**
     * Called every tick and should be used for all the updates of the TileEntity
     */
    onTick(): void;
    clientLoad(): void;
    clientUnload(): void;
    clientTick(): void;
    onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void;
    getScreenName(player: number, coords: Callback.ItemUseCoordinates): string;
    getScreenByName(screenName: string): any;
    /**
     * Called when player uses some item on a TileEntity. Replaces "click" function.
     * @returns true if should prevent opening UI.
    */
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean;
    private _clickPrevented;
    /**
     * Prevents all actions on click
     */
    preventClick(): void;
    onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean;
    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void;
    redstone(params: {
        power: number;
        signal: number;
        onLoad: boolean;
    }): void;
    /**
     * Occurs when redstone signal on TileEntity block was updated. Replaces "redstone" function
     * @param signal signal power (0-15)
     */
    onRedstoneUpdate(signal: number): void;
    projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void;
    destroy(): boolean;
    selfDestroy(): void;
    requireMoreLiquid(liquid: string, amount: number): void;
    sendPacket: (name: string, data: object) => {};
    sendResponse: (packetName: string, someData: object) => {};
    updateLiquidScale(scale: string, liquid: string): void;
    setLiquidScale(container: any, window: any, content: any, data: {
        scale: string;
        liquid: string;
        amount: number;
    }): void;
}
/**
 * Registry for liquid storage items. Compatible with LiquidRegistry.
 */
declare namespace LiquidItemRegistry {
    /**
     * @amount liquid amount able to extract
     */
    type EmptyData = {
        id: number;
        data: number;
        liquid: string;
        amount: number;
        storage?: number;
    };
    /**
     * @amount free liquid amount
     */
    type FullData = {
        id: number;
        data: number;
        amount: number;
        storage?: number;
    };
    export let EmptyByFull: {};
    export let FullByEmpty: {};
    /**
     * Registers liquid storage item
     * @param liquid liquid name
     * @param emptyId empty item id
     * @param fullId id of item with luquid
     * @param storage capacity of liquid in mB
     */
    export function registerItem(liquid: string, emptyId: number, fullId: number, storage: number): void;
    export function getItemLiquid(id: number, data: number): string;
    export function getEmptyItem(id: number, data: number): EmptyData;
    export function getFullItem(id: number, data: number, liquid: string): FullData;
    export {};
}
declare namespace BlockEngine {
    class LiquidTank {
        tileEntity: TileEntity;
        readonly name: string;
        limit: number;
        liquids: object;
        data: {
            liquid: string;
            amount: number;
        };
        constructor(tileEntity: TileEntity, name: string, limit: number, liquids?: string[]);
        setParent(tileEntity: TileEntity): void;
        getLiquidStored(): string;
        getLimit(): number;
        isValidLiquid(liquid: string): boolean;
        setValidLiquids(liquids: string[]): void;
        getAmount(liquid?: string): number;
        setAmount(liquid: string, amount: number): void;
        getRelativeAmount(): number;
        addLiquid(liquid: string, amount: number): number;
        getLiquid(amount: number): number;
        getLiquid(liquid: string, amount: number): number;
        isFull(): boolean;
        isEmpty(): boolean;
        addLiquidToItem(inputSlot: ItemContainerSlot, outputSlot: ItemContainerSlot): boolean;
        getLiquidFromItem(inputSlot: ItemContainerSlot, outputSlot: ItemContainerSlot): boolean;
        updateUiScale(scale: string): void;
    }
}
