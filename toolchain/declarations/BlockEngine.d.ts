declare class ItemStack implements ItemInstance {
    id: number;
    count: number;
    data: number;
    extra?: ItemExtraData;
    constructor(id?: number, count?: number, data?: number, extra?: ItemExtraData);
}
declare class Vector {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
}
declare class WorldRegion {
    blockSource: BlockSource;
    constructor(blockSource: BlockSource);
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
     * Creates an explosion on coords
     * @param power defines how many blocks can the explosion destroy and what
     * blocks can or cannot be destroyed
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
    data: {
        [key: string]: any;
    };
    defaultValues: {};
    useNetworkItemContainer: boolean;
    container: ItemContainer;
    liquidStorage: any;
    remove: boolean;
    isLoaded: boolean;
    private __initialized;
    client?: {
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
    events?: {};
    containerEvents?: {};
    blockSource: BlockSource;
    networkData: SyncedNetworkData;
    networkEntity: NetworkEntity;
    created(): void;
    load(): void;
    unload(): void;
    init(): void;
    tick(): void;
    clientLoad(): void;
    clientUnload(): void;
    clientTick(): void;
    onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void;
    getScreenName(player: number, coords: Callback.ItemUseCoordinates): string;
    getScreenByName(screenName: string): any;
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean;
    private onItemClick;
    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void;
    redstone(params: {
        power: number;
        signal: number;
        onLoad: boolean;
    }): void;
    projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void;
    destroy(): boolean;
    selfDestroy(): void;
    requireMoreLiquid(liquid: string, amount: number): void;
    sendPacket(name: string, data: object): void;
    sendResponse(packetName: string, someData: object): void;
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
