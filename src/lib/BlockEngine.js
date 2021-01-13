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
    function ItemStack(item, count, data, extra) {
        if (item === void 0) { item = 0; }
        if (count === void 0) { count = 0; }
        if (data === void 0) { data = 0; }
        if (extra === void 0) { extra = null; }
        if (typeof item == "object") {
            return new ItemStack(item.id, item.count, item.data, item.extra);
        }
        else {
            this.id = item;
            this.data = data;
            this.count = count;
            this.extra = extra;
        }
    }
    ItemStack.prototype.getMaxStack = function () {
        return Item.getMaxStack(this.id);
    };
    ItemStack.prototype.getMaxDamage = function () {
        Item.getMaxDamage(this.id);
    };
    ItemStack.prototype.isEmpty = function () {
        return this.id == 0 && this.count == 0 && this.data == 0 && this.extra == null;
    };
    ItemStack.prototype.decrease = function (count) {
        this.count -= count;
        if (this.count <= 0)
            this.clear();
    };
    ItemStack.prototype.clear = function () {
        this.id = this.data = this.count = 0;
        this.extra = null;
    };
    return ItemStack;
}());
var Vector3 = /** @class */ (function () {
    function Vector3(vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x = vx;
            this.y = vy;
            this.z = vz;
        }
        else {
            var v = vx;
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        }
    }
    Vector3.getDirection = function (side) {
        switch (side) {
            case 0: return this.DOWN;
            case 1: return this.UP;
            case 2: return this.NORTH;
            case 3: return this.SOUTH;
            case 4: return this.EAST;
            case 5: return this.WEST;
            default: Logger.Log("Invalid block side: " + side, "ERROR");
        }
    };
    Vector3.prototype.copy = function (dst) {
        if (dst) {
            return dst.set(this);
        }
        return new Vector3(this);
    };
    Vector3.prototype.set = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x = vx;
            this.y = vy;
            this.z = vz;
            return this;
        }
        var v = vx;
        return this.set(v.x, v.y, v.z);
    };
    Vector3.prototype.add = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x += vx;
            this.y += vy;
            this.z += vz;
            return this;
        }
        var v = vx;
        return this.add(v.x, v.y, v.z);
    };
    Vector3.prototype.addScaled = function (v, scale) {
        return this.add(v.x * scale, v.y * scale, v.z * scale);
    };
    Vector3.prototype.sub = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x -= vx;
            this.y -= vy;
            this.z -= vz;
            return this;
        }
        var v = vx;
        return this.sub(v.x, v.y, v.z);
    };
    Vector3.prototype.cross = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            return this.set(this.y * vz - this.z * vy, this.z * vx - this.x * vz, this.x * vy - this.y * vx);
        }
        var v = vx;
        return this.cross(v.x, v.y, v.z);
    };
    Vector3.prototype.dot = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            return this.x * vx + this.y * vy + this.z * vz;
        }
        var v = vx;
        return this.dot(v.x, v.y, v.z);
    };
    Vector3.prototype.normalize = function () {
        var len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    };
    Vector3.prototype.lengthSquared = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };
    Vector3.prototype.length = function () {
        return Math.sqrt(this.lengthSquared());
    };
    Vector3.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    Vector3.prototype.distanceSquared = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            var dx = vx - this.x;
            var dy = vy - this.y;
            var dz = vz - this.z;
            return dx * dx + dy * dy + dz * dz;
        }
        var v = vx;
        return this.distanceSquared(v.x, v.y, v.z);
    };
    Vector3.prototype.distance = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            return Math.sqrt(this.distanceSquared(vx, vy, vz));
        }
        var v = vx;
        return this.distance(v.x, v.y, v.z);
    };
    Vector3.prototype.scale = function (factor) {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
        return this;
    };
    Vector3.prototype.scaleTo = function (len) {
        var factor = len / this.length();
        return this.scale(factor);
    };
    Vector3.prototype.toString = function () {
        return "[ " + this.x + ", " + this.y + ", " + this.z + " ]";
    };
    Vector3.DOWN = new Vector3(0, -1, 0);
    Vector3.UP = new Vector3(0, 1, 0);
    Vector3.NORTH = new Vector3(0, 0, -1);
    Vector3.SOUTH = new Vector3(0, 0, 1);
    Vector3.EAST = new Vector3(-1, 0, 0);
    Vector3.WEST = new Vector3(1, 0, 0);
    return Vector3;
}());
EXPORT("Vector3", Vector3);
/**
 * Class to work with world based on BlockSource
 */
