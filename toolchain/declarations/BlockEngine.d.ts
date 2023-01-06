declare namespace BlockEngine {
    /**
     * @returns game version as array
     */
    function getGameVersion(): number[];
    /**
     * @returns main game version number
     */
    function getMainGameVersion(): number;
    /**
     * Sends packet with message which will be translated by the client.
     * @param client receiver client
     * @param texts array of strings which will be translated and combined in one message.
     */
    function sendUnlocalizedMessage(client: NetworkClient, ...texts: string[]): void;
}
declare namespace BlockEngine {
    namespace Decorators {
        /** Client side method decorator for TileEntity */
        function ClientSide(target: TileEntityBase, propertyName: string): void;
        /** Adds method as network event in TileEntity */
        function NetworkEvent(side: Side): (target: TileEntityBase, propertyName: string) => void;
        /** Adds method as container event in TileEntity */
        function ContainerEvent(side: Side): (target: TileEntityBase, propertyName: string) => void;
    }
}
declare enum Side {
    Client = 0,
    Server = 1
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
declare enum MiningLevel {
    STONE = 1,
    IRON = 2,
    DIAMOND = 3,
    OBSIDIAN = 4
}
/**
 * Class which represents three-dimensional vector
 * and basic operations with it.
 */
declare class Vector3 implements Vector {
    static readonly DOWN: Vector3;
    static readonly UP: Vector3;
    static readonly NORTH: Vector3;
    static readonly SOUTH: Vector3;
    static readonly EAST: Vector3;
    static readonly WEST: Vector3;
    /**
     * @param side block side
     * @returns direction vector for specified side
     */
    static getDirection(side: number): Vector3;
    /** X coord of the vector */
    x: number;
    /** Y coord of the vector */
    y: number;
    /** Z coord of the vector */
    z: number;
    constructor(vx: number, vy: number, vz: number);
    constructor(vector: Vector);
    /**
     * Copies coords to a new vector.
     * @returns vector copy.
     */
    copy(): Vector3;
    /**
     * Copies coords to specified vector.
     * @param dst destination vector to set values.
     * @returns destination vector.
     */
    copy(dst: Vector3): Vector3;
    /**
     * Sets vector coords.
     */
    set(vx: number, vy: number, vz: number): Vector3;
    set(vector: Vector): Vector3;
    /**
     * Adds vector.
     * @returns result vector.
     */
    add(vx: number, vy: number, vz: number): Vector3;
    add(vector: Vector): Vector3;
    /**
     * Adds vector scaled by factor.
     * @param vector vector to add.
     * @param scale scale factor
     * @returns result vector.
     */
    addScaled(vector: Vector, scale: number): Vector3;
    /**
     * Substracts vector.
     * @returns result vector.
     */
    sub(vx: number, vy: number, vz: number): Vector3;
    sub(vector: Vector): Vector3;
    /**
     * Calculates cross product of vectors.
     * @returns result vector.
     */
    cross(vx: number, vy: number, vz: number): Vector3;
    cross(vector: Vector): Vector3;
    /**
     * @returns dot product of vectors.
     */
    dot(vx: number, vy: number, vz: number): number;
    dot(vector: any): number;
    /**
     * Normalizes vector.
     * @returns normalized vector.
     */
    normalize(): Vector3;
    /**
     * @returns vector length squared
     */
    lengthSquared(): number;
    /**
     * @returns vector length.
     */
    length(): number;
    /**
     * Multiplies vector coords by -1.
     * @returns opposite vector.
     */
    negate(): Vector3;
    /**
     * Calculates squared distance to another point.
     * @param vx x coord
     * @param vy y coord
     * @param vz z coord
     * @returns squared distance
     */
    distanceSquared(vx: number, vy: number, vz: number): number;
    /**
     * Calculates squared distance to another point.
     * @param coords coords of second point
     * @returns squared distance
     */
    distanceSquared(coords: Vector): number;
    /**
     * Calculates distance to another point.
     * @param vx x coord
     * @param vy y coord
     * @param vz z coord
     * @returns distance
     */
    distance(vx: number, vy: number, vz: number): number;
    /**
     * Calculates distance to another point.
     * @param coords coords of second point
     * @returns distance
     */
    distance(coords: Vector): number;
    /**
     * Scales vector coords by factor.
     * @param factor scaling factor
     * @returns scaled vector
     */
    scale(factor: number): Vector3;
    /**
     * Scales vector length to specified value.
     * @param len target length
     * @returns scaled vector
     */
    scaleTo(len: number): Vector3;
    toString(): string;
}
/**
 * Class to work with world based on `BlockSource`
 */
declare class WorldRegion {
    readonly blockSource: BlockSource;
    private readonly isDeprecated;
    constructor(blockSource: BlockSource);
    /**
     * @returns interface to given dimension
     * (null if given dimension is not loaded and this interface
     * was not created yet).
     */
    static getForDimension(dimension: number): Nullable<WorldRegion>;
    /**
     * @returns interface to the dimension where the given entity is
     * (null if given entity does not exist or the dimension is not loaded
     * and interface was not created).
     */
    static getForActor(entityUid: number): Nullable<WorldRegion>;
    /**
     * @returns `WorldRegion` for world generation callback.
     */
    static getCurrentWorldGenRegion(): Nullable<WorldRegion>;
    /**
     * @returns the dimension id to which the following object belongs.
     */
    getDimension(): number;
    /**
     * @returns BlockState object of the block at coords
     */
    getBlock(coords: Vector): BlockState;
    getBlock(x: number, y: number, z: number): BlockState;
    /**
     * @returns block's id at coords.
     */
    getBlockId(coords: Vector): number;
    getBlockId(x: number, y: number, z: number): number;
    /**
     * @returns block's data at coords.
     */
    getBlockData(coords: Vector): number;
    getBlockData(x: number, y: number, z: number): number;
    /**
     * Sets block on coords.
     */
    setBlock(coords: Vector, state: BlockState | Tile): void;
    setBlock(coords: Vector, id: number, data?: number): void;
    setBlock(x: number, y: number, z: number, state: BlockState | Tile): void;
    setBlock(x: number, y: number, z: number, id: number, data?: number): void;
    /**
     * Doesn't support Legacy version.
     * @returns [[BlockState]] object of the extra block on given coords
     */
    getExtraBlock(coords: Vector): BlockState;
    getExtraBlock(x: number, y: number, z: number): BlockState;
    /**
     * Sets extra block (for example, water inside another blocks) on given coords by given id and data.
     * Doesn't support Legacy version.
     */
    setExtraBlock(coords: Vector, state: BlockState): void;
    setExtraBlock(coords: Vector, id: number, data?: number): void;
    setExtraBlock(x: number, y: number, z: number, id: number, data?: number): void;
    setExtraBlock(x: number, y: number, z: number, state: BlockState): void;
    /**
     * Destroys block on coords producing appropriate drop and particles.
     * @param coords coords of the block
     * @param drop whether to provide drop for the block or not
     * @param player player entity if the block was destroyed by player
     */
    destroyBlock(coords: Vector, drop?: boolean, player?: number): void;
    destroyBlock(x: number, y: number, z: number, drop?: boolean, player?: number): void;
    /**
     * Destroys block on coords by entity using specified item.
     * Partially reverse compatible with Legacy version (doesn't support `item` argument).
     * @param coords coords of the block
     * @param allowDrop whether to provide drop for the block or not
     * @param entity Entity id or -1 id if entity is not specified
     * @param item Tool which broke block
     */
    breakBlock(coords: Vector, allowDrop: boolean, entity: number, item: ItemInstance): void;
    breakBlock(x: number, y: number, z: number, allowDrop: boolean, entity: number, item: ItemInstance): void;
    /**
     * Same as breakBlock, but returns object containing drop and experince.
     * Partially reverse compatible with Legacy version (doesn't return experience).
     * @param coords coords of the block
     * @param entity Entity id or -1 id if entity is not specified
     * @param item Tool which broke block
     */
    breakBlockForResult(coords: Vector, entity: number, item: ItemInstance): {
        items: ItemInstance[];
        experience: number;
    };
    breakBlockForResult(x: number, y: number, z: number, entity: number, item: ItemInstance): {
        items: ItemInstance[];
        experience: number;
    };
    /**
     * @returns interface to the vanilla TileEntity (chest, furnace, etc.) on the coords.
     */
    getNativeTileEntity(coords: Vector): NativeTileEntity;
    getNativeTileEntity(x: number, y: number, z: number): NativeTileEntity;
    /**
     * @returns TileEntity located on the specified coordinates if it is initialized.
     */
    getTileEntity(coords: Vector): TileEntity;
    getTileEntity(x: number, y: number, z: number): TileEntity;
    /**
     * If the block on the specified coordinates is a TileEntity block and is
     * not initialized, initializes it and returns created TileEntity object.
     * @returns TileEntity if one was created, null otherwise.
     */
    addTileEntity(coords: Vector): TileEntity;
    addTileEntity(x: number, y: number, z: number): TileEntity;
    /**
     * If the block on the specified coordinates is a TileEntity, destroys
     * it, dropping its container.
     * @returns true if the TileEntity was destroyed successfully, false
     * otherwise.
     */
    removeTileEntity(coords: Vector): boolean;
    removeTileEntity(x: number, y: number, z: number): boolean;
    /**
     * @returns if the block on the specified coordinates is a `TileEntity`, returns
     * its container, if the block is a `NativeTileEntity`, returns its instance, if
     * none of above, returns null.
     */
    getContainer(coords: Vector): NativeTileEntity | UI.Container | ItemContainer;
    getContainer(x: number, y: number, z: number): NativeTileEntity | UI.Container | ItemContainer;
    /**
     * Causes an explosion on coords.
     * @param power defines radius of the explosion and what blocks it can destroy
     * @param fire if true, puts the crater on fire
     */
    explode(coords: Vector, power: number, fire?: boolean): void;
    explode(x: number, y: any, z: any, power: number, fire?: boolean): void;
    /**
     * @returns biome id at X and Z coord.
     */
    getBiome(x: number, z: number): number;
    /**
     * Sets biome id by coords.
     * @param biomeID - id of the biome to set
     */
    setBiome(x: number, z: number, biomeID: number): void;
    /**
     * @returns temperature of the biome on coords.
     */
    getBiomeTemperatureAt(coords: Vector): number;
    getBiomeTemperatureAt(x: number, y: number, z: number): number;
    /**
     * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns true if chunk is loaded, false otherwise.
     */
    isChunkLoaded(chunkX: number, chunkZ: number): boolean;
    /**
     * @param x X coord of the position
     * @param z Z coord of the position
     * @returns true if chunk on the position is loaded, false otherwise.
     */
    isChunkLoadedAt(x: number, z: number): boolean;
    /**
     * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns the loading state of the chunk by chunk coords.
     */
    getChunkState(chunkX: number, chunkZ: number): number;
    /**
     * @param x X coord of the position
     * @param z Z coord of the position
     * @returns the loading state of the chunk by coords.
     */
    getChunkStateAt(x: number, z: number): number;
    /**
     * @returns light level on the specified coordinates, from 0 to 15.
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
     * @param coords coords of the place where item will be dropped
     * @param item item to drop
     * @returns drop entity id
     */
    dropItem(coords: Vector, item: ItemInstance): number;
    dropItem(coords: Vector, id: number, count?: number, data?: number, extra?: ItemExtraData): number;
    dropItem(x: number, y: number, z: number, item: ItemInstance): number;
    dropItem(x: number, y: number, z: number, id: number, count?: number, data?: number, extra?: ItemExtraData): number;
    /**
     * Creates dropped item at the block center and returns entity id
     * @param coords coords of the block where item will be dropped
     * @param item item to drop
     * @returns drop entity id
     */
    dropAtBlock(coords: Vector, item: ItemInstance): number;
    dropAtBlock(coords: Vector, id: number, count: number, data: number, extra?: ItemExtraData): number;
    dropAtBlock(x: number, y: number, z: number, item: ItemInstance): number;
    dropAtBlock(x: number, y: number, z: number, id: number, count: number, data: number, extra?: ItemExtraData): number;
    /**
     * Spawns entity of given type on coords.
     * @param type entity numeric or string type
     */
    spawnEntity(x: number, y: number, z: number, type: number | string): number;
    /**
     * Spawns entity of given type on coords with specified spawn event.
     * @param namespace namespace of the entity type: 'minecraft' or from add-on.
     * @param type entity type name
     * @param spawnEvent built-in event for entity spawn. Use 'minecraft:entity_born' to spawn baby mob.
     */
    spawnEntity(x: number, y: number, z: number, namespace: string, type: string, spawnEvent: string): number;
    /**
     * Spawns experience orbs on coords.
     * @param amount experience amount
     */
    spawnExpOrbs(coords: Vector, amount: number): void;
    spawnExpOrbs(x: any, y: number, z: number, amount: number): void;
    /**
     * @returns the list of entity IDs in given box,
     * that are equal to the given type, if blacklist value is false,
     * and all except the entities of the given type, if blacklist value is true.
     */
    listEntitiesInAABB(pos1: Vector, pos2: Vector, type?: number, blacklist?: boolean): number[];
    listEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type?: number, blacklist?: boolean): number[];
    /**
     * Plays standard Minecraft sound on the specified coordinates.
     * @param name sound name
     * @param volume sound volume from 0 to 1. Default is 1.
     * @param pitch sound pitch, from 0 to 1. Default is 1.
     */
    playSound(x: number, y: number, z: number, name: string, volume?: number, pitch?: number): void;
    playSound(coords: Vector, name: string, volume?: number, pitch?: number): void;
    /**
     * Plays standard Minecraft sound from the specified entity.
     * @param ent entity id
     * @param name sound name
     * @param volume sound volume from 0 to 1. Default is 1.
     * @param pitch sound pitch, from 0 to 1. Default is 1.
     */
    playSoundAtEntity(ent: number, name: string, volume?: number, pitch?: number): void;
    /**
     * Sends network packet for players within a radius from specified coords.
     * @param coords coordinates from which players will be searched
     * @param radius radius within which players will receive packet
     * @param packetName name of the packet to send
     * @param data packet data object
     */
    sendPacketInRadius(coords: Vector, radius: number, packetName: string, data: object): void;
}
/**
 * Class to manipulate player based on `PlayerActor`.
 * Due to limitations of underlying PlayerActor class this class
 * can be used only during 1 server tick!
 */
