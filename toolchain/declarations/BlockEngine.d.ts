declare class ItemStack implements ItemInstance {
    id: number;
    count: number;
    data: number;
    extra?: ItemExtraData;
    constructor();
    constructor(item: ItemInstance);
    constructor(id: number, count: number, data: number, extra?: ItemExtraData);
    getMaxStack(): number;
    getMaxDamage(): void;
    isEmpty(): boolean;
    decrease(count: number): void;
    clear(): void;
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
    static getForDimension(dimension: number): WorldRegion;
    /**
     * @returns interface to the dimension where the given entity is
     * (null if given entity does not exist or the dimension is not loaded
     * and interface was not created)
     */
    static getForActor(entityUid: number): WorldRegion;
    /**
     * @returns the dimension id to which the following object belongs
     */
    getDimension(): number;
    /**
     * @returns Tile object with id and data propeties of the block at coords
     */
    getBlock(coords: Vector): Tile;
    getBlock(x: number, y: number, z: number): Tile;
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
    setBlock(coords: Vector, id: number, data: number): number;
    setBlock(x: number, y: number, z: number, id: number, data: number): number;
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
     * @returns TileEntity located on the specified coordinates
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
    explode(x: number, y: number, z: number, power: number, fire?: boolean): void;
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
    getLightLevel(x: number, y: number, z: number): number;
    /**
     * @returns whether the sky can be seen from coords
     */
    canSeeSky(x: number, y: number, z: number): boolean;
    /**
     * @returns grass color on coords
     */
    getGrassColor(x: number, y: number, z: number): number;
    /**
     * Creates dropped item and returns entity id
     * @param x X coord of the place where item will be dropped
     * @param y Y coord of the place where item will be dropped
     * @param z Z coord of the place where item will be dropped
     * @param id id of the item to drop
     * @param count count of the item to drop
     * @param data data of the item to drop
     * @param extra extra of the item to drop
     * @returns drop entity id
     */
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
    fetchEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type: number, blacklist?: boolean): number[];
    /**
     * @returns the list of entity IDs in given box,
     * that are equal to the given type, if blacklist value is false,
     * and all except the entities of the given type, if blacklist value is true
     */
    listEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type: number, blacklist?: boolean): number[];
}
declare class BlockBase {
    nameID: string;
    id: number;
    variants: Array<Block.BlockVariation>;
    constructor(nameID: string);
    addVariant(name: string, texture: [string, number][], inCreative: any): void;
    create(blockType?: Block.SpecialType | string): void;
    setDestroyTime(destroyTime: number): this;
    setBlockMaterial(material: string, level: number): this;
    setShape(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, data?: number): this;
    registerTileEntity(prototype: any): void;
}
interface INameOverrideable {
    onNameOverride(item: ItemInstance, translation: string, name: string): string;
}
interface IIconOverrideable {
    onIconOverride(item: ItemInstance): Item.TextureData;
}
interface IUseable {
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void;
}
interface INoTargetUse {
    onUseNoTarget(item: ItemInstance, ticks: number): void;
}
interface IUsingReleased {
    onUsingReleased(item: ItemInstance, ticks: number): void;
}
interface IUsingComplete {
    onUsingComplete(item: ItemInstance): void;
}
interface IDispenceBehavior {
    onDispense(coords: Callback.ItemUseCoordinates, item: ItemInstance): void;
}
declare type ItemFuncs = INameOverrideable & IIconOverrideable & IUseable & INoTargetUse & IUsingReleased & IUsingComplete & IDispenceBehavior;
declare class ItemBasic {
    readonly nameID: string;
    readonly id: number;
    name: string;
    icon: {
        name: string;
        meta: number;
    };
    rarity: number;
    protected item: any;
    constructor(nameID: string, name?: string, icon?: string | Item.TextureData);
    setName(name: string): this;
    setIcon(texture: string, index?: number): this;
    createItem(inCreative?: boolean): this;
    setMaxDamage(maxDamage: number): this;
    setMaxStack(maxStack: number): this;
    setHandEquipped(enabled: boolean): this;
    setEnchantType(type: number, enchantability: number): this;
    setLiquidClip(): this;
    setGlint(enabled: boolean): this;
    allowInOffHand(): this;
    addRepairItem(itemID: number): this;
    setRarity(rarity: number): this;
    getRarityCode(rarity: number): string;
}
interface OnHurtListener {
    onHurt: (params: {
        attacker: number;
        damage: number;
        type: number;
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
    repairItem?: number;
};
declare type ArmorType = "helmet" | "chestplate" | "leggings" | "boots";
declare type ArmorParams = {
    type: ArmorType;
    defence: number;
    texture?: string;
    material?: string | ArmorMaterial;
};
declare class ItemArmor extends ItemBasic {
    private static maxDamageArray;
    armorMaterial: ArmorMaterial;
    armorType: ArmorType;
    defence: number;
    texture: string;
    constructor(nameID: string, name: string, icon: string | Item.TextureData, params: ArmorParams);
    createItem(inCreative?: boolean): this;
    setArmorTexture(texture: string): this;
    setMaterial(armorMaterial: string | ArmorMaterial): this;
    static registerListeners(id: number, armorFuncs: ItemArmor | OnHurtListener | OnTickListener | OnTakeOnListener | OnTakeOffListener): void;
}
declare namespace ItemRegistry {
    function addArmorMaterial(name: string, material: ArmorMaterial): void;
    function getArmorMaterial(name: string): ArmorMaterial;
    function register(itemInstance: ItemBasic | (ItemBasic & ItemFuncs)): void;
    function getInstanceOf(itemID: number): ItemBasic;
    function createItem(nameID: string, params: {
        name?: string;
        icon: string | Item.TextureData;
        maxStack?: number;
        inCreative?: boolean;
    }): ItemBasic;
    function createArmorItem(nameID: string, params: {
        name?: string;
        icon: string | Item.TextureData;
        type: ArmorType;
        defence: number;
        texture: string;
        material?: string | ArmorMaterial;
        inCreative?: boolean;
    }): ItemArmor;
}
declare abstract class TileEntityBase implements TileEntity {
    constructor();
    x: number;
    y: number;
    z: number;
    dimension: number;
    blockID: number;
    remove: boolean;
    isLoaded: boolean;
    private __initialized;
    useNetworkItemContainer: boolean;
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
}
declare enum Side {
    Client = 0,
    Server = 1
}
declare namespace BlockEngine {
    namespace Decorators {
        function ClientSide(): (target: TileEntityBase, propertyName: string) => void;
        function NetworkEvent(side: Side): (target: TileEntityBase, propertyName: string) => void;
        function ContainerEvent(side: Side): (target: TileEntityBase, propertyName: string) => void;
    }
}
