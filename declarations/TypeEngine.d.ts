declare class ItemStack implements ItemInstance {
    id: number;
    count: number;
    data: number;
    extra?: ItemExtraData;
    constructor(id: number, count: number, data: number, extra?: ItemExtraData);
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
    }, item: ItemInstance, slot: number, player: number) => boolean;
}
interface OnTickListener {
    onTick: (item: ItemInstance, slot: number, player: number) => boolean;
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
    static registerListeners(id: string, armorFuncs: ItemArmor | OnHurtListener | OnTickListener | OnTakeOnListener | OnTakeOffListener): void;
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
    x: number;
    y: number;
    z: number;
    dimension: number;
    blockID: number;
    data: any;
    defaultValues: {};
    container: ItemContainer;
    liquidStorage: any;
    remove: boolean;
    isLoaded: boolean;
    private __initialized;
    useNetworkItemContainer: boolean;
    blockSource: BlockSource;
    networkData: SyncedNetworkData;
    networkEntity: NetworkEntity;
    created(): void;
    load(): void;
    unload(): void;
    init(): void;
    tick(): void;
    onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void;
    getScreenName(player: number, coords: Callback.ItemUseCoordinates): string;
    getScreenByName(screenName: string): any;
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean;
    click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean;
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
