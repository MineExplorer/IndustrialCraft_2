var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
  _____                                           __   _          _
 | ____|  _ __     ___   _ __    __ _   _   _    |  \ | |   ___  | |_
 |  _|   | '_ \   / _ \ | '__|  / _` | | | | |   | \ \| |  / _ \ | __|
 | |___  | | | | |  __/ | |    | (_| | | |_| |   | |\ | | |  __/ | |_
 |_____| |_| |_|  \___| |_|     \__, |  \__, |   |_| \__|  \___|  \__|
                                |___/   |___/
*/
LIBRARY({
    name: "EnergyNet",
    version: 12,
    shared: true,
    api: "CoreEngine"
});
Translation.addTranslation("Energy", { ru: "Энергия", zh: "能量" });
var EnergyRegistry;
(function (EnergyRegistry) {
    EnergyRegistry.energyTypes = {};
    EnergyRegistry.wireData = {};
    /**
     * @param name - name of this energy type
     * @param value - value of one unit in [Eu] (IC2 Energy)
    */
    function createEnergyType(name, value) {
        if (EnergyRegistry.energyTypes[name]) {
            alert("WARNING: duplicate energy types for name: " + name + "!");
            Logger.Log("duplicate energy types for name: " + name + "!", "ERROR");
        }
        var energyType = new EnergyType(name, value);
        EnergyRegistry.energyTypes[name] = energyType;
        return energyType;
    }
    EnergyRegistry.createEnergyType = createEnergyType;
    function assureEnergyType(name, value) {
        if (getEnergyType(name)) {
            return getEnergyType(name);
        }
        else {
            return createEnergyType(name, value);
        }
    }
    EnergyRegistry.assureEnergyType = assureEnergyType;
    function getEnergyType(name) {
        return EnergyRegistry.energyTypes[name];
    }
    EnergyRegistry.getEnergyType = getEnergyType;
    function getValueRatio(name1, name2) {
        var type1 = getEnergyType(name1);
        var type2 = getEnergyType(name2);
        if (type1 && type2) {
            return type1.value / type2.value;
        }
        else {
            Logger.Log("get energy value ratio failed: some of this 2 energy types is not defined: " + [name1, name2], "ERROR");
            return -1;
        }
    }
    EnergyRegistry.getValueRatio = getValueRatio;
    function registerWire(blockID, type, maxValue, energyGridClass) {
        if (energyGridClass === void 0) { energyGridClass = EnergyGrid; }
        EnergyRegistry.wireData[blockID] = {
            type: type,
            maxValue: maxValue,
            class: energyGridClass
        };
    }
    EnergyRegistry.registerWire = registerWire;
    function getWireData(blockID) {
        return EnergyRegistry.wireData[blockID] || null;
    }
    EnergyRegistry.getWireData = getWireData;
    function createWireGrid(blockID, blockSource) {
        var wireData = getWireData(blockID);
        if (wireData) {
            return new wireData.class(wireData.type, wireData.maxValue, blockID, blockSource);
        }
        throw new Error("Invalid wire ID ".concat(blockID, " for EnergyGrid"));
    }
    EnergyRegistry.createWireGrid = createWireGrid;
    function isWire(blockID, type) {
        var wireData = getWireData(blockID);
        if (wireData) {
            if (!type || wireData.type.name == type)
                return true;
        }
        return false;
    }
    EnergyRegistry.isWire = isWire;
})(EnergyRegistry || (EnergyRegistry = {}));
var EnergyType = /** @class */ (function () {
    function EnergyType(name, value) {
        if (value === void 0) { value = 1; }
        this.name = name;
        this.value = value;
    }
    EnergyType.prototype.registerWire = function (id, maxValue, energyGridClass) {
        EnergyRegistry.registerWire(id, this, maxValue, energyGridClass);
        Block.registerPlaceFunction(id, function (coords, item, block, player) {
            var region = BlockSource.getDefaultForActor(player);
            var place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
            region.setBlock(place.x, place.y, place.z, item.id, item.data);
            EnergyGridBuilder.onWirePlaced(region, place.x, place.y, place.z);
            return place;
        });
    };
    return EnergyType;
}());
var EnergyPacket = /** @class */ (function () {
    function EnergyPacket(energyName, size, source, transferMode) {
        if (transferMode === void 0) { transferMode = 1 /* TransferMode.Split */; }
        this.nodeList = {};
        this.energyName = energyName;
        this.size = size;
        this.source = source;
        this.transferMode = transferMode;
    }
    /**
     * Returns true if the node has not yet been passed by this packet.
     * @param nodeId node id
     */
    EnergyPacket.prototype.validateNode = function (nodeId) {
        return !this.nodeList[nodeId];
    };
    /**
     * Marks node as passed by this packet.
     * @param nodeId node id.
     */
    EnergyPacket.prototype.setNodePassed = function (nodeId) {
        this.nodeList[nodeId] = true;
    };
    return EnergyPacket;
}());
var BlockNode = /** @class */ (function () {
    function BlockNode(parent, x, y, z, tile) {
        this.parent = null;
        this.adjacentLinks = [];
        this.extraData = {};
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.z = z;
        this.tile = tile;
    }
    BlockNode.getCoordKey = function (x, y, z) {
        return "".concat(x, ":").concat(y, ":").concat(z);
    };
    BlockNode.prototype.getCoordKey = function () {
        return BlockNode.getCoordKey(this.x, this.y, this.z);
    };
    BlockNode.prototype.linkBlock = function (blockNode) {
        if (this.addAdjacentLink(blockNode, true, true)) {
            blockNode.addAdjacentLink(this, true, true);
        }
    };
    BlockNode.prototype.unlinkBlock = function (blockNode) {
        if (this.removeAdjacentLink(blockNode)) {
            blockNode.removeAdjacentLink(this);
        }
    };
    BlockNode.prototype.linkTile = function (tileNode, canInput, canOutput) {
        if (this.addAdjacentLink(tileNode, canInput, canOutput)) {
            tileNode.addAdjacentLink(this, canOutput, canInput);
        }
    };
    BlockNode.prototype.unlinkTile = function (tileNode) {
        if (this.removeAdjacentLink(tileNode)) {
            tileNode.removeAdjacentLink(this);
        }
    };
    BlockNode.prototype.addAdjacentLink = function (node, canInput, canOutput) {
        for (var _i = 0, _a = this.adjacentLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.node == node)
                return false;
        }
        this.adjacentLinks.push({
            node: node,
            canInput: canInput,
            canOutput: canOutput
        });
        return true;
    };
    BlockNode.prototype.removeAdjacentLink = function (node) {
        var index = this.adjacentLinks.findIndex(function (link) { return link.node == node; });
        if (index == -1)
            return false;
        this.adjacentLinks.splice(index, 1);
        return true;
    };
    BlockNode.prototype.resetAdjacentLinks = function () {
        for (var _i = 0, _a = this.adjacentLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            link.node.removeAdjacentLink(this);
        }
        this.adjacentLinks = [];
    };
    return BlockNode;
}());
var BlockNodesSet = /** @class */ (function () {
    function BlockNodesSet(parent) {
        this.data = {};
        this.parent = parent;
    }
    BlockNodesSet.prototype.getCoordKey = function (x, y, z) {
        return BlockNode.getCoordKey(x, y, z);
    };
    BlockNodesSet.prototype.has = function (x, y, z) {
        return !!this.get(x, y, z);
    };
    BlockNodesSet.prototype.get = function (x, y, z) {
        return this.data[this.getCoordKey(x, y, z)];
    };
    BlockNodesSet.prototype.add = function (x, y, z, tile) {
        var coordKey = this.getCoordKey(x, y, z);
        var blockNode = this.data[coordKey] || new BlockNode(this.parent, x, y, z, tile);
        blockNode.parent = this.parent;
        return this.data[coordKey] = blockNode;
    };
    BlockNodesSet.prototype.addNode = function (blockNode) {
        blockNode.parent = this.parent;
        return this.data[blockNode.getCoordKey()] = blockNode;
    };
    BlockNodesSet.prototype.remove = function (x, y, z) {
        var coordKey = this.getCoordKey(x, y, z);
        var blockNode = this.data[coordKey];
        if (!blockNode)
            return null;
        delete this.data[coordKey];
        blockNode.parent = null;
        return blockNode;
    };
    BlockNodesSet.prototype.removeNode = function (blockNode) {
        return this.remove(blockNode.x, blockNode.y, blockNode.z);
    };
    BlockNodesSet.prototype.containsNode = function (blockNode) {
        return this.get(blockNode.x, blockNode.y, blockNode.z) == blockNode;
    };
    BlockNodesSet.prototype.mergeFrom = function (other) {
        for (var coordKey in other.data) {
            var blockNode = other.data[coordKey];
            blockNode.parent = this.parent;
            this.data[coordKey] = blockNode;
        }
    };
    BlockNodesSet.prototype.forEachNode = function (func) {
        for (var coordKey in this.data) {
            func(this.data[coordKey]);
        }
    };
    BlockNodesSet.prototype.clear = function () {
        this.forEachNode(function (blockNode) {
            blockNode.parent = null;
        });
        this.data = {};
    };
    return BlockNodesSet;
}());
var EnergyNode = /** @class */ (function () {
    function EnergyNode(energyType, dimension) {
        this.energyTypes = {};
        this.maxValue = Number.MAX_SAFE_INTEGER;
        this.removed = false;
        this.entries = [];
        this.receivers = [];
        this.activeReceivers = null;
        this.energyIn = 0;
        this.currentIn = 0;
        this.energyOut = 0;
        this.currentOut = 0;
        this.energyPower = 0;
        this.currentPower = 0;
        this.isFull = false;
        this.freeCapacity = -1;
        this.id = EnergyNet.globalNodeID++;
        this.baseEnergy = energyType.name;
        this.addEnergyType(energyType);
        this.dimension = dimension;
    }
    EnergyNode.prototype.addEnergyType = function (energyType) {
        this.energyTypes[energyType.name] = energyType;
    };
    EnergyNode.prototype.addEntry = function (node) {
        if (this.entries.indexOf(node) == -1) {
            this.entries.push(node);
        }
    };
    EnergyNode.prototype.removeEntry = function (node) {
        var index = this.entries.indexOf(node);
        if (index != -1) {
            this.entries.splice(index, 1);
        }
    };
    /**
     * @param node receiver node
     * @returns true if link to the node was added, false if it already exists
     */
    EnergyNode.prototype.addReceiver = function (node) {
        if (this.receivers.indexOf(node) == -1) {
            this.receivers.push(node);
            return true;
        }
        return false;
    };
    /**
     * @param node receiver node
     * @returns true if link to the node was removed, false if it's already removed
     */
    EnergyNode.prototype.removeReceiver = function (node) {
        var index = this.receivers.indexOf(node);
        if (index != -1) {
            this.receivers.splice(index, 1);
            return true;
        }
        return false;
    };
    /**
     * Adds output connection to specified node
     * @param node receiver node
     * @returns — true if connection was added, false if it already exists
     */
    EnergyNode.prototype.addConnection = function (node) {
        if (this.addReceiver(node)) {
            node.addEntry(this);
            return true;
        }
        return false;
    };
    /**
     * Removes output connection to specified node
     * @param node receiver node
     * @returns true if connection was removed, false if it's already removed
     */
    EnergyNode.prototype.removeConnection = function (node) {
        if (this.removeReceiver(node)) {
            node.removeEntry(this);
            return true;
        }
        return false;
    };
    EnergyNode.prototype.resetConnections = function () {
        for (var _i = 0, _a = this.entries; _i < _a.length; _i++) {
            var node = _a[_i];
            node.removeReceiver(this);
        }
        this.entries = [];
        for (var _b = 0, _c = this.receivers; _b < _c.length; _b++) {
            var node = _c[_b];
            node.removeEntry(this);
        }
        this.receivers = [];
    };
    EnergyNode.prototype.receiveEnergy = function (amount, packet) {
        if (this.isFull)
            return 0;
        var energyIn = this.transferEnergy(amount, packet);
        if (energyIn > 0) {
            this.currentPower = Math.max(this.currentPower, packet.size);
            this.currentIn += energyIn;
        }
        else {
            this.isFull = true;
        }
        return energyIn;
    };
    EnergyNode.prototype.add = function (amount, power) {
        if (amount == 0)
            return 0;
        var add = this.addPacket(this.baseEnergy, amount, power);
        return amount - add;
    };
    EnergyNode.prototype.addPacket = function (energyName, amount, power, transferMode, receivers) {
        if (power === void 0) { power = amount; }
        if (amount == 0)
            return 0;
        var packet = new EnergyPacket(energyName, power, this, transferMode);
        var energyOut = this.transferEnergy(amount, packet, receivers);
        return energyOut;
    };
    EnergyNode.prototype.transferEnergy = function (amount, packet, receivers) {
        receivers !== null && receivers !== void 0 ? receivers : (receivers = packet.transferMode == 1 /* TransferMode.Split */ ? this.getActiveReceivers() : this.receivers);
        packet.setNodePassed(this.id);
        if (receivers.length == 0)
            return 0;
        var leftAmount = amount;
        if (packet.size > this.maxValue) {
            // Shrink energy packet proportional to the size ratio if its amount is bigger than its size
            amount = amount > packet.size ? Math.floor(amount * this.maxValue / packet.size) : this.maxValue;
            leftAmount = amount;
            this.onOverload(packet.size);
        }
        if (packet.transferMode == 1 /* TransferMode.Split */) {
            var leftReceivers = receivers.filter(function (n) { return packet.validateNode(n.id); });
            for (var i = 0; i < leftReceivers.length; i++) {
                var node = leftReceivers[i];
                if (node.removed)
                    continue;
                var receiveAmount = leftAmount;
                if (receiveAmount > 1 && leftReceivers.length - i > 1) {
                    receiveAmount = Math.ceil(receiveAmount / (leftReceivers.length - i));
                }
                leftAmount -= node.receiveEnergy(receiveAmount, packet);
                if (leftAmount <= 0)
                    break;
            }
        }
        else {
            for (var _i = 0, receivers_1 = receivers; _i < receivers_1.length; _i++) {
                var node = receivers_1[_i];
                if (node.removed || !packet.validateNode(node.id))
                    continue;
                leftAmount -= node.receiveEnergy(leftAmount, packet);
                if (leftAmount <= 0)
                    break;
            }
        }
        var energyOut = amount - leftAmount;
        if (energyOut > 0) {
            this.currentPower = Math.max(this.currentPower, packet.size);
            this.currentOut += energyOut;
        }
        return energyOut;
    };
    /** @deprecated */
    EnergyNode.prototype.addAll = function (amount, power) {
        if (power === void 0) { power = amount; }
        this.add(amount, power);
    };
    EnergyNode.prototype.onOverload = function (packetSize) { };
    EnergyNode.prototype.canProduceEnergy = function () {
        return false;
    };
    EnergyNode.prototype.isConductor = function (energyName) {
        return true;
    };
    EnergyNode.prototype.canReceiveEnergy = function (side, energyName) {
        return true;
    };
    EnergyNode.prototype.canEmitEnergy = function (side, energyName) {
        return true;
    };
    EnergyNode.prototype.canConductEnergy = function (coord1, coord2, side) {
        return true;
    };
    EnergyNode.prototype.isCompatible = function (node) {
        for (var energyType in this.energyTypes) {
            if (node.energyTypes[energyType])
                return true;
        }
        return false;
    };
    EnergyNode.prototype.getActiveReceivers = function () {
        if (this.activeReceivers)
            return this.activeReceivers;
        var activeReceivers = [];
        for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
            var node = _a[_i];
            var freeAmount = node.getFreeCapacity(this.baseEnergy);
            if (freeAmount >= 1) {
                activeReceivers.push(node);
            }
        }
        // Sorting makes energy spread more evenly by distributing leftovers from the first receivers to the next
        this.activeReceivers = activeReceivers.sort(function (a, b) { return a.freeCapacity - b.freeCapacity; });
        return activeReceivers;
    };
    EnergyNode.prototype.tick = function () {
        this.energyIn = this.currentIn;
        this.currentIn = 0;
        this.energyOut = this.currentOut;
        this.currentOut = 0;
        this.energyPower = this.currentPower;
        this.currentPower = 0;
        this.isFull = false;
        this.activeReceivers = null;
    };
    EnergyNode.prototype.destroy = function () {
        this.removed = true;
        EnergyNet.enqueueRemoval(this);
    };
    EnergyNode.prototype.toString = function () {
        return "[EnergyNode id=".concat(this.id, ", type=").concat(this.baseEnergy, ", entries=").concat(this.entries.length, ", receivers=").concat(this.receivers.length, ", energyIn=").concat(this.energyIn, ", energyOut=").concat(this.energyOut, ", power=").concat(this.energyPower, "]");
    };
    return EnergyNode;
}());
var EnergyGrid = /** @class */ (function (_super) {
    __extends(EnergyGrid, _super);
    function EnergyGrid(energyType, maxValue, wireID, region) {
        var _this = _super.call(this, energyType, region.getDimension()) || this;
        _this.kind = "grid";
        _this.rebuild = false;
        _this.idleTicks = 0;
        _this.energyPotential = 0;
        _this.blockNodes = new BlockNodesSet(_this);
        _this.blocksMap = _this.blockNodes.data;
        _this.maxValue = maxValue;
        _this.blockID = wireID;
        _this.region = region;
        return _this;
    }
    EnergyGrid.prototype.isCompatible = function (node) {
        for (var energyType in this.energyTypes) {
            if (node.energyTypes[energyType])
                return true;
        }
        return false;
    };
    EnergyGrid.prototype.addCoords = function (x, y, z, tile) {
        return this.blockNodes.add(x, y, z, tile);
    };
    EnergyGrid.prototype.hasCoords = function (x, y, z) {
        return this.blockNodes.has(x, y, z);
    };
    /**
     * Determines whether the specified wire block can be absorbed into this grid.
     */
    EnergyGrid.prototype.isValidWire = function (tile) {
        return this.blockID == tile.id;
    };
    EnergyGrid.prototype.mergeGrid = function (grid) {
        this.blockNodes.mergeFrom(grid.blockNodes);
        for (var _i = 0, _a = grid.entries; _i < _a.length; _i++) {
            var node = _a[_i];
            node.addConnection(this);
        }
        for (var _b = 0, _c = grid.receivers; _b < _c.length; _b++) {
            var node = _c[_b];
            this.addConnection(node);
        }
        grid.destroy();
        // Create connections for merge boundary
        this.reconnectBlockGraph();
        return this;
    };
    EnergyGrid.prototype.rebuildRecursive = function (x, y, z, side) {
        if (this.removed)
            return;
        if (this.blockNodes.has(x, y, z))
            return;
        var node = EnergyNet.getNodeOnCoords(this.region, x, y, z);
        if (node && !this.isCompatible(node))
            return;
        if (node instanceof EnergyTileNode) {
            if (node.canReceiveEnergy(side, this.baseEnergy)) {
                this.addConnection(node);
            }
            if ((node.canProduceEnergy() || node.isConductor(this.baseEnergy)) && node.canEmitEnergy(side, this.baseEnergy)) {
                node.addConnection(this);
            }
        }
        else {
            var tile = this.region.getBlock(x, y, z);
            if (this.isValidWire(tile)) {
                if (node) {
                    this.mergeGrid(node);
                }
                else {
                    var blockNode = this.addCoords(x, y, z, tile);
                    this.rebuildFor6Sides(blockNode);
                }
            }
            else if (node) {
                EnergyGridBuilder.connectNodes(this, node);
            }
            else if (EnergyRegistry.isWire(tile.id, this.baseEnergy)) {
                EnergyGridBuilder.buildWireGrid(this.region, x, y, z);
            }
        }
    };
    EnergyGrid.prototype.removeCoords = function (x, y, z) {
        if (this.removed)
            return null;
        var blockNode = this.blockNodes.remove(x, y, z);
        if (!blockNode)
            return null;
        blockNode.resetAdjacentLinks();
        this.rebuild = true;
        return blockNode;
    };
    EnergyGrid.prototype.removeTileNodeLinks = function (tileNode) {
        var removed = false;
        this.blockNodes.forEachNode(function (blockNode) {
            if (blockNode.removeAdjacentLink(tileNode)) {
                removed = true;
            }
        });
        return removed;
    };
    EnergyGrid.prototype.rebuildFor6Sides = function (blockNode) {
        var coord1 = { x: blockNode.x, y: blockNode.y, z: blockNode.z };
        for (var side = 0; side < 6; side++) {
            var coord2 = World.getRelativeCoords(blockNode.x, blockNode.y, blockNode.z, side);
            if (this.canConductEnergy(coord1, coord2, side)) {
                this.rebuildRecursive(coord2.x, coord2.y, coord2.z, side ^ 1);
                this.connectBlockToNeighbor(blockNode, coord2.x, coord2.y, coord2.z, side);
            }
        }
    };
    /**
     * Validates integrity of the grid's structure and splits or removes it if necessary.
     */
    EnergyGrid.prototype.checkAndRebuild = function () {
        this.rebuild = false;
        if (Object.keys(this.blockNodes.data).length == 0) {
            this.resetConnections();
            this.destroy();
            return;
        }
        var splitGrids = this.splitByComponents();
        for (var _i = 0, splitGrids_1 = splitGrids; _i < splitGrids_1.length; _i++) {
            var grid = splitGrids_1[_i];
            grid.rebuildConnectionsFromBlockGraph();
        }
    };
    EnergyGrid.prototype.getFreeCapacity = function (energyName) {
        var freeEnergy = (this.isFull || this.receivers.length == 0) ? 0 : this.energyIn || 1;
        return this.freeCapacity = freeEnergy;
    };
    EnergyGrid.prototype.transferBuffer = function (energyName) {
        if (this.isFull || this.entries.length == 0 || this.receivers.length == 0)
            return;
        var energyPotential = 0;
        var maxPower = 0;
        var inputBuffers = [];
        for (var _i = 0, _a = this.entries; _i < _a.length; _i++) {
            var node = _a[_i];
            if (!node.canProduceEnergy())
                continue;
            var buffer = node.getBuffer(energyName);
            if (buffer && buffer.packetSize > 0) {
                energyPotential += buffer.packetSize;
                if (buffer.power > maxPower) {
                    maxPower = buffer.power;
                }
                inputBuffers.push(buffer);
            }
        }
        this.energyPotential = energyPotential;
        if (energyPotential <= 0)
            return;
        var energyAdd = this.addPacket(energyName, energyPotential, maxPower);
        if (energyAdd <= 0)
            return;
        this.currentPower = Math.max(this.currentPower, maxPower);
        this.currentIn += energyAdd;
        for (var _b = 0, inputBuffers_1 = inputBuffers; _b < inputBuffers_1.length; _b++) {
            var buffer = inputBuffers_1[_b];
            var energyGot = Math.min(buffer.packetSize, energyAdd);
            buffer.amount -= energyGot;
            energyAdd -= energyGot;
            if (buffer.amount < buffer.packetSize) {
                buffer.packetSize = buffer.amount;
            }
            if (buffer.amount == 0) {
                buffer.power = 0;
            }
            if (energyAdd <= 0)
                break;
        }
    };
    EnergyGrid.prototype.tick = function () {
        if (this.rebuild) {
            this.checkAndRebuild();
            if (this.removed)
                return;
        }
        if (this.entries.length == 0 || this.receivers.length == 0) {
            this.idleTicks++;
            if (this.idleTicks > 200) { // destroy after 10 seconds of inactivity
                this.destroy();
                return;
            }
        }
        else {
            this.idleTicks = 0;
        }
        this.transferBuffer(this.baseEnergy);
        _super.prototype.tick.call(this);
    };
    EnergyGrid.prototype.toString = function () {
        var blockCount = Object.keys(this.blockNodes.data).length;
        return "[EnergyGrid id=".concat(this.id, ", type=").concat(this.baseEnergy, ", blocks=").concat(blockCount, ", entries=").concat(this.entries.length, ", receivers=").concat(this.receivers.length, ", energyIn=").concat(this.energyIn, ", energyOut=").concat(this.energyOut, ", power=").concat(this.energyPower, ", buffer=").concat(this.energyPotential, "]");
    };
    EnergyGrid.prototype.connectBlockToNeighbor = function (blockNode, x, y, z, side) {
        var adjacentBlockNode = this.blockNodes.get(x, y, z);
        if (adjacentBlockNode) {
            blockNode.linkBlock(adjacentBlockNode);
            return;
        }
        var node = EnergyNet.getNodeOnCoords(this.region, x, y, z);
        if (!node || !this.isCompatible(node))
            return;
        if (node instanceof EnergyTileNode) {
            var tileSide = side ^ 1;
            blockNode.linkTile(node, node.canEmitEnergy(tileSide, this.baseEnergy), node.canReceiveEnergy(tileSide, this.baseEnergy));
            return;
        }
        if (node instanceof EnergyGrid) {
            var adjacentBlockNode_1 = node.blockNodes.get(x, y, z);
            if (adjacentBlockNode_1) {
                blockNode.linkBlock(adjacentBlockNode_1);
            }
        }
    };
    EnergyGrid.prototype.collectConnectedBlocks = function (startNode, visited) {
        var component = [];
        var stack = [startNode];
        while (stack.length > 0) {
            var blockNode = stack.pop();
            var coordKey = blockNode.getCoordKey();
            if (visited[coordKey] || blockNode.parent != this)
                continue;
            visited[coordKey] = true;
            component.push(blockNode);
            for (var _i = 0, _a = blockNode.adjacentLinks; _i < _a.length; _i++) {
                var link = _a[_i];
                if (!(link.node instanceof BlockNode))
                    continue;
                var adjacentBlock = link.node;
                if (adjacentBlock.parent != this)
                    continue;
                stack.push(adjacentBlock);
            }
        }
        return component;
    };
    EnergyGrid.prototype.createGridComponent = function (component) {
        var wireID = component[0].tile.id;
        var grid = EnergyRegistry.createWireGrid(wireID, this.region);
        for (var _i = 0, component_1 = component; _i < component_1.length; _i++) {
            var blockNode = component_1[_i];
            this.blockNodes.removeNode(blockNode);
            grid.blockNodes.addNode(blockNode);
        }
        EnergyNet.addEnergyNode(grid);
        return grid;
    };
    EnergyGrid.prototype.splitByComponents = function () {
        var _this = this;
        var visited = {};
        var components = [];
        this.blockNodes.forEachNode(function (blockNode) {
            if (visited[blockNode.getCoordKey()])
                return;
            var component = _this.collectConnectedBlocks(blockNode, visited);
            if (component.length > 0) {
                components.push(component);
            }
        });
        if (components.length <= 1) {
            return [this];
        }
        components.sort(function (a, b) { return b.length - a.length; });
        var splitGrids = [this];
        for (var i = 1; i < components.length; i++) {
            var createdGrid = this.createGridComponent(components[i]);
            splitGrids.push(createdGrid);
        }
        return splitGrids;
    };
    EnergyGrid.prototype.reconnectBlockGraph = function () {
        var _this = this;
        this.blockNodes.forEachNode(function (blockNode) {
            var coord1 = { x: blockNode.x, y: blockNode.y, z: blockNode.z };
            for (var side = 0; side < 6; side++) {
                var coord2 = World.getRelativeCoords(blockNode.x, blockNode.y, blockNode.z, side);
                var adjacentBlockNode = _this.blockNodes.get(coord2.x, coord2.y, coord2.z);
                if (adjacentBlockNode && _this.canConductEnergy(coord1, coord2, side)) {
                    blockNode.linkBlock(adjacentBlockNode);
                }
            }
        });
    };
    EnergyGrid.prototype.rebuildConnectionsFromBlockGraph = function () {
        var _this = this;
        this.resetConnections();
        this.blockNodes.forEachNode(function (blockNode) {
            for (var _i = 0, _a = blockNode.adjacentLinks; _i < _a.length; _i++) {
                var link = _a[_i];
                if (link.node instanceof EnergyTileNode) {
                    var tileNode = link.node;
                    if (tileNode.removed)
                        continue;
                    if (link.canOutput) {
                        _this.addConnection(tileNode);
                    }
                    if (link.canInput) {
                        tileNode.addConnection(_this);
                    }
                    continue;
                }
                else if (link.node instanceof BlockNode) {
                    var adjacentGrid = link.node.parent;
                    if (adjacentGrid != _this && !adjacentGrid.removed && _this.isCompatible(adjacentGrid)) {
                        EnergyGridBuilder.connectNodes(_this, adjacentGrid);
                    }
                }
            }
        });
    };
    return EnergyGrid;
}(EnergyNode));
var EnergyTileNode = /** @class */ (function (_super) {
    __extends(EnergyTileNode, _super);
    function EnergyTileNode(energyType, parent) {
        var _this = this;
        var _a;
        var _b;
        _this = _super.call(this, energyType, parent.dimension) || this;
        _this.kind = "tile";
        _this.initialized = false;
        _this.adjacentLinks = [];
        _this.gridConnectionsCount = 0;
        _this.energyAmounts = {};
        _this.tileEntity = parent;
        if (parent.isEnergyProducer()) {
            (_a = (_b = parent.data).energyNetBuffer) !== null && _a !== void 0 ? _a : (_b.energyNetBuffer = {});
            _this.energyAmounts = parent.data.energyNetBuffer;
        }
        return _this;
    }
    EnergyTileNode.createFor = function (tileEntity, energyTypes) {
        var node;
        for (var name in energyTypes) {
            var type = energyTypes[name];
            if (!node) {
                node = new EnergyTileNode(type, tileEntity);
            }
            else {
                node.addEnergyType(type);
            }
        }
        return node;
    };
    EnergyTileNode.prototype.getParent = function () {
        return this.tileEntity;
    };
    EnergyTileNode.prototype.hasCoords = function (x, y, z) {
        return this.tileEntity.x == x && this.tileEntity.y == y && this.tileEntity.z == z;
    };
    EnergyTileNode.prototype.addConnection = function (node) {
        if (_super.prototype.addConnection.call(this, node)) {
            this.gridConnectionsCount = this.receivers.filter(function (n) { return n.kind == "grid"; }).length;
            return true;
        }
        return false;
    };
    /**
     * Removes output connection to specified node
     * @param node receiver node
     */
    EnergyTileNode.prototype.removeConnection = function (node) {
        if (_super.prototype.removeConnection.call(this, node)) {
            this.gridConnectionsCount = this.receivers.filter(function (n) { return n.kind == "grid"; }).length;
            return true;
        }
        return false;
    };
    EnergyTileNode.prototype.linkTile = function (tileNode, canInput, canOutput) {
        if (this.addAdjacentLink(tileNode, canInput, canOutput)) {
            tileNode.addAdjacentLink(this, canOutput, canInput);
        }
    };
    EnergyTileNode.prototype.unlinkTile = function (tileNode) {
        if (this.removeAdjacentLink(tileNode)) {
            tileNode.removeAdjacentLink(this);
        }
    };
    EnergyTileNode.prototype.addAdjacentLink = function (node, canInput, canOutput) {
        for (var _i = 0, _a = this.adjacentLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.node == node)
                return false;
        }
        this.adjacentLinks.push({
            node: node,
            canInput: canInput,
            canOutput: canOutput
        });
        return true;
    };
    EnergyTileNode.prototype.removeAdjacentLink = function (node) {
        var index = this.adjacentLinks.findIndex(function (link) { return link.node == node; });
        if (index == -1)
            return false;
        this.adjacentLinks.splice(index, 1);
        return true;
    };
    EnergyTileNode.prototype.resetAdjacentLinks = function () {
        for (var _i = 0, _a = this.adjacentLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            link.node.removeAdjacentLink(this);
        }
        this.adjacentLinks = [];
    };
    EnergyTileNode.prototype.receiveEnergy = function (amount, packet) {
        if (packet.source == this || this.isFull)
            return 0;
        var energyIn = this.tileEntity.energyReceive(packet.energyName, amount, packet.size);
        if (energyIn < amount && this.isConductor(packet.energyName)) {
            energyIn += this.transferEnergy(amount - energyIn, packet);
        }
        if (energyIn > 0) {
            this.currentPower = Math.max(this.currentPower, packet.size);
            this.currentIn += energyIn;
        }
        else {
            this.isFull = true;
        }
        return energyIn;
    };
    EnergyTileNode.prototype.getFreeCapacity = function (energyName) {
        var freeEnergy = this.isFull ? 0 : this.tileEntity.getFreeEnergyAmount(energyName);
        return this.freeCapacity = freeEnergy;
    };
    EnergyTileNode.prototype.canProduceEnergy = function () {
        return this.tileEntity.isEnergyProducer();
    };
    EnergyTileNode.prototype.isConductor = function (energyName) {
        return this.tileEntity.isConductor(energyName);
    };
    EnergyTileNode.prototype.canReceiveEnergy = function (side, energyName) {
        return this.tileEntity.canReceiveEnergy(side, energyName);
    };
    EnergyTileNode.prototype.canEmitEnergy = function (side, energyName) {
        return this.tileEntity.canEmitEnergy(side, energyName);
    };
    EnergyTileNode.prototype.resetConnections = function () {
        this.resetAdjacentLinks();
        _super.prototype.resetConnections.call(this);
    };
    EnergyTileNode.prototype.add = function (amount, power) {
        if (power === void 0) { power = amount; }
        if (amount == 0)
            return 0;
        var energyOut = 0;
        var leftAmount = amount;
        var activeReceivers = this.getActiveReceivers();
        var tileReceivers = activeReceivers.filter(function (n) { return n.kind == "tile"; });
        var gridConnectionsCount = activeReceivers.length - tileReceivers.length;
        // try to split energy evenly between grids and direct connections
        if (gridConnectionsCount > 0 && tileReceivers.length > 0) {
            var energyAdd = Math.floor(leftAmount * gridConnectionsCount / activeReceivers.length);
            if (energyAdd > 0) {
                energyOut = this.addToBuffer(this.baseEnergy, energyAdd, amount, power);
                leftAmount -= energyOut;
            }
        }
        if (tileReceivers.length > 0) {
            energyOut += this.addPacket(this.baseEnergy, leftAmount, power, 1 /* TransferMode.Split */, tileReceivers);
            leftAmount -= energyOut;
        }
        if (gridConnectionsCount > 0 && leftAmount > 0) {
            energyOut += this.addToBuffer(this.baseEnergy, leftAmount, amount, power);
        }
        return amount - energyOut;
    };
    EnergyTileNode.prototype.addToBuffer = function (energyName, amount, size, power) {
        if (power === void 0) { power = size; }
        var energyBuffer = this.getBuffer(energyName, true);
        size *= this.gridConnectionsCount; // reserve space for 1 packet per connected grid
        if (energyBuffer.amount < size) {
            var energyAdd = Math.min(size - energyBuffer.amount, amount);
            energyBuffer.amount += energyAdd;
            energyBuffer.power = power;
            energyBuffer.packetSize = Math.ceil(energyBuffer.amount / this.gridConnectionsCount);
            this.currentPower = Math.max(this.currentPower, power);
            this.currentOut += energyAdd;
            return energyAdd;
        }
        return 0;
    };
    EnergyTileNode.prototype.getBuffer = function (energyName, createIfNotFound) {
        var _a;
        var _b;
        if (createIfNotFound) {
            (_a = (_b = this.energyAmounts)[energyName]) !== null && _a !== void 0 ? _a : (_b[energyName] = { amount: 0, power: 0, packetSize: 0 });
        }
        return this.energyAmounts[energyName] || null;
    };
    EnergyTileNode.prototype.init = function () {
        EnergyGridBuilder.buildGridForTile(this.tileEntity);
        this.initialized = true;
    };
    EnergyTileNode.prototype.tick = function () {
        if (!this.tileEntity.__initialized || !this.tileEntity.isLoaded)
            return;
        if (!this.initialized) {
            this.init();
        }
        this.tileEntity.energyTick(this.baseEnergy, this);
        _super.prototype.tick.call(this);
    };
    return EnergyTileNode;
}(EnergyNode));
var EnergyTileRegistry;
(function (EnergyTileRegistry) {
    /** Adds energy type for tile entity prototype */
    function addEnergyType(Prototype, energyType) {
        if (!Prototype.isEnergyTile) {
            setupAsEnergyTile(Prototype);
        }
        Prototype.energyTypes[energyType.name] = energyType;
    }
    EnergyTileRegistry.addEnergyType = addEnergyType;
    /** Same as addEnergyType, but works on already created prototypes, accessing them by id */
    function addEnergyTypeForId(id, energyType) {
        var Prototype = TileEntity.getPrototype(id);
        if (Prototype) {
            addEnergyType(Prototype, energyType);
        }
        else {
            Logger.Log("cannot add energy type no prototype defined for id " + id, "ERROR");
        }
    }
    EnergyTileRegistry.addEnergyTypeForId = addEnergyTypeForId;
    /**
     * Adds default EnergyTile interface implementation for tile entity prototype.
     * @param Prototype tile entity prototype
     */
    function setupAsEnergyTile(Prototype) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        Prototype.isEnergyTile = true;
        Prototype.energyTypes = {};
        (_a = Prototype.energyTick) !== null && _a !== void 0 ? _a : (Prototype.energyTick = function () { });
        (_b = Prototype.energyReceive) !== null && _b !== void 0 ? _b : (Prototype.energyReceive = function () {
            return 0;
        });
        // if prototype has energy buffer add method to get free amount
        if (Prototype.defaultValues && typeof Prototype.defaultValues.energy == "number" && Prototype.getEnergyStorage) {
            (_c = Prototype.getFreeEnergyAmount) !== null && _c !== void 0 ? _c : (Prototype.getFreeEnergyAmount = function () {
                var storage = this.getEnergyStorage();
                if (storage > this.data.energy) {
                    return storage - this.data.energy;
                }
                return 0;
            });
        }
        else {
            (_d = Prototype.getFreeEnergyAmount) !== null && _d !== void 0 ? _d : (Prototype.getFreeEnergyAmount = function () {
                return this.energyNode.energyIn || 1;
            });
        }
        // Returns true for reverse compatibility
        (_e = Prototype.isEnergyProducer) !== null && _e !== void 0 ? _e : (Prototype.isEnergyProducer = function () {
            return true;
        });
        (_f = Prototype.isConductor) !== null && _f !== void 0 ? _f : (Prototype.isConductor = function () {
            return false;
        });
        (_g = Prototype.canReceiveEnergy) !== null && _g !== void 0 ? _g : (Prototype.canReceiveEnergy = function () {
            return true;
        });
        (_h = Prototype.canEmitEnergy) !== null && _h !== void 0 ? _h : (Prototype.canEmitEnergy = Prototype.canExtractEnergy || function () {
            return true;
        });
    }
    EnergyTileRegistry.setupAsEnergyTile = setupAsEnergyTile;
})(EnergyTileRegistry || (EnergyTileRegistry = {}));
;
Callback.addCallback("TileEntityAdded", function (tileEntity) {
    if (tileEntity.isEnergyTile && typeof tileEntity.energyTypes == "object") {
        var node = EnergyTileNode.createFor(tileEntity, tileEntity.energyTypes);
        tileEntity.energyNode = node;
        EnergyNet.addEnergyNode(node);
    }
});
Callback.addCallback("TileEntityRemoved", function (tileEntity) {
    if (tileEntity.energyNode) {
        tileEntity.energyNode.destroy();
    }
});
var EnergyGridBuilder;
(function (EnergyGridBuilder) {
    function connectNodes(node1, node2) {
        node1.addConnection(node2);
        node2.addConnection(node1);
    }
    EnergyGridBuilder.connectNodes = connectNodes;
    function connectTileToGridBlock(grid, x, y, z, side, tileNode) {
        var blockNode = grid.blockNodes.get(x, y, z);
        if (blockNode) {
            var energyType = grid.baseEnergy;
            blockNode.linkTile(tileNode, tileNode.canEmitEnergy(side, energyType), tileNode.canReceiveEnergy(side, energyType));
        }
    }
    function buildGridForTile(te) {
        var tileNode = te.energyNode;
        for (var side = 0; side < 6; side++) {
            var coords = World.getRelativeCoords(te.x, te.y, te.z, side);
            var node = EnergyNet.getNodeOnCoords(te.blockSource, coords.x, coords.y, coords.z);
            if (node && tileNode.isCompatible(node)) {
                if (node instanceof EnergyGrid) {
                    connectTileToGridBlock(node, coords.x, coords.y, coords.z, side, tileNode);
                }
                var energyType = node.baseEnergy;
                var canOutput = tileNode.canEmitEnergy(side, energyType) && node.canReceiveEnergy(side ^ 1, energyType);
                var canInput = tileNode.canReceiveEnergy(side, energyType) && node.canEmitEnergy(side ^ 1, energyType);
                if (node instanceof EnergyTileNode && (canInput || canOutput)) {
                    tileNode.linkTile(node, canInput, canOutput);
                }
                if (canOutput) {
                    tileNode.addConnection(node);
                }
                if (canInput) {
                    node.addConnection(tileNode);
                }
            }
            else {
                buildWireGrid(te.blockSource, coords.x, coords.y, coords.z);
            }
        }
    }
    EnergyGridBuilder.buildGridForTile = buildGridForTile;
    function buildWireGrid(region, x, y, z) {
        var blockID = region.getBlockId(x, y, z);
        if (EnergyRegistry.isWire(blockID)) {
            var startTime = Debug.sysTime();
            var grid = EnergyRegistry.createWireGrid(blockID, region);
            EnergyNet.addEnergyNode(grid);
            grid.rebuildRecursive(x, y, z);
            var spendTime = Debug.sysTime() - startTime;
            if (EnergyNet.debugEnabled) {
                var blockCount = Object.keys(grid.blockNodes.data).length;
                Game.message("\u00A72[EnergyNet] Built wire grid id=".concat(grid.id, ", blocks=").concat(blockCount, ", entries=").concat(grid.entries.length, ", receivers=").concat(grid.receivers.length, " in ").concat(spendTime, " ms."));
            }
            return grid;
        }
        return null;
    }
    EnergyGridBuilder.buildWireGrid = buildWireGrid;
    function rebuildWireGrid(region, x, y, z) {
        var node = EnergyNet.getNodeOnCoords(region, x, y, z);
        if (node) {
            node.destroy();
            EnergyGridBuilder.buildWireGrid(region, x, y, z);
        }
    }
    EnergyGridBuilder.rebuildWireGrid = rebuildWireGrid;
    function onWirePlaced(region, x, y, z) {
        var tile = region.getBlock(x, y, z);
        var coord1 = { x: x, y: y, z: z };
        for (var side = 0; side < 6; side++) {
            var coord2 = World.getRelativeCoords(x, y, z, side);
            var node = EnergyNet.getNodeOnCoords(region, coord2.x, coord2.y, coord2.z);
            if (node && node instanceof EnergyGrid && node.isValidWire(tile) && node.canConductEnergy(coord2, coord1, side ^ 1)) {
                node.rebuildRecursive(x, y, z, side ^ 1);
                return;
            }
        }
        EnergyGridBuilder.buildWireGrid(region, x, y, z);
    }
    EnergyGridBuilder.onWirePlaced = onWirePlaced;
    Callback.addCallback("DestroyBlock", function (coords, block, player) {
        if (EnergyRegistry.isWire(block.id)) {
            var region = BlockSource.getDefaultForActor(player);
            var node = EnergyNet.getNodeOnCoords(region, coords.x, coords.y, coords.z);
            if (node instanceof EnergyGrid) {
                node.removeCoords(coords.x, coords.y, coords.z);
            }
        }
    });
    Callback.addCallback("PopBlockResources", function (coords, block, f, i, region) {
        if (EnergyRegistry.isWire(block.id)) {
            var node = EnergyNet.getNodeOnCoords(region, coords.x, coords.y, coords.z);
            if (node) {
                node.removeCoords(coords.x, coords.y, coords.z);
            }
        }
    });
})(EnergyGridBuilder || (EnergyGridBuilder = {}));
var EnergyNet;
(function (EnergyNet) {
    EnergyNet.globalNodeID = 0;
    /**
     * EnergyNodes container.
     * @key dimension id
     */
    var energyNodes = {};
    var pendingRemoval = [];
    function getNodesByDimension(dimension) {
        return energyNodes[dimension] = energyNodes[dimension] || {
            energyTiles: [],
            energyGrids: []
        };
    }
    function addEnergyNode(node) {
        var nodes = getNodesByDimension(node.dimension);
        if (node.kind == "grid") {
            nodes.energyGrids.push(node);
        }
        else if (node.kind == "tile") {
            nodes.energyTiles.push(node);
        }
    }
    EnergyNet.addEnergyNode = addEnergyNode;
    function removeEnergyNode(node) {
        var nodes = getNodesByDimension(node.dimension);
        var nodeArray = node.kind == "grid" ? nodes.energyGrids : nodes.energyTiles;
        var index = nodeArray.indexOf(node);
        if (index != -1) {
            nodeArray.splice(index, 1);
            if (EnergyNet.debugEnabled && node.kind == "grid") {
                Game.message("\u00A74[EnergyNet] Removed wire grid with id ".concat(node.id, "."));
            }
        }
    }
    EnergyNet.removeEnergyNode = removeEnergyNode;
    function enqueueRemoval(node) {
        if (pendingRemoval.includes(node))
            return;
        pendingRemoval.push(node);
    }
    EnergyNet.enqueueRemoval = enqueueRemoval;
    function flushRemovals() {
        if (pendingRemoval.length == 0)
            return;
        for (var _i = 0, pendingRemoval_1 = pendingRemoval; _i < pendingRemoval_1.length; _i++) {
            var node = pendingRemoval_1[_i];
            node.resetConnections();
            removeEnergyNode(node);
        }
        pendingRemoval = [];
    }
    EnergyNet.flushRemovals = flushRemovals;
    function getNodeOnCoords(region, x, y, z) {
        var tileEntity = TileEntity.getTileEntity(x, y, z, region);
        if (tileEntity) {
            if (tileEntity.__initialized && tileEntity.energyNode) {
                return tileEntity.energyNode;
            }
            return null;
        }
        var nodes = getNodesByDimension(region.getDimension());
        for (var _i = 0, _a = nodes.energyGrids; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.removed)
                continue;
            if (node.hasCoords(x, y, z))
                return node;
        }
        return null;
    }
    EnergyNet.getNodeOnCoords = getNodeOnCoords;
    function energyNodesTick() {
        for (var dimension in energyNodes) {
            var nodes = energyNodes[dimension];
            for (var _i = 0, _a = nodes.energyTiles; _i < _a.length; _i++) {
                var node = _a[_i];
                node.tick();
            }
            for (var _b = 0, _c = nodes.energyGrids; _b < _c.length; _b++) {
                var node = _c[_b];
                node.tick();
            }
        }
    }
    // Debug utilities
    EnergyNet.debugEnabled = false;
    var debugTickCounter = 0;
    var debugEnergyTickTime = 0;
    var debugMaxEnergyTickTime = 0;
    var debugWindowStart = 0;
    function setDebugEnabled(enabled) {
        EnergyNet.debugEnabled = enabled;
        debugTickCounter = 0;
        debugEnergyTickTime = 0;
        debugMaxEnergyTickTime = 0;
        debugWindowStart = 0;
        Game.message("[EnergyNet] Debug ".concat(enabled ? "enabled" : "disabled", "."));
    }
    function handleNativeCommand(command) {
        if (!command || !command.startsWith("/enet debug"))
            return;
        var args = command.split(" ");
        if (args[2] == "on") {
            setDebugEnabled(true);
        }
        else if (args[2] == "off") {
            setDebugEnabled(false);
        }
        else {
            Game.message("Invalid args. Usage: /enet debug <on|off>");
        }
        Game.prevent();
    }
    function trackDebugTick(duration) {
        if (!EnergyNet.debugEnabled)
            return;
        if (debugTickCounter == 0) {
            debugWindowStart = Debug.sysTime();
        }
        debugTickCounter++;
        debugEnergyTickTime += duration;
        debugMaxEnergyTickTime = Math.max(debugMaxEnergyTickTime, duration);
        if (debugTickCounter >= 20) {
            var elapsed = Debug.sysTime() - debugWindowStart;
            var averageTps = elapsed > 0 ? debugTickCounter * 1000 / elapsed : 0;
            var averageEnergyTick = debugEnergyTickTime / debugTickCounter;
            Game.tipMessage("\u00A72[EnergyNet] avg tps: ".concat(+averageTps.toFixed(2), ", enet tick: ").concat(+averageEnergyTick.toFixed(2), " ms avg, ").concat(+debugMaxEnergyTickTime.toFixed(2), " ms max"));
            debugTickCounter = 0;
            debugEnergyTickTime = 0;
            debugMaxEnergyTickTime = 0;
            debugWindowStart = 0;
        }
    }
    Callback.addCallback("LevelLeft", function () {
        energyNodes = {};
        EnergyNet.globalNodeID = 0;
        EnergyNet.debugEnabled = false;
        debugTickCounter = 0;
        debugEnergyTickTime = 0;
        debugMaxEnergyTickTime = 0;
        debugWindowStart = 0;
    });
    Callback.addCallback("NativeCommand", function (command) {
        handleNativeCommand(command);
    });
    Callback.addCallback("tick", function () {
        var startTime = Debug.sysTime();
        energyNodesTick();
        flushRemovals();
        trackDebugTick(Debug.sysTime() - startTime);
    });
})(EnergyNet || (EnergyNet = {}));
EXPORT("EnergyTypeRegistry", EnergyRegistry);
EXPORT("EnergyTileRegistry", EnergyTileRegistry);
EXPORT("BlockNode", BlockNode);
EXPORT("EnergyNode", EnergyNode);
EXPORT("EnergyTileNode", EnergyTileNode);
EXPORT("EnergyGrid", EnergyGrid);
EXPORT("EnergyGridBuilder", EnergyGridBuilder);
EXPORT("EnergyNet", EnergyNet);
