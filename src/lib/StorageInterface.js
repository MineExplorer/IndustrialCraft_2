var NativeContainerInterface = /** @class */ (function () {
    function NativeContainerInterface(container) {
        this.container = container;
    }
    NativeContainerInterface.prototype.isNativeContainer = function () {
        return true;
    };
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
    NativeContainerInterface.prototype.getOutputSlots = function (side) {
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
    return NativeContainerInterface;
}());
var TileEntityInterface = /** @class */ (function () {
    function TileEntityInterface(tileEntity) {
        this.tileEntity = tileEntity;
        this.container = tileEntity.container;
        this.liquidStorage = tileEntity.liquidStorage;
        var storagePrototype = StorageInterface.data[tileEntity.blockID];
        if (storagePrototype) {
            for (var key in storagePrototype) {
                this[key] = storagePrototype[key];
            }
        }
    }
    TileEntityInterface.prototype.isNativeContainer = function () {
        return false;
    };
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
        if (slotSideTag == undefined)
            return true;
        if (typeof slotSideTag == "number")
            return slotSideTag == side;
        return (slotSideTag == "horizontal" && side > 1) || (slotSideTag == "down" && side == 0) || (slotSideTag == "up" && side == 1);
    };
    TileEntityInterface.prototype.addItem = function (item, side, maxCount) {
        if (maxCount === void 0) { maxCount = 64; }
        if (!this.isValidInput(item, side, this.tileEntity))
            return 0;
        var count = 0;
        for (var name in this.slots) {
            var slotData = this.slots[name];
            if (slotData.input && this.checkSide(slotData.side, side) && (!slotData.isValid || slotData.isValid(item, side, this.tileEntity))) {
                var slot = this.container.getSlot(name);
                count += StorageInterface.addItemToSlot(item, slot, maxCount - count);
                if (item.count == 0 || count >= maxCount) {
                    break;
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
                    if (item.id > 0 && (!slotData.side || slotData.side == side) && (!slotData.canOutput || slotData.canOutput(item, side, this.tileEntity))) {
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
LIBRARY({
    name: "StorageInterface",
    version: 8,
    shared: true,
    api: "CoreEngine"
});
var LIQUID_STORAGE_MAX_LIMIT = 99999999;
var StorageInterface;
(function (StorageInterface) {
    StorageInterface.data = {};
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
    function createInterface(id, descriptor) {
        var tilePrototype = TileEntity.getPrototype(id);
        if (tilePrototype) {
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
                if (!tilePrototype.getTransportSlots) {
                    var inputSlots_1 = [], outputSlots_1 = [];
                    for (var i in descriptor.slots) {
                        var slot = descriptor.slots[i];
                        if (slot.input)
                            inputSlots_1.push(i);
                        if (slot.output)
                            outputSlots_1.push(i);
                    }
                    tilePrototype.getTransportSlots = function () {
                        return { input: inputSlots_1, output: outputSlots_1 };
                    };
                }
            }
            else {
                descriptor.slots = {};
            }
            tilePrototype.addTransportedItem = function (obj, item, side) {
                this.interface.addItem(item, side);
            };
            StorageInterface.data[id] = descriptor;
        }
        else {
            Logger.Log("Failed to create storage interface: cannot find tile entity prototype for id " + id, "ERROR");
        }
    }
    StorageInterface.createInterface = createInterface;
    // doesn't override native container slot (only slot object)
    function addItemToSlot(item, slot, count) {
        if (slot.id == 0 || slot.id == item.id && slot.data == item.data) {
            var maxStack = Item.getMaxStack(item.id);
            var add = Math.min(maxStack - slot.count, item.count);
            if (count)
                add = Math.min(add, count);
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
    function getStorage(region, x, y, z) {
        var nativeTileEntity = region.getBlockEntity(x, y, z);
        if (nativeTileEntity && nativeTileEntity.getSize() > 0) {
            return new NativeContainerInterface(nativeTileEntity);
        }
        var tileEntity = World.getTileEntity(x, y, z, region);
        if (tileEntity) {
            return new TileEntityInterface(tileEntity);
        }
        return null;
    }
    StorageInterface.getStorage = getStorage;
    function getLiquidStorage(region, x, y, z) {
        var tileEntity = World.getTileEntity(x, y, z, region);
        if (tileEntity && tileEntity.liquidStorage) {
            return new TileEntityInterface(tileEntity);
        }
    }
    StorageInterface.getLiquidStorage = getLiquidStorage;
    function getNeighbourStorage(region, coords, side) {
        var dir = getRelativeCoords(coords, side);
        return getStorage(region, dir.x, dir.y, dir.z);
    }
    StorageInterface.getNeighbourStorage = getNeighbourStorage;
    function getNeighbourLiquidStorage(region, coords, side) {
        var dir = getRelativeCoords(coords, side);
        return getLiquidStorage(region, dir.x, dir.y, dir.z);
    }
    StorageInterface.getNeighbourLiquidStorage = getNeighbourLiquidStorage;
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
    function getNearestLiquidStorages(coords, side, region) {
        var storages = {};
        for (var i = 0; i < 6; i++) {
            if (side >= 0 && i != side)
                continue;
            var storage = getNeighbourLiquidStorage(region, coords, i);
            if (storage)
                storages[i] = storage;
        }
        return storages;
    }
    StorageInterface.getNearestLiquidStorages = getNearestLiquidStorages;
    function getContainerSlots(container) {
        var slots = [];
        if ("slots" in container) {
            for (var name in slots) {
                slots.push(name);
            }
        }
        else {
            var size = container.getSize();
            for (var i = 0; i < size; i++) {
                slots.push(i);
            }
        }
        return slots;
    }
    StorageInterface.getContainerSlots = getContainerSlots;
    function putItems(items, containers) {
        for (var i in items) {
            var item = items[i];
            for (var side in containers) {
                if (item.count == 0)
                    break;
                var container = containers[side];
                putItemToContainer(item, container, parseInt(side));
            }
        }
    }
    StorageInterface.putItems = putItems;
    function putItemToContainer(item, container, side, maxCount) {
        var storage = newStorage(container);
        return storage.addItem(item, side ^ 1, maxCount);
    }
    StorageInterface.putItemToContainer = putItemToContainer;
    function extractItemsFromContainer(inputContainer, outputContainer, side, maxCount, oneStack) {
        var inputStorage = newStorage(inputContainer);
        var outputStorage = newStorage(outputContainer);
        var count = 0;
        var slots = outputStorage.getOutputSlots(side ^ 1);
        for (var _i = 0, slots_1 = slots; _i < slots_1.length; _i++) {
            var name = slots_1[_i];
            var slot = outputStorage.getSlot(name);
            if (slot.id > 0) {
                var added = inputStorage.addItem(slot, side, maxCount - count);
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
    StorageInterface.extractItemsFromContainer = extractItemsFromContainer;
    function extractLiquid(liquid, maxAmount, inputStorage, outputStorage, inputSide) {
        var outputSide = inputSide ^ 1;
        if (!(outputStorage instanceof TileEntityInterface)) {
            outputStorage = new TileEntityInterface(outputStorage);
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
    function transportLiquid(liquid, maxAmount, outputStorage, inputStorage, outputSide) {
        if (!(inputStorage instanceof TileEntityInterface)) {
            inputStorage = new TileEntityInterface(inputStorage);
        }
        if (!(outputStorage instanceof TileEntityInterface)) {
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
    // use it in tick function of tile entity
    function checkHoppers(tile) {
        if (World.getThreadTime() % 8 > 0)
            return;
        var region = tile.blockSource;
        // input
        for (var side = 1; side < 6; side++) {
            var dir = getRelativeCoords(tile, side);
            var block = region.getBlock(dir.x, dir.y, dir.z);
            if (block.id == 154 && block.data == side + Math.pow(-1, side)) {
                var container = World.getContainer(dir.x, dir.y, dir.z, region);
                extractItemsFromContainer(tile, container, side, 1);
            }
        }
        // extract
        if (region.getBlockId(tile.x, tile.y - 1, tile.z) == 154) {
            var container = World.getContainer(tile.x, tile.y - 1, tile.z, region);
            extractItemsFromContainer(container, tile, 0, 1);
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