declare class PlayerEntity {
    readonly actor: PlayerActor;
    private readonly playerUid;
    /**
     * Creates new instance of `PlayerEntity`.
     * @param playerUid player's numeric entity id
     */
    constructor(playerUid: number);
    /**
     * @returns player's unique numeric entity id.
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
     * Adds item to player's inventory. Drops surplus items near player.
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
     * Sets item in player's hand.
     */
    setCarriedItem(item: ItemInstance): void;
    setCarriedItem(id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * Decreases carried item count by specified number.
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
    getItemUseDuration(): number;
    getItemUseIntervalProgress(): number;
    getItemUseStartupProgress(): number;
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
/**
 * Module for creating block models.
 */
declare namespace BlockModeler {
    /**
     * Array of 6 coordinates representing start and end point of box.
     */
    type BoxVertexes = [number, number, number, number, number, number];
    /**
     * @returns box vertexes with specified rotation
     * @param box array of box vertexes
     * @rotation block rotation
     */
    function getRotatedBoxVertexes(box: BoxVertexes, rotation: number): BoxVertexes;
    /**
     * Sets stairs render model and shape to block.
     * @param id block numeric id
     */
    function setStairsRenderModel(id: number): void;
    /**
     * Sets hand and ui model for the block.
     * @param blockID block numeric id
     * @param model block model
     * @param data block data (0 by default)
     */
    function setInventoryModel(blockID: number, model: RenderMesh | ICRender.Model | BlockRenderer.Model, data?: number): void;
}
/**
 * Object representing common block properties.
 */
interface BlockType {
    /**
     * Block type to inherit properties
     */
    extends?: string;
    /**
     * Vanilla block ID to inherit some of the properties. Default is 0
     */
    baseBlock?: number;
    /**
     * Block material constant. Default is 3
     */
    material?: number;
    /**
     * If true, the block is not transparent. Default is false
     */
    solid?: boolean;
    /**
     * If true, all block faces are rendered, otherwise back faces are not
     * rendered (for optimization purposes). Default is false
     */
    renderAllFaces?: boolean;
    /**
     * Sets render type of the block. Default is 0 (full block), use other
     * values to change block's shape
     */
    renderType?: number;
    /**
     * Specifies the layer that is used to render the block. Default is 4
     */
    renderLayer?: number;
    /**
     * If non-zero value is used, the block emits light of that value.
     * Default is 0, use values from 1 to 15 to set light level
     */
    lightLevel?: number;
    /**
     * Specifies how opaque the block is. Default is 0 (transparent), use values
     * from 1 to 15 to make the block opaque
     */
    lightOpacity?: number;
    /**
     * Specifies how block resists to the explosions. Default value is 3
     */
    explosionResistance?: number;
    /**
     * Specifies how player walks on this block. The higher the friction is,
     * the more difficult it is to change speed and direction. Default value
     * is 0.6000000238418579
     */
    friction?: number;
    /**
     * Specifies the time required to destroy the block, in ticks
     */
    destroyTime?: number;
    /**
     * If non-zero value is used, the shadows will be rendered on the block.
     * Default is 0, allows float values from 0 to 1
     */
    translucency?: number;
    /**
     * Block color when displayed on the vanilla maps
     */
    mapColor?: number;
    /**
     * Makes block use biome color source when displayed on the vanilla maps
     */
    colorSource?: Block.ColorSource;
    /**
     * Specifies sounds of the block
     */
    sound?: Block.Sound;
}
/**
 * Block functions
 */
interface BlockBehavior extends BlockItemBehavior {
    /**
     * Method used to get drop from the block
     * @param coords block coords
     * @param block block id and data
     * @param diggingLevel tool mining level
     * @param enchant tool enchant data
     * @param item item instance
     * @param region BlockSource object
     * @returns drop items array
     */
    getDrop?(coords: Callback.ItemUseCoordinates, block: Tile, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];
    /**
     * Method called when block is destroyed by player
     * @param coords block coords
     * @param block block id and data
     * @param region BlockSource object
     * @param player player uid
     */
    onDestroy?(coords: Vector, block: Tile, region: BlockSource, player: number): void;
    /**
     * Method called when the block is destroyed by explosion or environment.
     * @param coords block coords
     * @param block block id and data
     * @param region BlockSource object
     */
    onBreak?(coords: Vector, block: Tile, region: BlockSource): void;
    /**
     * Method used to determine where block is placed in the world
     * @param coords click position in the world
     * @param item item in the player hand
     * @param block block that was touched
     * @param player player uid
     * @param region BlockSource object
     * @returns coordinates where to actually place the block, or void for
     * default placement
     */
    onPlace?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector | void;
    /**
     * Method called on neighbour blocks updates
     * @param coords coords of the block
     * @param block block id and data
     * @param changedCoords coords of the neighbour block that was changed
     * @param region BlockSource object
     */
    onNeighbourChange?(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void;
    /**
     * Method called on entity being inside the block. Can be used to create portals.
     * @param coords coords of the block
     * @param block block id and data
     * @param entity entity uid
     */
    onEntityInside?(coords: Vector, block: Tile, entity: number): void;
    /**
     * Method called on entity step on the block.
     * @param coords coords of the block
     * @param block block id and data
     * @param entity entity uid
     */
    onEntityStepOn?(coords: Vector, block: Tile, entity: number): void;
    /**
     * Method which enables random tick callback for the block and called on it.
     * @param x x coord of the block
     * @param y y coord of the block
     * @param z z coord of the block
     * @param block block id and data
     * @param region BlockSource object
     */
    onRandomTick?(x: number, y: number, z: number, block: Tile, region: BlockSource): void;
    /**
     * Method which enables animation update callback for the block and called on it.
     * Occurs more often then random tick callback and only if the block is not far away from player.
     * @param x x coord of the block
     * @param y y coord of the block
     * @param z z coord of the block
     * @param id block id
     * @param data block data
     */
    onAnimateTick?(x: number, y: number, z: number, id: number, data: number): void;
    /**
     * Method called when player clicks on the block.
     * @param coords coords of the block
     * @param item item in player hand
     * @param block block id and data
     * @param player player uid
     */
    onClick?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
}
/**
 * Base class for block
 */
declare class BlockBase implements BlockBehavior {
    /** Block string id */
    readonly stringID: string;
    /** Block numeric id */
    readonly id: number;
    /** Item category */
    category: number;
    /** Array of block variations */
    variations: Array<Block.BlockVariation>;
    /** Block properties */
    blockType: BlockType;
    /** Shapes of block variations */
    shapes: {
        [key: number]: BlockModeler.BoxVertexes;
    };
    /** Flag that defines whether block for this instance was defined or not. */
    isDefined: boolean;
    /** Block material */
    blockMaterial: string;
    /** Block mining level */
    miningLevel: number;
    constructor(stringID: string, blockType?: BlockType | string);
    /**
     * Adds variation for the block.
     * @param name item name
     * @param texture block texture
     * @param inCreative true if should be added to creative inventory
     */
    addVariation(name: string, texture: [string, number][], inCreative?: boolean): void;
    /**
     * Registers block in game.
     */
    createBlock(): void;
    getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];
    onBreak(coords: Vector, block: Tile, region: BlockSource): void;
    /**
     * Sets destroy time for the block.
     * @param destroyTime block destroy time
     */
    setDestroyTime(destroyTime: number): void;
    /**
     * Registers block material and digging level. If you are registering
     * block with 'stone' material ensure that its block type has baseBlock
     * id 1 to be correctly destroyed by pickaxes.
     * @param material material name
     * @param level block digging level
     */
    setBlockMaterial(material: string, level?: number): void;
    /**
     * Sets block box shape.
     * @params x1, y1, z1 position of block lower corner (0, 0, 0 for solid block)
     * @params x2, y2, z2 position of block upper conner (1, 1, 1 for solid block)
     * @param data sets shape for one block variation if specified and for all variations otherwise
     */
    setShape(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, data?: number): void;
    /**
     * Sets the block type of another block, which allows to inherit some of its properties.
     * @param baseBlock id of the block to inherit type
     */
    setBaseBlock(baseBlock: number): void;
    /**
     * Sets block to be transparent or opaque.
     * @param isSolid if true, sets block to be opaque.
     */
    setSolid(isSolid: boolean): void;
    /**
     * Sets rendering of the block faces.
     * @param renderAllFaces If true, all block faces are rendered, otherwise back faces are not
     * rendered (for optimization purposes). Default is false
     */
    setRenderAllFaces(renderAllFaces: boolean): void;
    /**
     * Sets render type of the block.
     * @param renderType default is 0 (full block), use other values to change block's model
     */
    setRenderType(renderType: number): void;
    /**
     * Specifies the layer that is used to render the block.
     * @param renderLayer default is 4
     */
    setRenderLayer(renderLayer: number): void;
    /**
     * Sets level of the light emitted by the block.
     * @param lightLevel value from 0 (no light) to 15
     */
    setLightLevel(lightLevel: number): void;
    /**
     * Specifies how opaque block is.
     * @param lightOpacity Value from 0 to 15 which will be substracted
     * from the light level when the light passes through the block
     */
    setLightOpacity(lightOpacity: number): void;
    /**
     * Specifies how block resists to the explosions.
     * @param resistance integer value, default is 3
     */
    setExplosionResistance(resistance: number): void;
    /**
     * Sets block friction. It specifies how player walks on the block.
     * The higher the friction is, the more difficult it is to change speed
     * and direction.
     * @param friction float value, default is 0.6
     */
    setFriction(friction: number): void;
    /**
     * Specifies rendering of shadows on the block.
     * @param translucency float value from 0 (no shadows) to 1
     */
    setTranslucency(translucency: number): void;
    /**
     * Sets sound type of the block.
     * @param sound block sound type
     */
    setSoundType(sound: Block.Sound): void;
    /**
     * Sets block color when displayed on the vanilla maps.
     * @param color map color of the block
     */
    setMapColor(color: number): void;
    /**
     * Makes block use biome color when displayed on the vanilla maps.
     * @param color block color source
     */
    setBlockColorSource(colorSource: Block.ColorSource): void;
    /**
     * Sets item category.
     * @param category item category, should be integer from 1 to 4.
     */
    setCategory(category: number): void;
    /**
     * Sets item rarity.
     * @param rarity one of `EnumRarity` values
     */
    setRarity(rarity: number): void;
    /**
     * Registers TileEntity prototype for this block.
     * @param prototype TileEntity prototype
     */
    registerTileEntity(prototype: TileEntity.TileEntityPrototype): void;
}
declare class BlockRotative extends BlockBase {
    hasVerticalFacings: boolean;
    constructor(stringID: string, blockType?: string | BlockType, hasVerticalFacings?: boolean);
    addVariation(name: string, texture: [string, number][], inCreative?: boolean): void;
    createBlock(): void;
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector;
}
declare class BlockStairs extends BlockBase {
    constructor(stringID: string, defineData: Block.BlockVariation, blockType?: string | BlockType);
    createItemModel(): void;
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector;
}
declare class BlockSlab extends BlockBase {
    doubleSlabID: number;
    setDoubleSlab(blockID: number): void;
    createBlock(): void;
    getDrop(coords: Vector, block: Tile, level: number): ItemInstanceArray[];
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, blockSource: BlockSource): Vector | void;
}
declare class BlockDoubleSlab extends BlockBase {
    slabID: number;
    setSlab(blockID: number): void;
    getDrop(coords: Vector, block: Tile, level: number): ItemInstanceArray[];
}
/**
 * Module for advanced block definition.
 */
declare namespace BlockRegistry {
    /**
     * Creates new block using specified params.
     * @param stringID string id of the block.
     * @param defineData array containing all variations of the block. Each
     * variation corresponds to block data value, data values are assigned
     * according to variations order.
     * @param blockType BlockType object or block type name, if the type was previously registered.
     */
    function createBlock(stringID: string, defineData: Block.BlockVariation[], blockType?: string | BlockType): void;
    /**
     * Creates new block with horizontal or all sides rotation.
     * @param stringID string id of the block
     * @param defineData array containing all variations of the block. Supports 2 variations,
     * each occupying 6 data values for rotation.
     * @param blockType BlockType object or block type name, if the type was previously registered.
     * @param hasVerticalFacings true if the block has vertical facings, false otherwise.
     */
    function createBlockWithRotation(stringID: string, defineData: Block.BlockVariation[], blockType?: string | BlockType, hasVerticalFacings?: boolean): void;
    /**
     * Creates stairs using specified params
     * @param stringID string id of the block
     * @param defineData array containing one variation of the block (for similarity with other methods).
     * @param blockType BlockType object or block type name, if the type was previously registered.
     */
    function createStairs(stringID: string, defineData: Block.BlockVariation[], blockType?: string | BlockType): void;
    /**
     * Creates slabs and its double slabs using specified params
     * @param slabID string id of the
     * @param doubleSlabID string id of the double slab
     * @param defineData array containing all variations of the block. Each
     * variation corresponds to block data value, data values are assigned
     * according to variations order.
     * @param blockType BlockType object or block type name, if the type was previously registered.
     */
    function createSlabs(slabID: string, doubleSlabID: string, defineData: Block.BlockVariation[], blockType?: string | BlockType): void;
    /**
     * @param name block type name
     * @returns BlockType object by name
     */
    function getBlockType(name: string): Nullable<BlockType>;
    /**
     * Inherits default values from type specified in "extends" property.
     * @param type BlockType object
     */
    function extendBlockType(type: BlockType): void;
    /**
     * Registers block type in BlockEngine and as Block.SpecialType.
     * @param name block type name
     * @param type BlockType object
     * @param isNative if true doesn't create special type
     */
    function createBlockType(name: string, type: BlockType, isNative?: boolean): void;
    /**
     * Converts block type to special type.
     * @param properites BlockType object
     * @returns block special type
     */
    function convertBlockTypeToSpecialType(properites: BlockType): Block.SpecialType;
    /**
     * @param blockID block numeric or string id
     * @returns instance of block class if it exists
     */
    function getInstanceOf(blockID: string | number): Nullable<BlockBase>;
    /**
     * Registers instance of BlockBase class and creates block for it.
     * @param block instance of BlockBase class
     * @returns the same BlockBase instance with `isDefined` flag set to true
     */
    function registerBlock(block: BlockBase): BlockBase;
    /**
     * Registers all block functions.
     * @param blockID block numeric or string id
     * @param blockFuncs object containing block functions
     */
    function registerBlockFuncs(blockID: string | number, blockFuncs: BlockBehavior): void;
    /**
     * Sets destroy time for the block with specified id.
     * @param blockID block numeric or string id
     * @param time block destroy time
     */
    function setDestroyTime(blockID: string | number, time: number): void;
    /**
     * Sets the block type of another block, which allows to inherit some of its properties.
     * @param blockID block numeric or string id
     * @param baseBlock id of the block to inherit type
     */
    function setBaseBlock(blockID: string | number, baseBlock: number): void;
    /**
     * Sets block to be transparent or opaque.
     * @param blockID block numeric or string id
     * @param isSolid if true, sets block to be opaque.
     */
    function setSolid(blockID: string | number, isSolid: boolean): void;
    /**
     * Sets rendering of the block faces.
     * @param blockID block numeric or string id
     * @param renderAllFaces If true, all block faces are rendered, otherwise back faces are not
     * rendered (for optimization purposes). Default is false
     */
    function setRenderAllFaces(blockID: string | number, renderAllFaces: boolean): void;
    /**
     * Sets render type of the block.
     * @param blockID block numeric or string id
     * @param renderType default is 0 (full block), use other values to change block's model
     */
    function setRenderType(blockID: string | number, renderType: number): void;
    /**
     * Specifies the layer that is used to render the block.
     * @param blockID block numeric or string id
     * @param renderLayer default is 4
     */
    function setRenderLayer(blockID: string | number, renderLayer: number): void;
    /**
     * Sets level of the light emitted by the block.
     * @param blockID block numeric or string id
     * @param lightLevel value from 0 (no light) to 15
     */
    function setLightLevel(blockID: string | number, lightLevel: number): void;
    /**
     * Specifies how opaque block is.
     * @param blockID block numeric or string id
     * @param lightOpacity Value from 0 to 15 which will be substracted
     * from the light level when the light passes through the block
     */
    function setLightOpacity(blockID: string | number, lightOpacity: number): void;
    /**
     * Specifies how block resists to the explosions.
     * @param blockID block numeric or string id
     * @param resistance integer value, default is 3
     */
    function setExplosionResistance(blockID: string | number, resistance: number): void;
    /**
     * Sets block friction. It specifies how player walks on the block.
     * The higher the friction is, the more difficult it is to change speed
     * and direction.
     * @param blockID block numeric or string id
     * @param friction float value, default is 0.6
     */
    function setFriction(blockID: string | number, friction: number): void;
    /**
     * Specifies rendering of shadows on the block.
     * @param blockID block numeric or string id
     * @param translucency float value from 0 (no shadows) to 1
     */
    function setTranslucency(blockID: string | number, translucency: number): void;
    /**
     * Sets sound type of the block.
     * @param blockID block numeric or string id
     * @param sound block sound type
     */
    function setSoundType(blockID: string | number, sound: Block.Sound): void;
    /**
     * Sets block color when displayed on the vanilla maps.
     * @param blockID block numeric or string id
     * @param color map color of the block
     */
    function setMapColor(blockID: string | number, color: number): void;
    /**
     * Makes block use biome color when displayed on the vanilla maps.
     * @param blockID block numeric or string id
     * @param color block color source
     */
    function setBlockColorSource(blockID: string | number, color: Block.ColorSource): void;
    /**
     * Registers block material and digging level. If you are registering
     * block with 'stone' material ensure that its block type has baseBlock
     * id 1 to be correctly destroyed by pickaxes.
     * @param blockID block numeric or string id
     * @param material material name
     * @param level block's digging level
     */
    function setBlockMaterial(blockID: string | number, material: string, level?: number): void;
    /**
     * @returns block side opposite to player rotation.
     * @param player player uid
     * @param hasVertical if true can return vertical sides as well
     */
    function getBlockRotation(player: number, hasVertical?: boolean): number;
    /**
     * @returns block place position for click coords in world.
     * @param coords click coords
     * @param block touched block
     * @param region BlockSource
     */
    function getPlacePosition(coords: Callback.ItemUseCoordinates, block: Tile, region: BlockSource): Vector;
    /**
     * Registers place function for block with rotation.
     * @param id block numeric or string id
     * @param hasVertical true if the block has vertical facings, false otherwise.
     */
    function setRotationFunction(id: string | number, hasVertical?: boolean, placeSound?: string): void;
    /**
     * Registers drop function for block.
     * @param blockID block numeric or string id
     * @param dropFunc drop function
     * @param level mining level
     */
    function registerDrop(blockID: string | number, dropFunc: Block.DropFunction, level?: number): void;
    /**
     * Sets mining level for block.
     * @param blockID block numeric or string id
     * @param level mining level
     */
    function setDestroyLevel(blockID: string | number, level: number): void;
    /**
     * Registers function called when block is destroyed by explosion.
     * @param blockID block numeric or string id
     * @param func function on explosion
     */
    function registerOnExplosionFunction(blockID: string | number, func: Block.PopResourcesFunction): void;
    /**
     * Registers block drop on explosion with 25% chance.
     */
    function addBlockDropOnExplosion(blockID: string | number): void;
    /** @deprecated */
    function getBlockDrop(x: number, y: number, z: number, block: Tile, level: number, item: ItemInstance, region?: BlockSource): ItemInstanceArray[];
}
/**
 * Common functions for blocks and items
 */
interface BlockItemBehavior {
    /**
      * Method to get displayed item name.
      * @param item item stack information
      * @param translation translated item name
      * @param name original item name
      * @returns new name that will be displayed
      */
    onNameOverride?(item: ItemInstance, translation: string, name: string): string;
    /**
     * Method called when player clicks on block with the item.
     * @param coords object of touch coordinates with side information and relative coordinates set.
     * @param item item that was in the player's hand when he touched the block
     * @param block block that was touched
     * @param player player entity uID
     */
    onItemUse?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
    /**
      * Method called when the item was dispensed.
      * @param coords full coords object, where the main coords are the position of the dispenser block,
      * `relative` ones are the position of the block to which the dispenser is pointed,
      * and `vec` are the coords for the item to be dropped at
      * @param item item that was dispensed
      * @param region BlockSource object
      * @param slot numeric id of the slot from which the item was dispensed
      */
    onDispense?(coords: Callback.ItemUseCoordinates, item: ItemStack, region: WorldRegion, slot: number): void;
}
/**
 * Item functions
 */
interface ItemBehavior extends BlockItemBehavior {
    /**
     * Method to override texture for the item icon.
     * @param item item stack information.
     * @param isModUi whether icon override is working in mod ui or in vanilla one
     * @returns texture data which will be used for the item icon.
     */
    onIconOverride?(item: ItemInstance, isModUi: boolean): Item.TextureData;
    /**
     * Method called when player uses item in the air.
     * @param item item that was in the player's hand when the event occurred
     * @param player entity uid of the player that used item
     */
    onNoTargetUse?(item: ItemStack, player: number): void;
    /**
     * Method called when player doesn't complete using item that has
     * maximum use time.
     * @param item item that was in the player's hand when the event occurred
     * @param ticks amount of ticks left to the specified max use duration value
     * @param player entity uid of the player that used item
     */
    onUsingReleased?(item: ItemStack, ticks: number, player: number): void;
    /**
     * Method called when player completes using item that has
     * maximum use time.
     * @param item item that was in the player's hand when the event occurred
     * @param player entity uid of the player that used item
     */
    onUsingComplete?(item: ItemStack, player: number): void;
}
declare abstract class ItemBase {
    /** Item string id */
    readonly stringID: string;
    /** Item numeric id */
    readonly id: number;
    /** Item name */
    name: string;
    /** Item texture data */
    icon: {
        name: string;
        meta: number;
    };
    /**
     * Maximum stack size of the item
     */
    maxStack: number;
    /**
     * Maximum data value of the item
     */
    maxDamage: number;
    inCreative: boolean;
    /**
     * Native class used to set item properties
     */
    item: Item.NativeItem;
    constructor(stringID: string, name?: string, icon?: string | Item.TextureData);
    /**
     * Method that can be overrided to modify item name before item creation.
     * @param name item name passed to the constructor
     */
    protected setName(name: string): void;
    /**
     * Method that can be overrided to modify item textures before item creation.
     * @param texture texture name
     * @param index texture index
     */
    protected setIcon(texture: string, index?: number): void;
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
    /**
    * Sets properties for the item from JSON-like object. Uses vanilla mechanics.
    * @param props object containing properties
    */
    setProperties(props: object): void;
    /**
     * Sets item rarity.
     * @param rarity one of `EnumRarity` values
     */
    setRarity(rarity: number): void;
    addDefaultToCreative(): void;
}
declare class ItemCommon extends ItemBase {
    constructor(stringID: string, name?: string, icon?: string | Item.TextureData, inCreative?: boolean);
}
declare type FoodParams = {
    food?: number;
    useDuration?: number;
    saturation?: "poor" | "low" | "normal" | "good" | "max" | "supernatural";
    canAlwaysEat?: boolean;
    isMeat?: boolean;
    usingConvertsTo?: string;
    effects?: {
        name: string;
        duration: number;
        amplifier: number;
        chance: number;
    }[];
};
declare class ItemFood extends ItemCommon {
    constructor(stringID: string, name: string, icon: string | Item.TextureData, params: FoodParams, inCreative?: boolean);
    onFoodEaten(item: ItemInstance, food: number, saturation: number, player: number): void;
}
declare class ItemThrowable extends ItemBase {
    constructor(stringID: string, name?: string, icon?: string | Item.TextureData, inCreative?: boolean);
    onProjectileHit(projectile: number, item: ItemInstance, target: Callback.ProjectileHitTarget): void;
}
interface ArmorListeners {
    /**
     * This event is called when the damage is dealt to the player that has this armor put on.
     * @param params additional data about damage
     * @param params.attacker attacker entity or -1 if the damage was not caused by an entity
     * @param params.damage damage amount that was applied to the player
     * @param params.type damage type
     * @param item armor item instance
     * @param slot armor slot index (from 0 to 3).
     * @param player player entity uid
     * @returns the item instance to change armor item,
     * if nothing is returned, armor will be damaged by default.
     */
    onHurt?(params: {
        attacker: number;
        type: number;
        damage: number;
        bool1: boolean;
        bool2: boolean;
    }, item: ItemInstance, slot: number, player: number): ItemInstance | void;
    /**
     * This event is called when the damage is dealt to the player that has this armor put on.
     * @param item armor item instance
     * @param slot armor slot index (from 0 to 3).
     * @param player player entity uid
     * @returns the item instance to change armor item,
     * if nothing is returned, armor will not be changed.
     */
    onTick?(item: ItemInstance, slot: number, player: number): ItemInstance | void;
    /**
     * This event is called when player takes on this armor, or spawns with it.
     * @param item armor item instance
     * @param slot armor slot index (from 0 to 3).
     * @param player player entity uid
     */
    onTakeOn?(item: ItemInstance, slot: number, player: number): void;
    /**
     * This event is called when player takes off or changes this armor item.
     * @param item armor item instance
     * @param slot armor slot index (from 0 to 3).
     * @param player player entity uid
     */
    onTakeOff?(item: ItemInstance, slot: number, player: number): void;
}
declare type ArmorMaterial = {
    durabilityFactor: number;
    enchantability?: number;
    repairMaterial?: number;
};
declare type ArmorParams = {
    type: ArmorType;
    defence: number;
    knockbackResistance?: number;
    texture: string;
    material?: string | ArmorMaterial;
};
declare class ItemArmor extends ItemBase {
    private static maxDamageArray;
    /**
     * Object containing armor properties specified by its material.
     */
    armorMaterial: ArmorMaterial;
    /**
     * String type of armor.
     */
    armorType: ArmorType;
    /**
     * Defence value for armor piece.
     */
    defence: number;
    /**
     * Armor texture.
     */
    texture: string;
    constructor(stringID: string, name: string, icon: string | Item.TextureData, params: ArmorParams, inCreative?: boolean);
    /**
     * Method that can be overrided to modify armor texture before item creation.
     * @param texture armor texture path
     */
    protected setArmorTexture(texture: string): void;
    /**
     * Sets armor properties from armor material.
     * @param armorMaterial material name or object.
     */
    setMaterial(armorMaterial: string | ArmorMaterial): void;
    /**
     * Prevents armor from being damaged.
     */
    preventDamaging(): void;
    /**
     * Registers all armor functions from given object.
     * @param id armor item id
     * @param armorFuncs object that implements `ArmorListener` interface
     */
    static registerListeners(id: number, armorFuncs: ItemArmor | ArmorListeners): void;
}
/**
 * Object containing tool parameters and functions.
 */
interface ToolParams extends ToolAPI.ToolParams {
    /** Specifies how the player should hold the item. */
    handEquipped?: boolean;
    /** Enchantment type of the tool. */
    enchantType?: number;
    /** Array of block types which the tool can break. */
    blockTypes?: string[];
    /**
     * Function that is called when player touches a block with the tool.
     * @param coords object of touch coordinates with side information and relative coordinates set.
     * @param item item in the player's hand
     * @param block block that was touched
     * @param player player entity id
     */
    onItemUse?: (coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number) => void;
}
/**
 * Object used to describe tool material type.
 */
interface ToolMaterial extends ToolAPI.ToolMaterial {
    /**
     * Value which specifies chances of getting higher level enchant for the item.
     */
    enchantability?: number;
    /**
     * Id of the item that is used to repair tool in anvil.
     */
    repairMaterial?: number;
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
/**
 * Module for advanced item definition.
 */
declare namespace ItemRegistry {
    /**
     * @returns item type
     */
    export function getType(id: number): "block" | "item";
    /**
     * @param id block id
     * @returns true if a block identifier was given, false otherwise.
     */
    export function isBlock(id: number): boolean;
    /**
     * @param id item id
     * @returns true if an item identifier was given, false otherwise.
     */
    export function isItem(id: number): boolean;
    /**
     * @returns whether the item is an item from the original game.
     */
    export function isVanilla(id: number): boolean;
    /**
     * @returns item string id in the game (in snake_case format).
     */
    export function getVanillaStringID(id: number): string;
    /**
     * @returns instance of item class if the item was added by BlockEngine, null otherwise.
     */
    export function getInstanceOf(itemID: string | number): Nullable<ItemBase>;
    /**
     * @returns `EnumRarity` value for the item.
     */
    export function getRarity(itemID: number): number;
    /**
     * @returns chat color for rarity.
     * @param rarity one of `EnumRarity` values
     */
    export function getRarityColor(rarity: number): string;
    /**
     * @returns chat color for rare items.
     */
    export function getItemRarityColor(itemID: number): string;
    /**
     * Sets item rarity.
     * @param id item id
     * @param rarity one of `EnumRarity` values
     * @param preventNameOverride prevent registration of name override function
     */
    export function setRarity(id: string | number, rarity: number, preventNameOverride?: boolean): void;
    /**
     * Creates new armor material with specified parameters.
     * @param name new (or existing) material name
     * @param material material properties
     */
    export function addArmorMaterial(name: string, material: ArmorMaterial): void;
    /**
     * @returns armor material by name.
     */
    export function getArmorMaterial(name: string): ArmorMaterial;
    /**
     * Registers new tool material in ToolAPI. Some of the tool
     * materials are already registered:
     * *wood*, *stone*, *iron*, *golden* and *diamond*
     * @param name new (or existing) material name
     * @param material material properties
     */
    export function addToolMaterial(name: string, material: ToolMaterial): void;
    /**
     * @returns tool material by name registered in ToolAPI.
     */
    export function getToolMaterial(name: string): ToolMaterial;
    /**
     * Registers item instance and it's functions.
     * @param itemInstance item class instance
     * @returns item instance back
     */
    export function registerItem(itemInstance: ItemBase): ItemBase;
    /**
     * Registers all item functions from given object.
     * @param itemFuncs object which implements `ItemBehavior` interface
     */
    export function registerItemFuncs(itemID: string | number, itemFuncs: ItemBehavior): void;
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
    /**
     * Creates item from given description. Automatically generates item id
     * from given string id.
     * @param stringID item string id.
     * @param params item description
     * @returns item class instance
     */
    export function createItem(stringID: string, params: ItemDescription): ItemBase;
    interface FoodDescription extends FoodParams {
        name: string;
        icon: string | Item.TextureData;
        stack?: number;
        inCreative?: boolean;
        category?: number;
        glint?: boolean;
        rarity?: number;
    }
    export function createFood(stringID: string, params: FoodDescription): ItemFood;
    interface ArmorDescription extends ArmorParams {
        name: string;
        icon: string | Item.TextureData;
        inCreative?: boolean;
        category?: number;
        glint?: boolean;
        rarity?: number;
    }
    /**
     * Creates armor item from given description. Automatically generates item id
     * from given string id.
     * @param stringID item string id
     * @param params item and armor parameters
     * @returns item class instance
     */
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
    /**
     * Creates tool item and registers it in ToolAPI. Automatically generates item id
     * from given string id.
     * @param stringID item string id
     * @param params object with item parameters and tool material
     * @param toolData tool parameters and functions
     * @returns item class instance
     */
    export function createTool(stringID: string, params: ToolDescription, toolData?: ToolParams): ItemTool;
    export {};
}
/**
 * Class representing item stack in the inventory.
 */
declare class ItemStack implements ItemInstance {
    id: number;
    count: number;
    data: number;
    extra?: ItemExtraData;
    constructor();
    constructor(item: ItemInstance);
    constructor(id: number, count: number, data?: number, extra?: ItemExtraData);
    /**
     * @returns instance of item class if the item was added by BlockEngine, null otherwise.
     */
    getItemInstance(): Nullable<ItemBase>;
    /**
     * Creates a copy of current ItemStack object
     * @returns a created copy of the ItemStack
     */
    copy(): ItemStack;
    /**
     * @returns maximum stack size for the item
     */
    getMaxStack(): number;
    /**
     * @returns maximum damage value for the item
     */
    getMaxDamage(): number;
    /**
     * @returns true if all stack values are empty, false otherwise
     */
    isEmpty(): boolean;
    /**
     * Decreases stack count by specified value.
     * @param count amount to decrease
     */
    decrease(count: number): void;
    /**
     * Sets all stack values to 0.
     */
    clear(): void;
    /**
     * Applies damage to the item and destroys it if its max damage reached
     * @param damage amount to apply
     */
    applyDamage(damage: number): void;
    /**
     * @returns item's custom name
     */
    getCustomName(): string;
    /**
    * Sets item's custom name. Creates new ItemExtraData instance if
    * it doesn't exist.
    */
    setCustomName(name: string): void;
    /**
     * @returns true if the item is enchanted, false otherwise
     */
    isEnchanted(): boolean;
    /**
     * Adds a new enchantment to the item. Creates new ItemExtraData instance if
     * it doesn't exist.
     * @param id enchantment id, one of the Native.Enchantment constants
     * @param level enchantment level, generally between 1 and 5
     */
    addEnchant(id: number, level: number): void;
    /**
     * Removes enchantments by its id
     * @param id enchantment id, one of the Native.Enchantment constants
     */
    removeEnchant(id: number): void;
    /**
     * Removes all the enchantments of the item
     */
    removeAllEnchants(): void;
    /**
     * @param id enchantment id, one of the Native.Enchantment constants
     * @returns level of the specified enchantment
     */
    getEnchantLevel(id: number): number;
    /**
     * @returns all the enchantments of the item in the readable format
     */
    getEnchants(): {
        [key: number]: number;
    };
}
/**
 * Tool parameters for vanilla tool types.
 */
declare namespace ToolType {
    const SWORD: ToolParams;
    const SHOVEL: ToolParams;
    const PICKAXE: ToolParams;
    const AXE: ToolParams;
    const HOE: ToolParams;
    const SHEARS: ToolParams;
}
/**
 * Module to convert item ids depending on the game version.
 */
declare namespace IDConverter {
    type IDDataPair = {
        id: number;
        data: number;
    };
    /**
     * Registers old id and data for new string id.
     */
    export function registerOld(stringId: string, oldId: number, oldData: number): void;
    /**
     * Creates ItemStack instance by string id.
     * @param stringId new item string id
     * @param count item count
     * @param data item data
     * @param extra item extra data
     * @returns ItemStack instance
     */
    export function getStack(stringId: string, count?: number, data?: number, extra?: ItemExtraData): ItemStack;
    /**
     * @param stringId new item string id
     * @returns converted id data pair
     */
    export function getIDData(stringId: string): IDDataPair;
    /**
     * @param stringId new item string id
     * @returns converted numeric id
     */
    export function getID(stringId: string): number;
    /**
     * @param stringId new item string id
     * @returns converted data
     */
    export function getData(stringId: string): number;
    export {};
}
declare abstract class TileEntityBase implements TileEntity {
    constructor();
    __clientMethods: {
        [key: string]: boolean;
    };
    __networkEvents: {
        [key: string]: Side;
    };
    __containerEvents: {
        [key: string]: Side;
    };
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
        load: () => void;
        unload: () => void;
        tick: () => void;
        events: {
            [packetName: string]: (packetData: any, packetExtra: any) => void;
        };
        containerEvents: {
            [eventName: string]: (container: ItemContainer, window: UI.IWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
        };
    };
    events: {
        [packetName: string]: (packetData: any, packetExtra: any, connectedClient: NetworkClient) => void;
    };
    containerEvents: {
        [eventName: string]: (container: ItemContainer, window: UI.IWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
    };
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
    /** @deprecated */
    init(): void;
    /** @deprecated */
    load(): void;
    /** @deprecated */
    unload(): void;
    /** @deprecated */
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
    /**
     * Called when the client copy is created
     */
    clientLoad(): void;
    /**
     * Called on destroying the client copy
     */
    clientUnload(): void;
    /**
     * Called every tick on client thread
     */
    clientTick(): void;
    onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void;
    getScreenName(player: number, coords: Callback.ItemUseCoordinates): string;
    getScreenByName(screenName: string, container: ItemContainer): UI.IWindow;
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
    /** @deprecated */
    redstone(params: {
        power: number;
        signal: number;
        onLoad: boolean;
    }): void;
    /**
     * Occurs when redstone signal on TileEntity block was updated
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
 * Registry for liquid storage items. Compatible with LiquidRegistry and extends it
 * by adding items that can contain partial amounts of liquid.
 */
declare namespace LiquidItemRegistry {
    /**
     * Object that contains empty liquid storage item and stored liquid data.
     * @id item id
     * @data item data
     * @liquid liquid type
     * @amount liquid amount able to be extracted
     * @storage liquid storage of items registered by BlockEngine.
     */
    type EmptyData = {
        id: number;
        data: number;
        liquid: string;
        amount: number;
        storage?: number;
    };
    /**
     * Object that contains full item and free liquid capacity.
     * @id item id
     * @data item data
     * @liquid liquid type
     * @amount free liquid capacity
     * @storage liquid storage of items registered by BlockEngine.
     */
    type FullData = {
        id: number;
        data: number;
        amount: number;
        storage?: number;
    };
    export const EmptyByFull: {};
    export const FullByEmpty: {};
    /**
     * Registers liquid storage item.
     * @param liquid liquid name
     * @param emptyId empty item id
     * @param fullId id of item with luquid
     * @param storage capacity of liquid in mB
     */
    export function registerItem(liquid: string, emptyId: number, fullId: number, storage: number): void;
    /**
     * Return liquid type stored in item
     * @param id item id
     * @param data item data
     * @returns liquid type
     */
    export function getItemLiquid(id: number, data: number): string;
    /**
     * Returns empty item and stored liquid data for item that contains liquid,
     * null otherwise.
     * @param id item id
     * @param data item data
     * @returns object that contains empty item and stored liquid.
     */
    export function getEmptyItem(id: number, data: number): EmptyData;
    /**
     * Returns full item and free liquid capacity for item that can be filled with liquid,
     * null otherwise.
     * @param id item id
     * @param data item data
     * @param liquid liquid type
     * @returns object that contains full item and free liquid capacity
     */
    export function getFullItem(id: number, data: number, liquid: string): FullData;
    export {};
}
declare namespace BlockEngine {
    /**
     * Class to store and manipulate liquids in TileEntity.
     */
    class LiquidTank {
        /** Parent TileEntity instance */
        tileEntity: TileEntity;
        /** Liquid tank name */
        readonly name: string;
        /** Max liquid amount. */
        limit: number;
        /** Set of valid liquids */
        liquids: object;
        /** Liquid data stored in TileEntity data object. */
        data: {
            liquid: string;
            amount: number;
        };
        /**
         * Creates new instance of `LiquidTank` and binds it to TileEntity.
         * @param tileEntity TileEntity instance
         * @param name liquid tank name
         * @param limit max liquid amount
         * @param liquids types of valid liquids
         */
        constructor(tileEntity: TileEntity, name: string, limit: number, liquids?: string[]);
        /**
         * Binds liquid tank to TileEntity.
         * @param tileEntity TileEntity instance
         */
        setParent(tileEntity: TileEntity): void;
        /**
         * Gets type of liquid stored in tank.
         * @returns liquid type
         */
        getLiquidStored(): string;
        /**
         * Gets max amount of liquid in tank.
         * @returns amount of liquid
         */
        getLimit(): number;
        /**
         * @param liquid liquid type
         * @returns true if liquid can be stored in tank, false otherwise.
         */
        isValidLiquid(liquid: string): boolean;
        /**
         * Sets liquids that can be stored in tank.
         * @param liquids arrays of liquid types
         */
        setValidLiquids(liquids: string[]): void;
        /**
         * Gets amount of liquid in tank. If `liquid` parameter is set,
         * returns amount of the specified liquid.
         * @param liquid liquid type
         * @returns amount of liquid
         */
        getAmount(liquid?: string): number;
        /**
         * Sets liquid to tank.
         * @param liquid liquid type
         * @param amount amount of liquid
         */
        setAmount(liquid: string, amount: number): void;
        /**
         * Gets amount of liquid divided by max amount.
         * @returns scalar value from 0 to 1
         */
        getRelativeAmount(): number;
        /**
         * Adds liquid to tank.
         * @param liquid liquid type
         * @param amount amount of liquid to add
         * @returns amount of liquid that wasn't added
         */
        addLiquid(liquid: string, amount: number): number;
        /**
         * Gets liquid from tank.
         * @param amount max amount of liquid to get
         * @returns amount of got liquid
         */
        getLiquid(amount: number): number;
        /**
         * Gets liquid from tank.
         * @param liquid liquid type
         * @param amount max amount of liquid to get
         * @returns amount of got liquid
         */
        getLiquid(liquid: string, amount: number): number;
        /**
         * @returns true if tank is full, false otherwise
         */
        isFull(): boolean;
        /**
         * @returns true if tank is empty, false otherwise
         */
        isEmpty(): boolean;
        /**
         * Tries to fill item with liquid from tank.
         * @param inputSlot slot for empty item
         * @param outputSlot slot for full item
         * @returns true if liquid was added, false otherwise.
         */
        addLiquidToItem(inputSlot: ItemContainerSlot, outputSlot: ItemContainerSlot): boolean;
        /**
         * Tries to fill tank with liquid from item.
         * @param inputSlot slot for full item
         * @param outputSlot slot for empty item
         * @returns true if liquid was extracted, false otherwise.
         */
        getLiquidFromItem(inputSlot: ItemContainerSlot, outputSlot: ItemContainerSlot): boolean;
        /**
         * Updates UI bar of liquid. Uses LiquidStorage method for legacy container
         * and container event from TileEntityBase for multiplayer container.
         * @param scale name of liquid bar
         */
        updateUiScale(scale: string): void;
    }
}
