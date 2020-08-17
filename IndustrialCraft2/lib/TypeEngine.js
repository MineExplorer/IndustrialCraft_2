var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
LIBRARY({
    name: "TypeEngine",
    version: 1,
    shared: false,
    api: "CoreEngine"
});
var BlockBase = /** @class */ (function () {
    function BlockBase(nameID) {
        this.variants = [];
        this.nameID = nameID;
        this.id = IDRegistry.genBlockID(nameID);
        //ItemRegistry.register(this);
    }
    BlockBase.prototype.addVariant = function (name, texture, inCreative) {
        this.variants.push();
    };
    BlockBase.prototype.create = function (blockType) {
        Block.createBlock(this.nameID, this.variants, blockType);
    };
    BlockBase.prototype.setDestroyTime = function (destroyTime) {
        Block.setDestroyTime(this.nameID, destroyTime);
        return this;
    };
    BlockBase.prototype.setBlockMaterial = function (material, level) {
        Block.setBlockMaterial(this.nameID, material, level);
        return this;
    };
    BlockBase.prototype.setShape = function (x1, y1, z1, x2, y2, z2) {
        Block.setShape(this.id, x1, y1, z1, x2, y2, z2);
        return this;
    };
    BlockBase.prototype.registerTileEntity = function (prototype) {
        TileEntity.registerPrototype(this.id, prototype);
    };
    return BlockBase;
}());
var ItemBasic = /** @class */ (function () {
    function ItemBasic(nameID, name, icon) {
        this.rarity = 0;
        this.nameID = nameID;
        this.id = IDRegistry.genItemID(nameID);
        this.setName(name || nameID);
        if (typeof icon == "string")
            this.setIcon(icon);
        else if (typeof icon == "object")
            this.setIcon(icon.name, icon.meta || icon.data);
        else
            this.setIcon("missing_icon");
        ItemRegistry.register(this);
    }
    ItemBasic.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    ItemBasic.prototype.setIcon = function (texture, index) {
        if (index === void 0) { index = 0; }
        this.icon = { name: texture, meta: index };
        return this;
    };
    ItemBasic.prototype.createItem = function (inCreative) {
        if (inCreative === void 0) { inCreative = true; }
        this.item = Item.createItem(this.nameID, this.name, this.icon, { isTech: !inCreative });
        return this;
    };
    ItemBasic.prototype.setMaxDamage = function (maxDamage) {
        this.item.setMaxDamage(maxDamage);
        return this;
    };
    ItemBasic.prototype.setMaxStack = function (maxStack) {
        this.item.setMaxStack(maxStack);
        return this;
    };
    ItemBasic.prototype.setHandEquipped = function (enabled) {
        this.item.setHandEquipped(enabled);
        return this;
    };
    ItemBasic.prototype.setEnchantType = function (type, enchantability) {
        this.item.setEnchantType(type, enchantability);
        return this;
    };
    ItemBasic.prototype.setLiquidClip = function () {
        this.item.setLiquidClip(true);
        return this;
    };
    ItemBasic.prototype.setGlint = function (enabled) {
        this.item.setGlint(enabled);
        return this;
    };
    ItemBasic.prototype.allowInOffHand = function () {
        this.item.setAllowedInOffhand(true);
        return this;
    };
    ItemBasic.prototype.addRepairItem = function (itemID) {
        this.item.addRepairItem(itemID);
        return this;
    };
    ItemBasic.prototype.setRarity = function (rarity) {
        this.rarity = rarity;
        return this;
    };
    /*
    onNameOverride(item: ItemInstance, translation: string, name: string): string {
        return this.getRarityCode(this.rarity) + translation;
    }

    onIconOverride(item: ItemInstance): Item.TextureData {
        return this.icon;
    }
    
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal?: boolean): void {}

    onUseNoTarget(item: ItemInstance, ticks: number): void {}

    onUsingReleased(item: ItemInstance, ticks: number): void {}

    onUsingComplete(item: ItemInstance): void {}

    onDispense(coords: Callback.ItemUseCoordinates, item: ItemInstance): void {}
    */
    ItemBasic.prototype.getRarityCode = function (rarity) {
        if (rarity == 1)
            return "§e";
        if (rarity == 2)
            return "§b";
        if (rarity == 3)
            return "§d";
        return "";
    };
    return ItemBasic;
}());
/// <reference path="./ItemBasic.ts" />
var ItemArmor = /** @class */ (function (_super) {
    __extends(ItemArmor, _super);
    function ItemArmor(nameID, name, icon, params) {
        var _this = _super.call(this, nameID, name, icon) || this;
        _this.armorType = params.type;
        _this.defence = params.defence;
        if (params.texture)
            _this.setArmorTexture(params.texture);
        if (params.material)
            _this.setMaterial(params.material);
        return _this;
    }
    ItemArmor.prototype.createItem = function (inCreative) {
        if (inCreative === void 0) { inCreative = true; }
        this.item = Item.createArmorItem(this.nameID, this.name, this.icon, { type: this.armorType, armor: this.defence, durability: 0, texture: this.texture, isTech: !inCreative });
        if (this.armorMaterial)
            this.setMaterial(this.armorMaterial);
        return this;
    };
    ItemArmor.prototype.setArmorTexture = function (texture) {
        this.texture = texture;
        return this;
    };
    ItemArmor.prototype.setMaterial = function (armorMaterial) {
        if (typeof armorMaterial == "string") {
            armorMaterial = ItemRegistry.getArmorMaterial(armorMaterial);
        }
        this.armorMaterial = armorMaterial;
        if (this.item) {
            var index = Native.ArmorType[this.armorType];
            var maxDamage = armorMaterial.durabilityFactor * ItemArmor.maxDamageArray[index];
            this.setMaxDamage(maxDamage);
            if (armorMaterial.enchantability) {
                this.setEnchantType(Native.EnchantType[this.armorType], armorMaterial.enchantability);
            }
            if (armorMaterial.repairItem) {
                this.addRepairItem(armorMaterial.repairItem);
            }
        }
        return this;
    };
    ItemArmor.registerFuncs = function (id, armorFuncs) {
        Armor.registerFuncs(id, {
            hurt: function (params, item, index, maxDamage) {
                return armorFuncs.onHurt(params, item, index, maxDamage);
            },
            tick: function (item, index, maxDamage) {
                return armorFuncs.onTick(item, index, maxDamage);
            }
        });
    };
    ItemArmor.maxDamageArray = [11, 16, 15, 13];
    return ItemArmor;
}(ItemBasic));
/// <reference path="./BlockBase.ts" />
/// <reference path="./ItemBasic.ts" />
/// <reference path="./ItemArmor.ts" />
var ItemRegistry;
(function (ItemRegistry) {
    var items = {};
    var armorMaterials = {};
    function addArmorMaterial(name, material) {
        armorMaterials[name] = material;
    }
    ItemRegistry.addArmorMaterial = addArmorMaterial;
    function getArmorMaterial(name) {
        return armorMaterials[name];
    }
    ItemRegistry.getArmorMaterial = getArmorMaterial;
    function isNameOverrideable(object) {
        return 'onNameOverride' in object;
    }
    function isIconOverrideable(object) {
        return 'onIconOverride' in object;
    }
    function isUseable(object) {
        return 'onItemUse' in object;
    }
    function isNoTargetUseable(object) {
        return 'onUseNoTarget' in object;
    }
    function hasDispenceBehavior(object) {
        return 'onDispence' in object;
    }
    function register(itemInstance) {
        items[itemInstance.id] = itemInstance;
        if (isNameOverrideable(itemInstance)) {
            Item.registerNameOverrideFunction(itemInstance.id, function (item, translation, name) {
                return itemInstance.onNameOverride(item, translation, name);
            });
        }
        if (isIconOverrideable(itemInstance)) {
            Item.registerIconOverrideFunction(itemInstance.id, function (item) {
                return itemInstance.onIconOverride(item);
            });
        }
        if (isUseable(itemInstance)) {
            Item.registerUseFunction(itemInstance.id, function (coords, item, block, isExternal) {
                itemInstance.onItemUse(coords, item, block, isExternal);
            });
        }
        if (isNoTargetUseable(itemInstance)) {
            Item.registerNoTargetUseFunction(itemInstance.id, function (item, ticks) {
                itemInstance.onUseNoTarget(item, ticks);
            });
            Item.registerUsingReleasedFunction(itemInstance.id, function (item, ticks) {
                itemInstance.onUsingReleased(item, ticks);
            });
            Item.registerUsingCompleteFunction(itemInstance.id, function (item) {
                itemInstance.onUsingComplete(item);
            });
        }
        if (hasDispenceBehavior(itemInstance)) {
            Item.registerDispenseFunction(itemInstance.id, function (coords, item) {
                itemInstance.onDispense(coords, item);
            });
        }
    }
    ItemRegistry.register = register;
    function getInstanceOf(itemID) {
        return items[itemID] || null;
    }
    ItemRegistry.getInstanceOf = getInstanceOf;
    function createItem(nameID, params) {
        var item = new ItemBasic(nameID, params.name, params.icon);
        item.createItem(params.inCreative);
        if (params.maxStack)
            item.setMaxStack(params.maxStack);
        return item;
    }
    ItemRegistry.createItem = createItem;
    function createArmorItem(nameID, params) {
        var item = new ItemArmor(nameID, params.name, params.icon, params);
        item.createItem(params.inCreative);
        if (params.material)
            item.setMaterial(params.material);
        return item;
    }
    ItemRegistry.createArmorItem = createArmorItem;
})(ItemRegistry || (ItemRegistry = {}));
EXPORT("BlockBase", BlockBase);
EXPORT("ItemBasic", ItemBasic);
EXPORT("ItemArmor", ItemArmor);
EXPORT("ItemRegistry", ItemRegistry);