var WorldRegion = /** @class */ (function () {
    function WorldRegion(blockSource) {
        this.blockSource = blockSource;
    }
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
        var blockSource = BlockSource.getDefaultForActor(entityUid);
        if (blockSource) {
            return new WorldRegion(blockSource);
        }
        return null;
    };
    /**
     * @returns the dimension id to which the following object belongs
     */
    WorldRegion.prototype.getDimension = function () {
        return this.blockSource.getDimension();
    };
    WorldRegion.prototype.getBlock = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getBlock(x, y, z);
        }
        var pos = x;
        return this.getBlock(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getBlockId = function (x, y, z) {
        return this.getBlock(x, y, z).id;
    };
    WorldRegion.prototype.getBlockData = function (x, y, z) {
        return this.getBlock(x, y, z).data;
    };
    WorldRegion.prototype.setBlock = function (x, y, z, id, data) {
        if (typeof x === "number") {
            return this.blockSource.setBlock(x, y, z, id, data);
        }
        var pos = x;
        id = y;
        data = z;
        return this.setBlock(pos.x, pos.y, pos.z, id, data);
    };
    WorldRegion.prototype.destroyBlock = function (x, y, z, drop, player) {
        if (typeof x === "object") {
            var pos = x, drop_1 = y, player_1 = z;
            this.destroyBlock(pos.x, pos.y, pos.z, drop_1, player_1);
            return;
        }
        if (drop) {
            var block = this.getBlock(x, y, z);
            var item = player ? Entity.getCarriedItem(player) : new ItemStack();
            var result = Block.getBlockDropViaItem(block, item, new Vector3(x, y, z), this.blockSource);
            if (result) {
                for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                    var dropItem = result_1[_i];
                    this.dropItem(x + .5, y + .5, z + .5, dropItem[0], dropItem[1], dropItem[2], dropItem[3] || null);
                }
            }
            this.blockSource.destroyBlock(x, y, z, !result);
        }
        else {
            this.blockSource.destroyBlock(x, y, z, false);
        }
    };
    WorldRegion.prototype.getNativeTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getBlockEntity(x, y, z);
        }
        var pos = x;
        return this.getNativeTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            var tileEntity = TileEntity.getTileEntity(x, y, z, this.blockSource);
            if (tileEntity && tileEntity.__initialized)
                return tileEntity;
            return null;
        }
        var pos = x;
        return this.getTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.addTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            return TileEntity.addTileEntity(x, y, z, this.blockSource);
        }
        var pos = x;
        return this.addTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.removeTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            return TileEntity.destroyTileEntityAtCoords(x, y, z, this.blockSource);
        }
        var pos = x;
        return this.removeTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getContainer = function (x, y, z) {
        if (typeof x === "number") {
            return World.getContainer(x, y, z, this.blockSource);
        }
        var pos = x;
        return this.getContainer(pos.x, pos.y, pos.z);
    };
    /**
     * Causes an explosion on coords
     * @param power defines radius of the explosion and what blocks it can destroy
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
    WorldRegion.prototype.getLightLevel = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getLightLevel(x, y, z);
        }
        var pos = x;
        return this.getLightLevel(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.canSeeSky = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.canSeeSky(x, y, z);
        }
        var pos = x;
        return this.canSeeSky(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getGrassColor = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getGrassColor(x, y, z);
        }
        var pos = x;
        return this.getGrassColor(pos.x, pos.y, pos.z);
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
        if (extra === void 0) { extra = null; }
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
    WorldRegion.prototype.playSound = function (x, y, z, name, volume, pitch) {
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        Network.sendToAllClients("WorldRegion.play_sound", { x: x, y: y, z: z, dimension: this.getDimension(), name: name, volume: volume, pitch: pitch });
    };
    return WorldRegion;
}());
Network.addClientPacket("WorldRegion.play_sound", function (data) {
    if (data.dimension == Player.getDimension()) {
        World.playSound(data.x, data.y, data.z, data.name, data.volume, data.pitch);
    }
});
var PlayerManager = /** @class */ (function () {
    function PlayerManager(playerUid) {
        this.playerActor = new PlayerActor(playerUid);
        this.playerUid = playerUid;
    }
    /**
     * @returns player's unique numeric entity id
     */
    PlayerManager.prototype.getUid = function () {
        return this.playerUid;
    };
    /**
     * @returns the id of dimension where player is.
     */
    PlayerManager.prototype.getDimension = function () {
        return this.playerActor.getDimension();
    };
    /**
     * @returns player's gamemode.
     */
    PlayerManager.prototype.getGameMode = function () {
        return this.playerActor.getGameMode();
    };
    /**
     * Adds item to player's inventory
     * @param dropRemainings if true, surplus will be dropped near player
     */
    PlayerManager.prototype.addItemToInventory = function (id, count, data, extra, dropRemainings) {
        if (extra === void 0) { extra = null; }
        if (dropRemainings === void 0) { dropRemainings = true; }
        this.playerActor.addItemToInventory(id, count, data, extra, dropRemainings);
    };
    /**
     * @returns inventory slot's contents.
     */
    PlayerManager.prototype.getInventorySlot = function (slot) {
        return this.playerActor.getInventorySlot(slot);
    };
    /**
     * Sets inventory slot's contents.
     */
    PlayerManager.prototype.setInventorySlot = function (slot, id, count, data, extra) {
        if (extra === void 0) { extra = null; }
        this.playerActor.setInventorySlot(slot, id, count, data, extra);
    };
    /**
     * @returns item in player's hand
    */
    PlayerManager.prototype.getCarriedItem = function () {
        return Entity.getCarriedItem(this.getUid());
    };
    /**
     * Sets item in player's hand
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    PlayerManager.prototype.setCarriedItem = function (id, count, data, extra) {
        if (extra === void 0) { extra = null; }
        Entity.setCarriedItem(this.getUid(), id, count, data, extra);
    };
    /**
     * Decreases carried item count by specified number
     * @param amount amount of items to decrease, default is 1
     */
    PlayerManager.prototype.decreaseCarriedItem = function (amount) {
        if (amount === void 0) { amount = 1; }
        var item = this.getCarriedItem();
        this.setCarriedItem(item.id, item.count - amount, item.data, item.extra);
    };
    /**
     * @returns armor slot's contents.
     */
    PlayerManager.prototype.getArmor = function (slot) {
        return this.playerActor.getArmor(slot);
    };
    /**
     * Sets armor slot's contents.
     */
    PlayerManager.prototype.setArmor = function (slot, id, count, data, extra) {
        if (extra === void 0) { extra = null; }
        this.playerActor.setArmor(slot, id, count, data, extra);
    };
    /**
     * Sets respawn coords for the player.
     */
    PlayerManager.prototype.setRespawnCoords = function (x, y, z) {
        this.playerActor.setRespawnCoords(x, y, z);
    };
    /**
     * Spawns exp on coords.
     * @param value experience points value
     */
    PlayerManager.prototype.spawnExpOrbs = function (x, y, z, value) {
        this.playerActor.spawnExpOrbs(x, y, z, value);
    };
    /**
     * @returns whether the player is a valid entity.
     */
    PlayerManager.prototype.isValid = function () {
        return this.playerActor.isValid();
    };
    /**
     * @returns player's selected slot.
     */
    PlayerManager.prototype.getSelectedSlot = function () {
        return this.playerActor.getSelectedSlot();
    };
    /**
     * Sets player's selected slot.
     */
    PlayerManager.prototype.setSelectedSlot = function (slot) {
        this.playerActor.setSelectedSlot(slot);
    };
    /**
     * @returns player's experience.
     */
    PlayerManager.prototype.getExperience = function () {
        return this.playerActor.getExperience();
    };
    /**
     * Sets player's experience.
     */
    PlayerManager.prototype.setExperience = function (value) {
        this.playerActor.setExperience(value);
    };
    /**
     * Add experience to player.
     */
    PlayerManager.prototype.addExperience = function (amount) {
        this.playerActor.addExperience(amount);
    };
    /**
     * @returns player's xp level.
     */
    PlayerManager.prototype.getLevel = function () {
        return this.playerActor.getLevel();
    };
    /**
     * Sets player's xp level.
     */
    PlayerManager.prototype.setLevel = function (level) {
        this.playerActor.setLevel(level);
    };
    /**
     * @returns player's exhaustion.
     */
    PlayerManager.prototype.getExhaustion = function () {
        return this.playerActor.getExhaustion();
    };
    /**
     * Sets player's exhaustion.
     */
    PlayerManager.prototype.setExhaustion = function (value) {
        this.playerActor.setExhaustion(value);
    };
    /**
     * @returns player's hunger.
     */
    PlayerManager.prototype.getHunger = function () {
        return this.playerActor.getHunger();
    };
    /**
     * Sets player's hunger.
     */
    PlayerManager.prototype.setHunger = function (value) {
        this.playerActor.setHunger(value);
    };
    /**
     * @returns player's saturation.
     */
    PlayerManager.prototype.getSaturation = function () {
        return this.playerActor.getSaturation();
    };
    /**
     * Sets player's saturation.
     */
    PlayerManager.prototype.setSaturation = function (value) {
        this.playerActor.setSaturation(value);
    };
    /**
     * @returns player's score.
     */
    PlayerManager.prototype.getScore = function () {
        return this.playerActor.getScore();
    };
    /**
     * Sets player's score.
     */
    PlayerManager.prototype.setScore = function (value) {
        this.playerActor.setScore(value);
    };
    return PlayerManager;
}());
var BlockBase = /** @class */ (function () {
    function BlockBase(stringID) {
        this.variants = [];
        this.stringID = stringID;
        this.id = IDRegistry.genBlockID(stringID);
        //ItemRegistry.register(this);
    }
    BlockBase.prototype.addVariant = function (name, texture, inCreative) {
        this.variants.push();
    };
    BlockBase.prototype.create = function (blockType) {
        Block.createBlock(this.stringID, this.variants, blockType);
    };
    BlockBase.prototype.setDestroyTime = function (destroyTime) {
        Block.setDestroyTime(this.stringID, destroyTime);
        return this;
    };
    BlockBase.prototype.setBlockMaterial = function (material, level) {
        Block.setBlockMaterial(this.stringID, material, level);
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
    function ItemBasic(stringID, name, icon) {
        this.rarity = 0;
        this.stringID = stringID;
        this.id = IDRegistry.genItemID(stringID);
        this.setName(name || stringID);
        if (typeof icon == "string")
            this.setIcon(icon);
        else if (typeof icon == "object")
            this.setIcon(icon.name, icon.meta || icon.data);
        else
            this.setIcon("missing_icon");
    }
    ItemBasic.prototype.setName = function (name) {
        this.name = name;
    };
    ItemBasic.prototype.setIcon = function (texture, index) {
        if (index === void 0) { index = 0; }
        this.icon = { name: texture, meta: index };
    };
    ItemBasic.prototype.createItem = function (inCreative) {
        if (inCreative === void 0) { inCreative = true; }
        this.item = Item.createItem(this.stringID, this.name, this.icon, { isTech: !inCreative });
        if (this.maxStack)
            this.setMaxStack(this.maxStack);
        if (this.maxDamage)
            this.setMaxDamage(this.maxDamage);
        return this;
    };
    /**
     * Sets item creative category
     * @param category item category, should be integer from 1 to 4.
     */
    ItemBasic.prototype.setCategory = function (category) {
        Item.setCategory(this.id, category);
    };
    /**
     * Sets item maximum stack size
     * @param maxStack maximum stack size for the item
     */
    ItemBasic.prototype.setMaxStack = function (maxStack) {
        this.maxStack = maxStack;
        if (this.item)
            this.item.setMaxStackSize(maxStack);
    };
    /**
     * Sets item maximum data value
     * @param maxDamage maximum data value for the item
     */
    ItemBasic.prototype.setMaxDamage = function (maxDamage) {
        this.maxDamage = maxDamage;
        if (this.item)
            this.item.setMaxDamage(maxDamage);
    };
    /**
    * Specifies how the player should hold the item
    * @param enabled if true, player holds the item as a tool, not as a simple
    * item
    */
    ItemBasic.prototype.setHandEquipped = function (enabled) {
        if (!this.item)
            return;
        this.item.setHandEquipped(enabled);
    };
    /**
     * Allows item to be put in off hand
     */
    ItemBasic.prototype.allowInOffHand = function () {
        if (!this.item)
            return;
        this.item.setAllowedInOffhand(true);
    };
    /**
     * Allows item to click on liquid blocks
     */
    ItemBasic.prototype.setLiquidClip = function () {
        if (!this.item)
            return;
        this.item.setLiquidClip(true);
    };
    /**
     * Specifies how the item can be enchanted
     * @param type enchant type defining whan enchants can or cannot be
     * applied to this item, one of the Native.EnchantType
     * @param enchantability quality of the enchants that are applied, the higher this
     * value is, the better enchants you get with the same level
     */
    ItemBasic.prototype.setEnchantType = function (type, enchantability) {
        if (!this.item)
            return;
        this.item.setEnchantType(type, enchantability);
    };
    /**
     * Sets item as glint (like enchanted tools or golden apple)
     * @param enabled if true, the item will be displayed as glint item
     */
    ItemBasic.prototype.setGlint = function (enabled) {
        if (!this.item)
            return;
        this.item.setGlint(enabled);
    };
    /**
     * Adds material that can be used to repair the item in the anvil
     * @param itemID item id to be used as repair material
     */
    ItemBasic.prototype.addRepairItem = function (itemID) {
        if (!this.item)
            return;
        this.item.addRepairItem(itemID);
    };
    ItemBasic.prototype.setRarity = function (rarity) {
        this.rarity = rarity;
        if (!('onNameOverride' in this)) {
            ItemRegistry.setRarity(this.id, rarity);
        }
    };
    return ItemBasic;
}());
/// <reference path="ItemBasic.ts" />
var ItemArmor = /** @class */ (function (_super) {
    __extends(ItemArmor, _super);
    function ItemArmor(stringID, name, icon, params) {
        var _this = _super.call(this, stringID, name, icon) || this;
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
        this.item = Item.createArmorItem(this.stringID, this.name, this.icon, { type: this.armorType, armor: this.defence, durability: 0, texture: this.texture, isTech: !inCreative });
        if (this.armorMaterial)
            this.setMaterial(this.armorMaterial);
        ItemArmor.registerListeners(this.id, this);
        return this;
    };
    ItemArmor.prototype.setArmorTexture = function (texture) {
        this.texture = texture;
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
            if (armorMaterial.repairMaterial) {
                this.addRepairItem(armorMaterial.repairMaterial);
            }
        }
    };
    ItemArmor.prototype.preventDamaging = function () {
        Armor.preventDamaging(this.id);
    };
    ItemArmor.registerListeners = function (id, armorFuncs) {
        if ('onHurt' in armorFuncs) {
            Armor.registerOnHurtListener(id, function (item, slot, player, type, value, attacker, bool1, bool2) {
                return armorFuncs.onHurt({ attacker: attacker, type: type, damage: value, bool1: bool1, bool2: bool2 }, item, slot, player);
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
var ToolType;
(function (ToolType) {
    ToolType.SWORD = {
        handEquipped: true,
        isWeapon: true,
        enchantType: Native.EnchantType.weapon,
        damage: 4,
        blockTypes: ["fibre", "plant"],
        calcDestroyTime: function (item, coords, block, params, destroyTime, enchant) {
            if (block.id == 30)
                return 0.08;
            var material = ToolAPI.getBlockMaterialName(block.id);
            if (material == "plant" || block.id == 86 || block.id == 91 || block.id == 103 || block.id == 127 || block.id == 410) {
                return params.base / 1.5;
            }
            return destroyTime;
        }
    };
    ToolType.SHOVEL = {
        handEquipped: true,
        enchantType: Native.EnchantType.shovel,
        damage: 2,
        blockTypes: ["dirt"],
        onItemUse: function (coords, item, block, player) {
            if (block.id == 2 && coords.side == 1) {
                var region = WorldRegion.getForActor(player);
                region.setBlock(coords, 198, 0);
                region.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.grass", 0.5, 0.8);
                ItemTool.damageCarriedItem(player);
            }
        }
    };
    ToolType.PICKAXE = {
        handEquipped: true,
        enchantType: Native.EnchantType.pickaxe,
        damage: 2,
        blockTypes: ["stone"],
    };
    ToolType.AXE = {
        handEquipped: true,
        enchantType: Native.EnchantType.axe,
        damage: 3,
        blockTypes: ["wood"],
        onItemUse: function (coords, item, block, player) {
            var region = WorldRegion.getForActor(player);
            var logID;
            if (block.id == 17) {
                if (block.data == 0)
                    logID = VanillaTileID.stripped_oak_log;
                if (block.data == 1)
                    logID = VanillaTileID.stripped_spruce_log;
                if (block.data == 2)
                    logID = VanillaTileID.stripped_birch_log;
                if (block.data == 3)
                    logID = VanillaTileID.stripped_jungle_log;
                region.setBlock(coords, logID, 0);
                ItemTool.damageCarriedItem(player);
            }
            else if (block.id == 162) {
                if (block.data == 0)
                    logID = VanillaTileID.stripped_acacia_log;
                else
                    logID = VanillaTileID.stripped_dark_oak_log;
                region.setBlock(coords, logID, 0);
                ItemTool.damageCarriedItem(player);
            }
        }
    };
    ToolType.HOE = {
        handEquipped: true,
        onItemUse: function (coords, item, block, player) {
            if ((block.id == 2 || block.id == 3) && coords.side == 1) {
                var region = WorldRegion.getForActor(player);
                region.setBlock(coords, 60, 0);
                region.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.gravel", 1, 0.8);
                ItemTool.damageCarriedItem(player);
            }
        }
    };
    ToolType.SHEARS = {
        blockTypes: ["plant", "fibre", "wool"],
        modifyEnchant: function (enchantData, item, coords, block) {
            if (block) {
                var material = ToolAPI.getBlockMaterialName(block.id);
                if (material == "fibre" || material == "plant") {
                    enchantData.silk = true;
                }
            }
        },
        calcDestroyTime: function (item, coords, block, params, destroyTime, enchant) {
            if (block.id == 30)
                return 0.08;
            return destroyTime;
        },
        onDestroy: function (item, coords, block, player) {
            if (block.id == 31 || block.id == 32 || block.id == 18 || block.id == 161) {
                var region = WorldRegion.getForActor(player);
                region.destroyBlock(coords);
                region.dropItem(coords.x + .5, coords.y + .5, coords.z + .5, block.id, 1, block.data);
            }
            return false;
        }
    };
})(ToolType || (ToolType = {}));
ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");
/// <reference path="ToolType.ts" />
var ItemTool = /** @class */ (function (_super) {
    __extends(ItemTool, _super);
    function ItemTool(stringID, name, icon, toolMaterial, toolData) {
        var _this = _super.call(this, stringID, name, icon) || this;
        _this.handEquipped = false;
        _this.brokenId = 0;
        _this.damage = 0;
        _this.isWeapon = false;
        _this.blockTypes = [];
        if (typeof toolMaterial == "string") {
            toolMaterial = ItemRegistry.getToolMaterial(toolMaterial);
        }
        _this.toolMaterial = toolMaterial;
        if (toolData) {
            for (var key in toolData) {
                _this[key] = toolData[key];
            }
        }
        return _this;
    }
    ItemTool.prototype.createItem = function (inCreative) {
        _super.prototype.createItem.call(this, inCreative);
        ToolAPI.registerTool(this.id, this.toolMaterial, this.blockTypes, this);
        var material = this.toolMaterial;
        if (this.enchantType && material.enchantability) {
            this.setEnchantType(this.enchantType, material.enchantability);
        }
        if (material.repairMaterial) {
            this.addRepairItem(material.repairMaterial);
        }
        if (this.handEquipped) {
            this.setHandEquipped(true);
        }
        return this;
    };
    ItemTool.damageCarriedItem = function (player, damage) {
        if (damage === void 0) { damage = 1; }
        var item = Entity.getCarriedItem(player);
        var enchant = ToolAPI.getEnchantExtraData(item.extra);
        if (Math.random() < 1 / (enchant.unbreaking + 1)) {
            item.data += damage;
        }
        if (item.data >= Item.getMaxDamage(item.id)) {
            var tool = ToolAPI.getToolData(item.id);
            item.id = tool ? tool.brokenId : 0;
            item.count = 1;
            item.data = 0;
        }
        Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
    };
    return ItemTool;
}(ItemBasic));
/// <reference path="BlockBase.ts" />
/// <reference path="ItemBasic.ts" />
/// <reference path="ItemArmor.ts" />
/// <reference path="ItemTool.ts" />
var CreativeCategory;
(function (CreativeCategory) {
    CreativeCategory[CreativeCategory["BUILDING"] = 1] = "BUILDING";
    CreativeCategory[CreativeCategory["NATURE"] = 2] = "NATURE";
    CreativeCategory[CreativeCategory["EQUIPMENT"] = 3] = "EQUIPMENT";
    CreativeCategory[CreativeCategory["ITEMS"] = 4] = "ITEMS";
})(CreativeCategory || (CreativeCategory = {}));
var ItemRegistry;
(function (ItemRegistry) {
    var items = {};
    var armorMaterials = {};
    var toolMaterials = {};
    function addArmorMaterial(name, material) {
        armorMaterials[name] = material;
    }
    ItemRegistry.addArmorMaterial = addArmorMaterial;
    function getArmorMaterial(name) {
        return armorMaterials[name];
    }
    ItemRegistry.getArmorMaterial = getArmorMaterial;
    function addToolMaterial(name, material) {
        toolMaterials[name] = material;
    }
    ItemRegistry.addToolMaterial = addToolMaterial;
    function getToolMaterial(name) {
        return toolMaterials[name];
    }
    ItemRegistry.getToolMaterial = getToolMaterial;
    function registerItem(itemInstance, addToCreative) {
        if (!itemInstance.item)
            itemInstance.createItem(addToCreative);
        items[itemInstance.id] = itemInstance;
        if ('onNameOverride' in itemInstance) {
            Item.registerNameOverrideFunction(itemInstance.id, function (item, translation, name) {
                return getRarityColor(itemInstance.rarity) + itemInstance.onNameOverride(item, translation, name);
            });
        }
        if ('onIconOverride' in itemInstance) {
            Item.registerIconOverrideFunction(itemInstance.id, function (item, isModUi) {
                return itemInstance.onIconOverride(item, isModUi);
            });
        }
        if ('onItemUse' in itemInstance) {
            Item.registerUseFunction(itemInstance.id, function (coords, item, block, player) {
                itemInstance.onItemUse(coords, item, block, player);
            });
        }
        if ('onNoTargetUse' in itemInstance) {
            Item.registerNoTargetUseFunction(itemInstance.id, function (item, player) {
                itemInstance.onNoTargetUse(item, player);
            });
        }
        if ('onUsingReleased' in itemInstance) {
            Item.registerUsingReleasedFunction(itemInstance.id, function (item, ticks, player) {
                itemInstance.onUsingReleased(item, ticks, player);
            });
        }
        if ('onUsingComplete' in itemInstance) {
            Item.registerUsingCompleteFunction(itemInstance.id, function (item, player) {
                itemInstance.onUsingComplete(item, player);
            });
        }
        if ('onDispense' in itemInstance) {
            Item.registerDispenseFunction(itemInstance.id, function (coords, item, blockSource) {
                var region = new WorldRegion(blockSource);
                itemInstance.onDispense(coords, item, region);
            });
        }
    }
    ItemRegistry.registerItem = registerItem;
    function getInstanceOf(itemID) {
        return items[itemID] || null;
    }
    ItemRegistry.getInstanceOf = getInstanceOf;
    function createItem(stringID, params) {
        var numericID = IDRegistry.genItemID(stringID);
        var icon;
        if (typeof params.icon == "string")
            icon = { name: params.icon };
        else
            icon = params.icon;
        Item.createItem(stringID, params.name, icon, { stack: params.stack || 64, isTech: params.isTech });
        if (params.maxDamage)
            Item.setMaxDamage(numericID, params.maxDamage);
        if (params.category)
            Item.setCategory(numericID, params.category);
        if (params.handEquipped)
            Item.setToolRender(numericID, true);
        if (params.allowedInOffhand)
            Item.setAllowedInOffhand(numericID, true);
        if (params.glint)
            Item.setGlint(numericID, true);
        if (params.enchant)
            Item.setEnchantType(numericID, params.enchant.type, params.enchant.value);
        if (params.rarity)
            setRarity(numericID, params.rarity);
    }
    ItemRegistry.createItem = createItem;
    function createArmor(stringID, params) {
        var item = new ItemArmor(stringID, params.name, params.icon, params);
        registerItem(item, !params.isTech);
        if (params.material)
            item.setMaterial(params.material);
        if (params.category)
            item.setCategory(params.category);
        if (params.glint)
            item.setGlint(true);
        if (params.rarity)
            item.setRarity(params.rarity);
        return item;
    }
    ItemRegistry.createArmor = createArmor;
    function createTool(stringID, params, toolData) {
        var item = new ItemTool(stringID, params.name, params.icon, params.material, toolData);
        registerItem(item, !params.isTech);
        if (params.category)
            item.setCategory(params.category);
        if (params.glint)
            item.setGlint(true);
        if (params.rarity)
            item.setRarity(params.rarity);
        return item;
    }
    ItemRegistry.createTool = createTool;
    /**
     * Registers name override function for item which adds color to item name depends on rarity
     * @param rarity number from 1 to 3
     */
    function setRarity(id, rarity) {
        Item.registerNameOverrideFunction(id, function (item, translation, name) {
            return getRarityColor(rarity) + translation;
        });
    }
    ItemRegistry.setRarity = setRarity;
    function getRarityColor(rarity) {
        if (rarity == 1)
            return "§e";
        if (rarity == 2)
            return "§b";
        if (rarity == 3)
            return "§d";
        return "";
    }
    ItemRegistry.getRarityColor = getRarityColor;
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
    TileEntityBase.prototype.init = function () {
        this.region = new WorldRegion(this.blockSource);
    };
    TileEntityBase.prototype.load = function () { };
    TileEntityBase.prototype.unload = function () { };
    TileEntityBase.prototype.tick = function () { };
    TileEntityBase.prototype.clientLoad = function () { };
    TileEntityBase.prototype.clientUnload = function () { };
    TileEntityBase.prototype.clientTick = function () { };
    TileEntityBase.prototype.onCheckerTick = function (isInitialized, isLoaded, wasLoaded) { };
    TileEntityBase.prototype.getScreenName = function (player, coords) {
        return "main";
    };
    TileEntityBase.prototype.getScreenByName = function (screenName) {
        return null;
    };
    /**
     * Called when player uses some item on a TileEntity. Replaces "click" function.
     * @returns true if should prevent opening UI.
    */
    TileEntityBase.prototype.onItemUse = function (coords, item, player) {
        return false;
    };
    TileEntityBase.prototype.onItemClick = function (id, count, data, coords, player, extra) {
        if (!this.__initialized) {
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
    TileEntityBase.prototype.redstone = function (params) {
        this.onRedstoneUpdate(params.power);
    };
    /**
     * Occurs when redstone signal on TileEntity block was updated. Replaces "redstone" function
     * @param signal signal power (0-15)
     */
    TileEntityBase.prototype.onRedstoneUpdate = function (signal) { };
    TileEntityBase.prototype.projectileHit = function (coords, target) { };
    TileEntityBase.prototype.destroy = function () {
        return false;
    };
    TileEntityBase.prototype.selfDestroy = function () {
        TileEntity.destroyTileEntity(this);
    };
    TileEntityBase.prototype.requireMoreLiquid = function (liquid, amount) { };
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
                    delete target[propertyName];
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
                        target.containerEvents = {};
                    target.containerEvents[propertyName] = target[propertyName];
                }
            };
        }
        Decorators.ContainerEvent = ContainerEvent;
    })(Decorators = BlockEngine.Decorators || (BlockEngine.Decorators = {}));
})(BlockEngine || (BlockEngine = {}));
EXPORT("ItemStack", ItemStack);
EXPORT("Vector3", Vector3);
EXPORT("WorldRegion", WorldRegion);
EXPORT("PlayerManager", PlayerManager);
EXPORT("ItemBasic", ItemBasic);
EXPORT("ItemArmor", ItemArmor);
EXPORT("ItemRegistry", ItemRegistry);
EXPORT("CreativeCategory", CreativeCategory);
EXPORT("TileEntityBase", TileEntityBase);
EXPORT("Side", Side);
EXPORT("BlockEngine", BlockEngine);
