declare class BlockBase {
    nameID: string;
    id: number;
    variants: Array<Block.BlockVariation>;
    constructor(nameID: string);
    addVariant(name: string, texture: [string, number][], inCreative: any): void;
    create(blockType?: Block.SpecialType | string): void;
    setDestroyTime(destroyTime: number): this;
    setBlockMaterial(material: string, level: number): this;
    setShape(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): this;
    registerTileEntity(prototype: any): void;
}
interface INameOverrideable {
    onNameOverride(item: ItemInstance, translation: string, name: string): string;
}
interface IIconOverrideable {
    onIconOverride(item: ItemInstance): Item.TextureData;
}
interface IUseable {
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal?: boolean): void;
}
interface INoTargetUseable {
    onUseNoTarget(item: ItemInstance, ticks: number): void;
    onUsingReleased(item: ItemInstance, ticks: number): void;
    onUsingComplete(item: ItemInstance): void;
}
interface IDispenceBehavior {
    onDispense(coords: Callback.ItemUseCoordinates, item: ItemInstance): void;
}
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
interface IArmorFuncs {
    onHurt: (params: {
        attacker: number;
        damage: number;
        type: number;
        b1: boolean;
        b2: boolean;
    }, item: ItemInstance, index: number, maxDamage: number) => boolean;
    onTick: (item: ItemInstance, index: number, maxDamage: number) => boolean;
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
    static registerFuncs(id: string, armorFuncs: IArmorFuncs): void;
}
declare namespace ItemRegistry {
    function addArmorMaterial(name: string, material: ArmorMaterial): void;
    function getArmorMaterial(name: string): ArmorMaterial;
    function register(itemInstance: ItemBasic): void;
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
