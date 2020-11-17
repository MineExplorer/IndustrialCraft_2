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
    name: "BlockEngine",
    version: 1,
    shared: false,
    api: "CoreEngine"
});
var ItemStack = /** @class */ (function () {
    function ItemStack(id, count, data, extra) {
        this.id = id;
        this.data = data;
        this.count = count;
        this.extra = extra;
    }
    return ItemStack;
}());
var Vector = /** @class */ (function () {
    function Vector(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Vector;
}());
var WorldRegion = /** @class */ (function () {
    function WorldRegion(blockSource) {
        this.blockSource = blockSource;
    }
    /**
     * @returns the dimension id to which the following object belongs
     */
    WorldRegion.prototype.getDimension = function () {
        return this.blockSource.getDimension();
    };
    WorldRegion.prototype.getBlock = function (x, y, z) {
        if (typeof x === "object") {
            var pos = x;
            return this.getBlock(pos.x, pos.y, pos.z);
        }
        return this.blockSource.getBlock(x, y, z);
    };
    WorldRegion.prototype.getBlockId = function (x, y, z) {
        return this.getBlock(x, y, z).id;
    };
    WorldRegion.prototype.getBlockData = function (x, y, z) {
        return this.getBlock(x, y, z).data;
    };
    WorldRegion.prototype.setBlock = function (x, y, z, id, data) {
        if (typeof x === "object") {
            var pos = x, id = y, data = z;
            return this.setBlock(pos.x, pos.y, pos.z, id, data);
        }
        return this.blockSource.setBlock(x, y, z, id, data);
    };
    WorldRegion.prototype.destroyBlock = function (x, y, z, drop, player) {
        if (typeof x === "object") {
            var pos = x, drop = y, player = z;
            this.destroyBlock(pos.x, pos.y, pos.z, drop, player);
            return;
        }
        var block = this.getBlock(x, y, z);
        this.blockSource.destroyBlock(x, y, z, drop);
        if (drop) {
            if (player) {
                var item = Entity.getCarriedItem(player);
            }
            else {
                var item = new ItemStack(0, 0, 0);
            }
            var result = Block.getBlockDropViaItem(block, item, new Vector(x, y, z), this.blockSource);
            if (result) {
                for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                    var dropItem = result_1[_i];
                    this.dropItem(x + 0.5, y + 0.5, z + 0.5, dropItem[0], dropItem[1], dropItem[2], dropItem[3] || null);
                }
            }
        }
    };
    WorldRegion.prototype.getNativeTileEntity = function (x, y, z) {
        if (typeof x === "object") {
            var pos = x;
            return this.getNativeTileEntity(pos.x, pos.y, pos.z);
        }
        return this.blockSource.getBlockEntity(x, y, z);
    };
    WorldRegion.prototype.getTileEntity = function (x, y, z) {
        if (typeof x === "object") {
            var pos = x;
            return this.getTileEntity(pos.x, pos.y, pos.z);
        }
        return TileEntity.getTileEntity(x, y, z, this.blockSource);
    };
    WorldRegion.prototype.addTileEntity = function (x, y, z) {
        if (typeof x === "object") {
            var pos = x;
            return this.addTileEntity(pos.x, pos.y, pos.z);
        }
        return TileEntity.addTileEntity(x, y, z, this.blockSource);
    };
    WorldRegion.prototype.removeTileEntity = function (x, y, z) {
        if (typeof x === "object") {
            var pos = x;
            return this.removeTileEntity(pos.x, pos.y, pos.z);
        }
        return TileEntity.destroyTileEntityAtCoords(x, y, z, this.blockSource);
    };
    WorldRegion.prototype.getContainer = function (x, y, z) {
        if (typeof x === "object") {
            var pos = x;
            return this.getContainer(pos.x, pos.y, pos.z);
        }
        return World.getContainer(x, y, z, this.blockSource);
    };
    /**
     * Creates an explosion on coords
     * @param power defines how many blocks can the explosion destroy and what
     * blocks can or cannot be destroyed
     * @param fire if true, puts the crater on fire
     */
    WorldRegion.prototype.explode = function (x, y, z, power, fire) {
        if (fire === void 0) { fire = false; }
        this.blockSource.explode(x, y, z, power, fire);
    };
    /**
     * @returns biome id at X and Z coord
     */
    WorldRegion.prototype.getBiome = function (x, z) {
        return this.blockSource.getBiome(x, z);
    };
    /**
     * Sets biome id by coords
     * @param id - id of the biome to set
     */
    WorldRegion.prototype.setBiome = function (x, z, biomeID) {
        this.blockSource.setBiome(x, z, biomeID);
    };
    /**
     * @returns temperature of the biome on coords
     */
    WorldRegion.prototype.getBiomeTemperatureAt = function (x, y, z) {
        return this.blockSource.getBiomeTemperatureAt(x, y, z);
    };
    /**
    * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns true if chunk is loaded, false otherwise
     */
    WorldRegion.prototype.isChunkLoaded = function (chunkX, chunkZ) {
        return this.blockSource.isChunkLoaded(chunkX, chunkZ);
    };
    /**
    * @param x X coord of the position
     * @param z Z coord of the position
     * @returns true if chunk on the position is loaded, false otherwise
     */
    WorldRegion.prototype.isChunkLoadedAt = function (x, z) {
        return this.blockSource.isChunkLoadedAt(x, z);
    };
    /**
    * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns the loading state of the chunk by chunk coords
     */
    WorldRegion.prototype.getChunkState = function (chunkX, chunkZ) {
        return this.blockSource.getChunkState(chunkX, chunkZ);
    };
    /**
    * @param x X coord of the position
     * @param z Z coord of the position
     * @returns the loading state of the chunk by coords
     */
    WorldRegion.prototype.getChunkStateAt = function (x, z) {
        return this.blockSource.getChunkStateAt(x, z);
    };
    /**
     * @returns light level on the specified coordinates, from 0 to 15
     */
    WorldRegion.prototype.getLightLevel = function (x, y, z) {
        return this.blockSource.getLightLevel(x, y, z);
    };
    /**
     * @returns whether the sky can be seen from coords
     */
    WorldRegion.prototype.canSeeSky = function (x, y, z) {
        return this.blockSource.canSeeSky(x, y, z);
    };
    /**
     * @returns grass color on coords
     */
    WorldRegion.prototype.getGrassColor = function (x, y, z) {
        return this.getGrassColor(x, y, z);
    };
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
    WorldRegion.prototype.dropItem = function (x, y, z, id, count, data, extra) {
        return this.blockSource.spawnDroppedItem(x, y, z, id, count, data, extra);
    };
    WorldRegion.prototype.spawnEntity = function (x, y, z, namespace, type, init_data) {
        if (type === void 0) {
            return this.blockSource.spawnEntity(x, y, z, namespace);
        }
        return this.blockSource.spawnEntity(x, y, z, namespace, type, init_data);
    };
    /**
     * Spawns experience orbs on coords
     * @param amount experience amount
     */
    WorldRegion.prototype.spawnExpOrbs = function (x, y, z, amount) {
        return this.blockSource.spawnExpOrbs(x, y, z, amount);
    };
    /**
     * @returns the list of entity IDs in given box,
     * that are equal to the given type, if blacklist value is false,
     * and all except the entities of the given type, if blacklist value is true
     */
    WorldRegion.prototype.fetchEntitiesInAABB = function (x1, y1, z1, x2, y2, z2, type, blacklist) {
        if (blacklist === void 0) { blacklist = false; }
        return this.blockSource.fetchEntitiesInAABB(x1, y1, z1, x2, y2, z2, type, blacklist);
    };
    /**
     * @returns the list of entity IDs in given box,
     * that are equal to the given type, if blacklist value is false,
     * and all except the entities of the given type, if blacklist value is true
     */
    WorldRegion.prototype.listEntitiesInAABB = function (x1, y1, z1, x2, y2, z2, type, blacklist) {
        if (blacklist === void 0) { blacklist = false; }
        return this.blockSource.listEntitiesInAABB(x1, y1, z1, x2, y2, z2, type, blacklist);
    };
    /**
     * @returns interface to given dimension
     * (null if given dimension is not loaded and this interface
     * was not created yet)
     */
    WorldRegion.getForDimension = function (dimension) {
        var blockSource = BlockSource.getDefaultForDimension(dimension);
        if (blockSource) {
            return new WorldRegion(blockSource);
        }
        return null;
    };
    /**
     * @returns interface to the dimension where the given entity is
     * (null if given entity does not exist or the dimension is not loaded
     * and interface was not created)
     */
    WorldRegion.getForActor = function (entityUid) {
        var blockSource = BlockSource.getDefaultForDimension(entityUid);
        if (blockSource) {
            return new WorldRegion(blockSource);
        }
        return null;
    };
    return WorldRegion;
}());
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
    BlockBase.prototype.setShape = function (x1, y1, z1, x2, y2, z2, data) {
        Block.setShape(this.id, x1, y1, z1, x2, y2, z2, data);
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
        ItemArmor.registerListeners(this.id, this);
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
    ItemArmor.registerListeners = function (id, armorFuncs) {
        if ('onHurt' in armorFuncs) {
            Armor.registerOnHurtListener(id, function (item, slot, player, value, type, attacker, bool1, bool2) {
                return armorFuncs.onHurt({ attacker: attacker, damage: value, type: type, bool1: bool1, bool2: bool2 }, item, slot, player);
            });
        }
        if ('onTick' in armorFuncs) {
            Armor.registerOnTickListener(id, function (item, slot, player) {
                return armorFuncs.onTick(item, slot, player);
            });
        }
        if ('onTakeOn' in armorFuncs) {
            Armor.registerOnTakeOnListener(id, function (item, slot, player) {
                armorFuncs.onTakeOn(item, slot, player);
            });
        }
        if ('onTakeOff' in armorFuncs) {
            Armor.registerOnTakeOffListener(id, function (item, slot, player) {
                armorFuncs.onTakeOff(item, slot, player);
            });
        }
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
    function register(itemInstance) {
        items[itemInstance.id] = itemInstance;
        if ('onNameOverride' in itemInstance) {
            Item.registerNameOverrideFunction(itemInstance.id, function (item, translation, name) {
                return itemInstance.onNameOverride(item, translation, name);
            });
        }
        if ('onIconOverride' in itemInstance) {
            Item.registerIconOverrideFunction(itemInstance.id, function (item) {
                return itemInstance.onIconOverride(item);
            });
        }
        if ('onItemUse' in itemInstance) {
            Item.registerUseFunction(itemInstance.id, function (coords, item, block, player) {
                itemInstance.onItemUse(coords, item, block, player);
            });
        }
        if ('onUseNoTarget' in itemInstance) {
            Item.registerNoTargetUseFunction(itemInstance.id, function (item, ticks) {
                itemInstance.onUseNoTarget(item, ticks);
            });
        }
        if ('onUsingReleased' in itemInstance) {
            Item.registerUsingReleasedFunction(itemInstance.id, function (item, ticks) {
                itemInstance.onUsingReleased(item, ticks);
            });
        }
        if ('onUsingComplete' in itemInstance) {
            Item.registerUsingCompleteFunction(itemInstance.id, function (item) {
                itemInstance.onUsingComplete(item);
            });
        }
        if ('onDispense' in itemInstance) {
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
var TileEntityBase = /** @class */ (function () {
    function TileEntityBase() {
        this.useNetworkItemContainer = true;
        this.client = this.client || {};
        this.client.load = this.clientLoad;
        this.client.unload = this.clientUnload;
        this.client.tick = this.clientTick;
    }
    TileEntityBase.prototype.created = function () { };
    ;
    TileEntityBase.prototype.load = function () { };
    ;
    TileEntityBase.prototype.unload = function () { };
    ;
    TileEntityBase.prototype.init = function () { };
    ;
    TileEntityBase.prototype.tick = function () { };
    ;
    TileEntityBase.prototype.clientLoad = function () { };
    ;
    TileEntityBase.prototype.clientUnload = function () { };
    ;
    TileEntityBase.prototype.clientTick = function () { };
    ;
    TileEntityBase.prototype.onCheckerTick = function (isInitialized, isLoaded, wasLoaded) { };
    TileEntityBase.prototype.getScreenName = function (player, coords) {
        return "main";
    };
    TileEntityBase.prototype.getScreenByName = function (screenName) {
        return null;
    };
    TileEntityBase.prototype.onItemUse = function (coords, item, player) {
        return false;
    };
    TileEntityBase.prototype.onItemClick = function (id, count, data, coords, player, extra) {
        if (!this.__initialized) {
            // @ts-ignore
            if (!this._runInit()) {
                return false;
            }
        }
        if (this.onItemUse(coords, new ItemStack(id, count, data, extra), player)) {
            return false;
        }
        if (Entity.getSneaking(player)) {
            return false;
        }
        var screenName = this.getScreenName(player, coords);
        if (screenName) {
            var client = Network.getClientForPlayer(player);
            if (client) {
                this.container.openFor(client, screenName);
                return true;
            }
        }
        return false;
    };
    TileEntityBase.prototype.destroyBlock = function (coords, player) { };
    TileEntityBase.prototype.redstone = function (params) { };
    TileEntityBase.prototype.projectileHit = function (coords, target) { };
    TileEntityBase.prototype.destroy = function () {
        return false;
    };
    TileEntityBase.prototype.selfDestroy = function () {
        TileEntity.destroyTileEntity(this);
    };
    TileEntityBase.prototype.requireMoreLiquid = function (liquid, amount) { };
    TileEntityBase.prototype.sendPacket = function (name, data) { };
    TileEntityBase.prototype.sendResponse = function (packetName, someData) { };
    return TileEntityBase;
}());
var Side;
(function (Side) {
    Side[Side["Client"] = 0] = "Client";
    Side[Side["Server"] = 1] = "Server";
})(Side || (Side = {}));
var BlockEngine;
(function (BlockEngine) {
    var Decorators;
    (function (Decorators) {
        function ClientSide() {
            return function (target, propertyName) {
                if (!target.client)
                    target.client = {};
                target.client[propertyName] = target[propertyName];
            };
        }
        Decorators.ClientSide = ClientSide;
        function NetworkEvent(side) {
            return function (target, propertyName) {
                if (side == Side.Client) {
                    if (!target.client)
                        target.client = {};
                    if (!target.client.events)
                        target.client.events = {};
                    target.client.events[propertyName] = target[propertyName];
                }
                else {
                    if (!target.events)
                        target.events = {};
                    target.events[propertyName] = target[propertyName];
                }
            };
        }
        Decorators.NetworkEvent = NetworkEvent;
        function ContainerEvent(side) {
            return function (target, propertyName) {
                if (side == Side.Client) {
                    if (!target.client)
                        target.client = {};
                    if (!target.client.containerEvents)
                        target.client.containerEvents = {};
                    target.client.containerEvents[propertyName] = target[propertyName];
                    delete target[propertyName];
                }
                else {
                    if (!target.containerEvents)
                        target.client = {};
                    target.containerEvents[propertyName] = target[propertyName];
                }
            };
        }
        Decorators.ContainerEvent = ContainerEvent;
    })(Decorators = BlockEngine.Decorators || (BlockEngine.Decorators = {}));
})(BlockEngine || (BlockEngine = {}));
EXPORT("ItemStack", ItemStack);
EXPORT("Vector", Vector);
EXPORT("WorldRegion", WorldRegion);
EXPORT("ItemBasic", ItemBasic);
EXPORT("ItemArmor", ItemArmor);
EXPORT("ItemRegistry", ItemRegistry);
EXPORT("TileEntityBase", TileEntityBase);
EXPORT("Side", Side);
EXPORT("BlockEngine", BlockEngine);