LIBRARY({
    name: "StorageInterface",
    version: 9,
    shared: true,
    api: "CoreEngine"
});
var LIQUID_STORAGE_MAX_LIMIT = 99999999;
/// <reference path="Storage.ts" />
var NativeContainerInterface = /** @class */ (function () {
    function NativeContainerInterface(container) {
        this.isNativeContainer = true;
        this.container = container;
    }
    NativeContainerInterface.prototype.getSlot = function (index) {
        return this.container.getSlot(index);
    };
    NativeContainerInterface.prototype.setSlot = function (index, id, count, data, extra) {
        this.container.setSlot(index, id, count, data, extra);
    };
    NativeContainerInterface.prototype.isValidInputSlot = function (containerType, index, side) {
        switch (containerType) {
            case 1:
            case 38:
            case 39:
                return index == ((side == 1) ? 0 : 1);
            case 8:
                return index == ((side == 1) ? 0 : 4);
            default:
                return true;
        }
    };
    NativeContainerInterface.prototype.addItem = function (item, side, maxCount) {
        if (side === void 0) { side = -1; }
        if (maxCount === void 0) { maxCount = 64; }
        var count = 0;
        var containerType = this.container.getType();
        var containerSize = this.container.getSize();
        for (var index = 0; index < containerSize; index++) {
            if (!this.isValidInputSlot(containerType, index, side))
                continue;
            var slot = this.getSlot(index);
            var added = StorageInterface.addItemToSlot(item, slot, maxCount - count);
            if (added > 0) {
                count += added;
                this.setSlot(index, slot.id, slot.count, slot.data, slot.extra);
                if (item.count == 0 || count >= maxCount) {
                    break;
                }
            }
        }
        return count;
    };
    NativeContainerInterface.prototype.getOutputSlots = function () {
        var slots = [];
        var type = this.container.getType();
        switch (type) {
            case 1:
            case 38:
            case 39:
                slots.push(2);
                break;
            case 8:
                slots.push(1, 2, 3);
                break;
            default:
                for (var i = 0; i < this.container.getSize(); i++) {
                    slots.push(i);
                }
                break;
        }
        return slots;
    };
    NativeContainerInterface.prototype.clearContainer = function () {
        var size = this.container.getSize();
        for (var i = 0; i < size; i++) {
            this.container.setSlot(i, 0, 0, 0);
        }
    };
    return NativeContainerInterface;
}());
/// <reference path="Storage.ts" />
var TileEntityInterface = /** @class */ (function () {
    function TileEntityInterface(tileEntity) {
        this.isNativeContainer = false;
        this.tileEntity = tileEntity;
        this.container = tileEntity.container;
        this.liquidStorage = tileEntity.liquidStorage;
        var storagePrototype = StorageInterface.getData(tileEntity.blockID);
        if (storagePrototype) {
            for (var key in storagePrototype) {
                this[key] = storagePrototype[key];
            }
        }
    }
    TileEntityInterface.prototype.getSlot = function (name) {
        return this.container.getSlot(name);
    };
    TileEntityInterface.prototype.setSlot = function (name, id, count, data, extra) {
        this.container.setSlot(name, id, count, data, extra);
    };
    TileEntityInterface.prototype.isValidInput = function (item, side, tileEntity) {
        return true;
    };
    TileEntityInterface.prototype.checkSide = function (slotSideTag, side) {
        if (slotSideTag == undefined || side == -1)
            return true;
        if (typeof slotSideTag == "number")
            return slotSideTag == side;
        switch (slotSideTag) {
            case "horizontal": return side > 1;
            case "verctical": return side <= 1;
            case "down": return side == 0;
            case "up": return side == 1;
        }
        return false;
    };
    TileEntityInterface.prototype.addItem = function (item, side, maxCount) {
        if (side === void 0) { side = -1; }
        if (maxCount === void 0) { maxCount = 64; }
        if (!this.isValidInput(item, side, this.tileEntity))
            return 0;
        var count = 0;
        for (var name in this.slots) {
            var slotData = this.slots[name];
            if (slotData.input && this.checkSide(slotData.side, side) && (!slotData.isValid || slotData.isValid(item, side, this.tileEntity))) {
                var slot = this.getSlot(name);
                var addAmount = Math.min(maxCount - count, slotData.maxStack || 64);
                var added = StorageInterface.addItemToSlot(item, slot, addAmount);
                if (added > 0) {
                    this.setSlot(name, slot.id, slot.count, slot.data, slot.extra);
                    count += added;
                    if (item.count == 0 || count >= maxCount) {
                        break;
                    }
                }
            }
        }
        return count;
    };
    TileEntityInterface.prototype.getOutputSlots = function (side) {
        var slotNames = [];
        if (this.slots) {
            for (var name in this.slots) {
                var slotData = this.slots[name];
                if (slotData.output) {
                    var item = this.container.getSlot(name);
                    if (item.id > 0 && this.checkSide(slotData.side, side) && (!slotData.canOutput || slotData.canOutput(item, side, this.tileEntity))) {
                        slotNames.push(name);
                    }
                }
            }
        }
        else if (this.tileEntity.getTransportSlots) {
            return this.tileEntity.getTransportSlots().output;
        }
        else {
            for (var name in this.container.slots) {
                slotNames.push(name);
            }
        }
        return slotNames;
    };
    TileEntityInterface.prototype.clearContainer = function () {
        for (var name in this.container.slots) {
            this.container.clearSlot(name);
        }
    };
    TileEntityInterface.prototype.canReceiveLiquid = function (liquid, side) {
        return this.liquidStorage.getLimit(liquid) < LIQUID_STORAGE_MAX_LIMIT;
    };
    TileEntityInterface.prototype.canTransportLiquid = function (liquid, side) {
        return this.liquidStorage.getLimit(liquid) < LIQUID_STORAGE_MAX_LIMIT;
    };
    TileEntityInterface.prototype.addLiquid = function (liquid, amount) {
        var liquidStored = this.liquidStorage.getLiquidStored();
        if (!liquidStored || liquidStored == liquid) {
            return this.liquidStorage.addLiquid(liquid, amount);
        }
        return amount;
    };
    TileEntityInterface.prototype.getLiquid = function (liquid, amount) {
        return this.liquidStorage.getLiquid(liquid, amount);
    };
    TileEntityInterface.prototype.getLiquidStored = function (storageName) {
        return this.liquidStorage.getLiquidStored();
    };
    TileEntityInterface.prototype.getLiquidStorage = function (storageName) {
        return this.liquidStorage;
    };
    return TileEntityInterface;
}());
/// <reference path="NativeContainerInterface.ts" />
/// <reference path="TileEntityInterface.ts" />
var StorageInterface;
(function (StorageInterface) {
    StorageInterface.data = {};
    function getData(id) {
        return StorageInterface.data[id];
    }
    StorageInterface.getData = getData;
    StorageInterface.directionsBySide = [
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: -1 },
        { x: 0, y: 0, z: 1 },
        { x: -1, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 } // west
    ];
    function getRelativeCoords(coords, side) {
        var dir = StorageInterface.directionsBySide[side];
        return { x: coords.x + dir.x, y: coords.y + dir.y, z: coords.z + dir.z };
    }
    StorageInterface.getRelativeCoords = getRelativeCoords;
    function setSlotMaxStackPolicy(container, slotName, maxCount) {
        container.setSlotAddTransferPolicy(slotName, function (container, name, id, amount, data) {
            return Math.max(0, Math.min(amount, maxCount - container.getSlot(name).count));
        });
    }
    StorageInterface.setSlotMaxStackPolicy = setSlotMaxStackPolicy;
    function setSlotValidatePolicy(container, slotName, func) {
        container.setSlotAddTransferPolicy(slotName, function (container, name, id, amount, data, extra, playerUid) {
            return func(name, id, amount, data, extra, container, playerUid) ? amount : 0;
        });
    }
    StorageInterface.setSlotValidatePolicy = setSlotValidatePolicy;
    function setGlobalValidatePolicy(container, func) {
        container.setGlobalAddTransferPolicy(function (container, name, id, amount, data, extra, playerUid) {
            return func(name, id, amount, data, extra, container, playerUid) ? amount : 0;
        });
    }
    StorageInterface.setGlobalValidatePolicy = setGlobalValidatePolicy;
    /** Creates new interface instance for TileEntity or Container */
    function newStorage(storage) {
        if ("container" in storage) {
            return new TileEntityInterface(storage);
        }
        if ("getParent" in storage) {
            return new TileEntityInterface(storage.getParent());
        }
        return new NativeContainerInterface(storage);
    }
    StorageInterface.newStorage = newStorage;
    /** Registers interface for block container */
    function createInterface(id, descriptor) {
        if (descriptor.slots) {
            for (var name in descriptor.slots) {
                if (name.includes('^')) {
                    var slotData = descriptor.slots[name];
                    var str = name.split('^');
                    var index = str[1].split('-');
                    for (var i = parseInt(index[0]); i <= parseInt(index[1]); i++) {
                        descriptor.slots[str[0] + i] = slotData;
                    }
                    delete descriptor.slots[name];
                }
            }
        }
        else {
            descriptor.slots = {};
        }
        StorageInterface.data[id] = descriptor;
    }
    StorageInterface.createInterface = createInterface;
    /** Trasfers item to slot
     * @count amount to transfer. Default is 64.
     * @returns transfered amount
     */
    function addItemToSlot(item, slot, count) {
        if (count === void 0) { count = 64; }
        if (slot.id == 0 || slot.id == item.id && slot.data == item.data) {
            var maxStack = Item.getMaxStack(item.id);
            var add = Math.min(maxStack - slot.count, item.count);
            if (count < add)
                add = count;
            if (add > 0) {
                slot.id = item.id;
                slot.count += add;
                slot.data = item.data;
                if (item.extra)
                    slot.extra = item.extra;
                item.count -= add;
                if (item.count == 0) {
                    item.id = item.data = 0;
                }
                return add;
            }
        }
        return 0;
    }
    StorageInterface.addItemToSlot = addItemToSlot;
    /** Returns storage interface for container in the world */
    function getStorage(region, x, y, z) {
        var nativeTileEntity = region.getBlockEntity(x, y, z);
        if (nativeTileEntity && nativeTileEntity.getSize() > 0) {
            return new NativeContainerInterface(nativeTileEntity);
        }
        var tileEntity = World.getTileEntity(x, y, z, region);
        if (tileEntity && tileEntity.container) {
            return new TileEntityInterface(tileEntity);
        }
        return null;
    }
    StorageInterface.getStorage = getStorage;
    /** Returns storage interface for TileEntity with liquid storage */
    function getLiquidStorage(region, x, y, z) {
        var tileEntity = World.getTileEntity(x, y, z, region);
        if (tileEntity && tileEntity.liquidStorage) {
            return new TileEntityInterface(tileEntity);
        }
        return null;
    }
    StorageInterface.getLiquidStorage = getLiquidStorage;
    /** Returns storage interface for neighbour container on specified side */
    function getNeighbourStorage(region, coords, side) {
        var dir = getRelativeCoords(coords, side);
        return getStorage(region, dir.x, dir.y, dir.z);
    }
    StorageInterface.getNeighbourStorage = getNeighbourStorage;
    /** Returns storage interface for neighbour TileEntity with liquid storage on specified side */
    function getNeighbourLiquidStorage(region, coords, side) {
        var dir = getRelativeCoords(coords, side);
        return getLiquidStorage(region, dir.x, dir.y, dir.z);
    }
    StorageInterface.getNeighbourLiquidStorage = getNeighbourLiquidStorage;
    /**
     * Returns object containing neigbour containers where keys are block side numbers
     * @side side to get container, use -1 to get from all sides
    */
    function getNearestContainers(coords, side, region) {
        var containers = {};
        for (var i = 0; i < 6; i++) {
            if (side >= 0 && i != side)
                continue;
            var dir = getRelativeCoords(coords, i);
            var container = World.getContainer(dir.x, dir.y, dir.z, region);
            if (container) {
                containers[i] = container;
            }
        }
        return containers;
    }
    StorageInterface.getNearestContainers = getNearestContainers;
    /**
     * Returns object containing neigbour liquid storages where keys are block side numbers
     * @side side to get storage, use -1 to get from all sides
    */
    function getNearestLiquidStorages(coords, side, region) {
        var storages = {};
        for (var i = 0; i < 6; i++) {
            if (side >= 0 && side != i)
                continue;
            var storage = getNeighbourLiquidStorage(region, coords, i);
            if (storage)
                storages[i] = storage;
        }
        return storages;
    }
    StorageInterface.getNearestLiquidStorages = getNearestLiquidStorages;
    /**
     * Returns array of slot indexes for vanilla container or array of slot names for mod container
    */
    function getContainerSlots(container) {
        if ("slots" in container) {
            return Object.keys(container.slots);
        }
        else {
            var slots = [];
            var size = container.getSize();
            for (var i = 0; i < size; i++) {
                slots.push(i);
            }
            return slots;
        }
    }
    StorageInterface.getContainerSlots = getContainerSlots;
    /** Puts items to containers */
    function putItems(items, containers) {
        for (var i in items) {
            var item = items[i];
            for (var side in containers) {
                if (item.count == 0)
                    break;
                var container = containers[side];
                putItemToContainer(item, container, parseInt(side) ^ 1);
            }
        }
    }
    StorageInterface.putItems = putItems;
    /**
     * @side block side of container which receives item
     * @maxCount max count of item to transfer (optional)
    */
    function putItemToContainer(item, container, side, maxCount) {
        var storage = newStorage(container);
        return storage.addItem(item, side, maxCount);
    }
    StorageInterface.putItemToContainer = putItemToContainer;
    /**
     * Extracts items from one container to another
     * @inputContainer container to receive items
     * @outputContainer container to extract items
     * @inputSide block side of input container which is receiving items
     * @maxCount max total count of extracted items (optional)
     * @oneStack if true, will extract only 1 item
    */
    function extractItemsFromContainer(inputContainer, outputContainer, inputSide, maxCount, oneStack) {
        var inputStorage = newStorage(inputContainer);
        var outputStorage = newStorage(outputContainer);
        return extractItemsFromStorage(inputStorage, outputStorage, inputSide, maxCount, oneStack);
    }
    StorageInterface.extractItemsFromContainer = extractItemsFromContainer;
    /**
     * Extracts items from one container to another
     * @inputStorage container interface to receive items
     * @outputStorage container interface to extract items
     * @inputSide block side of input container which is receiving items
     * @maxCount max total count of extracted items (optional)
     * @oneStack if true, will extract only 1 item
    */
    function extractItemsFromStorage(inputStorage, outputStorage, inputSide, maxCount, oneStack) {
        var count = 0;
        var slots = outputStorage.getOutputSlots(inputSide ^ 1);
        for (var _i = 0, slots_1 = slots; _i < slots_1.length; _i++) {
            var name = slots_1[_i];
            var slot = outputStorage.getSlot(name);
            if (slot.id > 0) {
                var added = inputStorage.addItem(slot, inputSide, maxCount - count);
                if (added > 0) {
                    count += added;
                    outputStorage.setSlot(name, slot.id, slot.count, slot.data, slot.extra);
                    if (oneStack || count >= maxCount) {
                        break;
                    }
                }
            }
        }
        return count;
    }
    StorageInterface.extractItemsFromStorage = extractItemsFromStorage;
    /**
     * Extract liquid from one storage to another
     * @liquid liquid to extract. If null, will extract liquid stored in output storage
     * @maxAmount max amount of liquid that can be transfered
     * @inputStorage storage to input liquid
     * @outputStorage storage to extract liquid
     * @inputSide block side of input storage which is receiving liquid
    */
    function extractLiquid(liquid, maxAmount, inputStorage, outputStorage, inputSide) {
        var outputSide = inputSide ^ 1;
        if (!(inputStorage instanceof TileEntityInterface)) { // reverse compatibility
            inputStorage = new TileEntityInterface(inputStorage);
        }
        if (!liquid) {
            liquid = outputStorage.getLiquidStored("output");
        }
        if (liquid && outputStorage.canTransportLiquid(liquid, outputSide)) {
            return transportLiquid(liquid, maxAmount, outputStorage, inputStorage, outputSide);
        }
        return 0;
    }
    StorageInterface.extractLiquid = extractLiquid;
    /** Similar to StorageInterface.extractLiquid, but liquid must be specified */
    function transportLiquid(liquid, maxAmount, outputStorage, inputStorage, outputSide) {
        if (!(outputStorage instanceof TileEntityInterface)) { // reverse compatibility
            outputStorage = new TileEntityInterface(outputStorage);
        }
        if (inputStorage.canReceiveLiquid(liquid, outputSide ^ 1)) {
            var amount = outputStorage.getLiquid(liquid, maxAmount);
            amount = inputStorage.addLiquid(liquid, amount);
            outputStorage.getLiquid(liquid, -amount);
            return amount;
        }
        return 0;
    }
    StorageInterface.transportLiquid = transportLiquid;
    /**
     * Every 8 ticks checks neigbour hoppers and transfers items.
     * Use it in tick function of TileEntity
    */
    function checkHoppers(tile) {
        if (World.getThreadTime() % 8 > 0)
            return;
        var region = tile.blockSource;
        var storage = StorageInterface.newStorage(tile);
        // input
        for (var side = 1; side < 6; side++) {
            var dir = getRelativeCoords(tile, side);
            var block = region.getBlock(dir.x, dir.y, dir.z);
            if (block.id == 154 && block.data == side + Math.pow(-1, side)) {
                var hopper = StorageInterface.getStorage(region, dir.x, dir.y, dir.z);
                extractItemsFromStorage(storage, hopper, side, 1);
            }
        }
        // extract
        if (region.getBlockId(tile.x, tile.y - 1, tile.z) == 154) {
            var hopper = StorageInterface.getStorage(region, tile.x, tile.y - 1, tile.z);
            extractItemsFromStorage(hopper, storage, 0, 1);
        }
    }
    StorageInterface.checkHoppers = checkHoppers;
})(StorageInterface || (StorageInterface = {}));
Callback.addCallback("TileEntityAdded", function (tileEntity, created) {
    if (created) { // fix of TileEntity access from ItemContainer
        tileEntity.container.setParent(tileEntity);
    }
    if (StorageInterface.data[tileEntity.blockID]) { // reverse compatibility
        tileEntity.interface = new TileEntityInterface(tileEntity);
    }
});
EXPORT("StorageInterface", StorageInterface);
