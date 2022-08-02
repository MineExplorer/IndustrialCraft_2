declare const EntityGetYaw: any;
declare const EntityGetPitch: any;
declare namespace BlockEngine {
    function getGameVersion(): number[];
    function getMainGameVersion(): number;
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
    private isDeprecated;
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
    setBlock(coords: Vector, id: number, data?: number): void;
    setBlock(x: number, y: number, z: number, state: BlockState): void;
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
     * @param drop whether to provide drop for the block or not
     * @param player player entity if the block was destroyed by player
     */
    destroyBlock(coords: Vector, drop?: boolean, player?: number): void;
    destroyBlock(x: number, y: number, z: number, drop?: boolean, player?: number): void;
    /**
     * Destroys block on coords by entity using specified item.
     * Reverse compatible with Legacy version (doesn't support `item` argument).
     * @param x X coord of the block
     * @param y Y coord of the block
     * @param z Z coord of the block
     * @param allowDrop whether to provide drop for the block or not
     * @param entity Entity id or -1 id if entity is not specified
     * @param item Tool which broke block
     */
    breakBlock(coords: Vector, allowDrop: boolean, entity: number, item: ItemInstance): void;
    breakBlock(x: number, y: number, z: number, allowDrop: boolean, entity: number, item: ItemInstance): void;
    /**
     * Same as breakBlock, but returns object containing drop and experince.
     * Reverse compatible with Legacy version (doesn't return experience).
     * @param x X coord of the block
     * @param y Y coord of the block
     * @param z Z coord of the block
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
     * @returns drop entity id
     */
    dropItem(coords: Vector, item: ItemInstance): number;
    dropItem(coords: Vector, id: number, count?: number, data?: number, extra?: ItemExtraData): number;
    dropItem(x: number, y: number, z: number, item: ItemInstance): number;
    dropItem(x: number, y: number, z: number, id: number, count?: number, data?: number, extra?: ItemExtraData): number;
    /**
     * Creates dropped item at the block center and returns entity id
     * @param x X coord of the block where item will be dropped
     * @param y Y coord of the block where item will be dropped
     * @param z Z coord of the block where item will be dropped
     * @returns drop entity id
     */
    dropAtBlock(coords: Vector, item: ItemInstance): number;
    dropAtBlock(coords: Vector, id: number, count: number, data: number, extra?: ItemExtraData): number;
    dropAtBlock(x: number, y: number, z: number, item: ItemInstance): number;
    dropAtBlock(x: number, y: number, z: number, id: number, count: number, data: number, extra?: ItemExtraData): number;
    /**
     * Spawns entity of given numeric type on coords
     */
    spawnEntity(x: number, y: number, z: number, type: number | string): number;
    spawnEntity(x: number, y: number, z: number, namespace: string, type: string, init_data: string): number;
    /**
     * Spawns experience orbs on coords
     * @param amount experience amount
     */
    spawnExpOrbs(coords: Vector, amount: number): void;
    spawnExpOrbs(x: any, y: number, z: number, amount: number): void;
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
declare namespace BlockModeler {
    type BoxVertexes = [number, number, number, number, number, number];
    function getRotatedBoxVertexes(box: BoxVertexes, rotation: number): BoxVertexes;
    function setStairsRenderModel(id: number): void;
    function createStairsRenderModel(id: number, startData: number, boxes: BoxVertexes[]): void;
    function setInventoryModel(blockID: number, model: RenderMesh | ICRender.Model | BlockRenderer.Model, data?: number): void;
}
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
interface BlockBehavior {
    getDrop?(coords: Callback.ItemUseCoordinates, block: Tile, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];
    onDestroy?(coords: Vector, block: Tile, region: BlockSource, player: number): void;
    onBreak?(coords: Vector, block: Tile, region: BlockSource): void;
    onPlace?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector | void;
    onNeighbourChange?(coords: Vector, block: Tile, changeCoords: Vector, region: BlockSource): void;
    onEntityInside?(coords: Vector, block: Tile, entity: number): void;
    onEntityStepOn?(coords: Vector, block: Tile, entity: number): void;
    onRandomTick?(x: number, y: number, z: number, block: Tile, region: BlockSource): void;
    onAnimateTick?(x: number, y: number, z: number, id: number, data: number): void;
    onClick?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
}
declare class BlockBase implements BlockBehavior {
    readonly stringID: string;
    readonly id: number;
    category: number;
    variations: Array<Block.BlockVariation>;
    blockType: BlockType;
    shapes: {
        [key: number]: BlockModeler.BoxVertexes;
    };
    isDefined: boolean;
    blockMaterial: string;
    miningLevel: number;
    constructor(stringID: string, blockType?: BlockType | string);
    addVariation(name: string, texture: [string, number][], inCreative?: boolean): void;
    createBlock(): void;
    getDrop(coords: Vector, block: Tile, level: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[];
    onBreak(coords: Vector, block: Tile, region: BlockSource): void;
    setDestroyTime(destroyTime: number): void;
    setBlockMaterial(material: string, level?: number): void;
    /**
     * Sets block box shape
     * @param id block numeric id
     * @params x1, y1, z1 position of block lower corner (0, 0, 0 for solid block)
     * @params x2, y2, z2 position of block upper conner (1, 1, 1 for solid block)
     * @param data sets shape for one block variation if specified and for all variations otherwise
     */
    setShape(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, data?: number): void;
    /**
     * Sets the block type of another block, which allows to inherit some of its properties
     * @param baseBlock id of the block to inherit type
     */
    setBaseBlock(baseBlock: number): void;
    /**
     * Sets block to be transparent or opaque.
     * @param isSolid if true, sets block to be opaque.
     */
    setSolid(isSolid: boolean): void;
    /**
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
     * Sets block color when displayed on the vanilla maps
     * @param color map color of the block
     */
    setMapColor(color: number): void;
    /**
     * Makes block use biome color when displayed on the vanilla maps.
     * @param color block color source
     */
    setBlockColorSource(colorSource: Block.ColorSource): void;
    /**
     * Sets item creative category
     * @param category item category, should be integer from 1 to 4.
     */
    setCategory(category: number): void;
    setRarity(rarity: number): void;
    registerTileEntity(prototype: TileEntity.TileEntityPrototype): void;
}
declare class BlockRotative extends BlockBase {
    hasVerticalFacings: boolean;
    constructor(stringID: string, blockType?: string | Block.SpecialType, hasVerticalFacings?: boolean);
    addVariation(name: string, texture: [string, number][], inCreative?: boolean): void;
    createBlock(): void;
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector;
}
declare class BlockStairs extends BlockBase {
    constructor(stringID: string, defineData: Block.BlockVariation, blockType?: string | Block.SpecialType);
    createItemModel(): void;
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector;
}
declare const NativeBlock: any;
declare namespace BlockRegistry {
    function createBlock(stringID: string, defineData: Block.BlockVariation[], blockType?: string | BlockType): void;
    function createBlockWithRotation(stringID: string, defineData: Block.BlockVariation[], blockType?: string | Block.SpecialType, hasVerticalFacings?: boolean): void;
    function createStairs(stringID: string, defineData: Block.BlockVariation[], blockType?: string | Block.SpecialType): void;
    function getBlockType(name: string): Nullable<BlockType>;
    function extendBlockType(type: BlockType): void;
    function createBlockType(name: string, type: BlockType, isNative?: boolean): void;
    function convertBlockTypeToSpecialType(properites: BlockType): Block.SpecialType;
    /**
     * @returns instance of block class if it exists
     */
    function getInstanceOf(blockID: string | number): Nullable<BlockBase>;
    function registerBlock(block: BlockBase): BlockBase;
    function registerBlockFuncs(blockID: string | number, blockFuncs: BlockBehavior): void;
    /**
     * Sets destroy time for the block with specified id
     * @param time block destroy time
     */
    function setDestroyTime(blockID: string | number, time: number): void;
    /**
     * Sets the block type of another block, which allows to inherit some of its properties
     * @param baseBlock id of the block to inherit type
     */
    function setBaseBlock(blockID: string | number, baseBlock: number): void;
    /**
     * Sets block to be transparent or opaque.
     * @param isSolid if true, sets block to be opaque.
     */
    function setSolid(blockID: string | number, isSolid: boolean): void;
    /**
     * @param renderAllFaces If true, all block faces are rendered, otherwise back faces are not
     * rendered (for optimization purposes). Default is false
     */
    function setRenderAllFaces(blockID: string | number, renderAllFaces: boolean): void;
    /**
     * Sets render type of the block.
     * @param renderType default is 0 (full block), use other values to change block's model
     */
    function setRenderType(blockID: string | number, renderType: number): void;
    /**
     * Specifies the layer that is used to render the block.
     * @param renderLayer default is 4
     */
    function setRenderLayer(blockID: string | number, renderLayer: number): void;
    /**
     * Sets level of the light emitted by the block.
     * @param lightLevel value from 0 (no light) to 15
     */
    function setLightLevel(blockID: string | number, lightLevel: number): void;
    /**
     * Specifies how opaque block is.
     * @param lightOpacity Value from 0 to 15 which will be substracted
     * from the light level when the light passes through the block
     */
    function setLightOpacity(blockID: string | number, lightOpacity: number): void;
    /**
     * Specifies how block resists to the explosions.
     * @param resistance integer value, default is 3
     */
    function setExplosionResistance(blockID: string | number, resistance: number): void;
    /**
     * Sets block friction. It specifies how player walks on the block.
     * The higher the friction is, the more difficult it is to change speed
     * and direction.
     * @param friction float value, default is 0.6
     */
    function setFriction(blockID: string | number, friction: number): void;
    /**
     * Specifies rendering of shadows on the block.
     * @param translucency float value from 0 (no shadows) to 1
     */
    function setTranslucency(blockID: string | number, translucency: number): void;
    /**
     * Sets sound type of the block.
     * @param sound block sound type
     */
    function setSoundType(blockID: string | number, sound: Block.Sound): void;
    /**
     * Sets block color when displayed on the vanilla maps
     * @param color map color of the block
     */
    function setMapColor(blockID: string | number, color: number): void;
    /**
     * Makes block use biome color when displayed on the vanilla maps.
     * @param color block color source
     */
    function setBlockColorSource(blockID: string | number, color: Block.ColorSource): void;
    /**
     * Registers block material and digging level. If you are registering
     * block with 'stone' material ensure that its block type has baseBlock
     * id 1 to be correctly destroyed by pickaxes
     * @param nameID block numeric or string id
     * @param material material name
     * @param level block's digging level
     */
    function setBlockMaterial(blockID: string | number, material: string, level?: number): void;
    function getBlockRotation(player: number, hasVertical?: boolean): number;
    function getPlacePosition(coords: Callback.ItemUseCoordinates, block: Tile, region: BlockSource): Vector;
    function setRotationFunction(id: string | number, hasVertical?: boolean, placeSound?: string): void;
    function registerDrop(nameID: string | number, dropFunc: Block.DropFunction, level?: number): void;
    function setDestroyLevel(nameID: string | number, level: number): void;
    function registerOnExplosionFunction(nameID: string | number, func: Block.PopResourcesFunction): void;
    function addBlockDropOnExplosion(nameID: string | number): void;
    function getBlockDrop(x: number, y: number, z: number, block: Tile, level: number, item: ItemInstance, region?: BlockSource): ItemInstanceArray[];
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
 * Functions which can be used both for blocks and items
 */
interface BlockItemBehavior {
    onNameOverride?(item: ItemInstance, translation: string, name: string): string;
    onItemUse?(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
    onDispense?(coords: Callback.ItemUseCoordinates, item: ItemStack, region: WorldRegion): void;
}
/**
 * Item functions
 */
interface ItemBehavior extends BlockItemBehavior {
    onIconOverride?(item: ItemInstance, isModUi: boolean): Item.TextureData;
    onNoTargetUse?(item: ItemStack, player: number): void;
    onUsingReleased?(item: ItemStack, ticks: number, player: number): void;
    onUsingComplete?(item: ItemStack, player: number): void;
}
declare abstract class ItemBase {
    readonly stringID: string;
    readonly id: number;
    name: string;
    icon: {
        name: string;
        meta: number;
    };
    maxStack: number;
    maxDamage: number;
    inCreative: boolean;
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
    /**
    * Sets properties for the item from JSON-like object. Uses vanilla mechanics.
    * @param id string or numeric item id
    * @param props object containing properties
    */
    setProperties(props: object): void;
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
    onHurt?(params: {
        attacker: number;
        type: number;
        damage: number;
        bool1: boolean;
        bool2: boolean;
    }, item: ItemInstance, slot: number, player: number): ItemInstance | void;
    onTick?(item: ItemInstance, slot: number, player: number): ItemInstance | void;
    onTakeOn?(item: ItemInstance, slot: number, player: number): void;
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
    armorMaterial: ArmorMaterial;
    armorType: ArmorType;
    defence: number;
    texture: string;
    constructor(stringID: string, name: string, icon: string | Item.TextureData, params: ArmorParams, inCreative?: boolean);
    setArmorTexture(texture: string): void;
    setMaterial(armorMaterial: string | ArmorMaterial): void;
    preventDamaging(): void;
    static registerListeners(id: number, armorFuncs: ItemArmor | ArmorListeners): void;
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
    const SWORD: ToolParams;
    const SHOVEL: ToolParams;
    const PICKAXE: ToolParams;
    const AXE: ToolParams;
    const HOE: ToolParams;
    const SHEARS: ToolParams;
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
declare namespace ItemRegistry {
    /**
     * @returns item type ("block" or "item")
     */
    export function getType(id: number): string;
    export function isBlock(id: number): boolean;
    export function isItem(id: number): boolean;
    /**
     * @returns whether item is an item from the original game
     */
    export function isVanilla(id: number): boolean;
    /**
     * @returns item string id in the game, it differs for custom items
     */
    export function getVanillaStringID(id: number): string;
    /**
     * @returns instance of item class if it exists
     */
    export function getInstanceOf(itemID: string | number): Nullable<ItemBase>;
    /**
     * @returns EnumRarity value for item
     */
    export function getRarity(itemID: number): number;
    /**
     * @returns chat color for rarity
     * @param rarity one of EnumRarity values
     */
    export function getRarityColor(rarity: number): string;
    /**
     * @returns chat color for item's rarity
     */
    export function getItemRarityColor(itemID: number): string;
    /**
     * @param id item id
     * @param rarity one of EnumRarity values
     * @param preventNameOverride prevent registration of name override function
     */
    export function setRarity(id: string | number, rarity: number, preventNameOverride?: boolean): void;
    /**
     * Creates new armor material with specified parameters
     * @param name new (or existing) material name
     * @param material material properties
     */
    export function addArmorMaterial(name: string, material: ArmorMaterial): void;
    /**
     * @returns armor material by name
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
     * @returns tool material by name registered in ToolAPI
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
     * @param itemFuncs object which implements ItemBehavior interface
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
    getScreenByName(screenName: string): UI.IWindow;
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
    export const EmptyByFull: {};
    export const FullByEmpty: {};
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
