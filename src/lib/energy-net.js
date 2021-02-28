var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
    version: 7,
    shared: true,
    api: "CoreEngine"
});
Translation.addTranslation("Energy", { ru: "Энергия", zh: "能量" });
var EnergyRegistry;
(function (EnergyRegistry) {
    EnergyRegistry.energyTypes = {};
    EnergyRegistry.wireData = {};
    /**
     * name - name of this energy type,
     * value - value of one unit in [Eu] (IC2 Energy)
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
            Logger.Log("get energy value ratio failed: some of this 2 energy types is not defiled: " + [name1, name2], "ERROR");
            return -1;
        }
    }
    EnergyRegistry.getValueRatio = getValueRatio;
    function getWireData(blockID) {
        return EnergyRegistry.wireData[blockID];
    }
    EnergyRegistry.getWireData = getWireData;
    function registerWire(blockID, type, maxValue, energyGridClass) {
        if (energyGridClass === void 0) { energyGridClass = EnergyGrid; }
        EnergyRegistry.wireData[blockID] = {
            type: type,
            maxValue: maxValue,
            class: energyGridClass
        };
    }
    EnergyRegistry.registerWire = registerWire;
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
            var place = coords.relative;
            if (region.getBlockId(place.x, place.y, place.z) == 0) {
                region.setBlock(place.x, place.y, place.z, item.id, item.data);
                if (Game.isItemSpendingAllowed(player)) {
                    Entity.setCarriedItem(player, item.id, item.count - 1, item.data);
                }
                EnergyGridBuilder.onWirePlaced(region, place.x, place.y, place.z);
            }
        });
    };
    return EnergyType;
}());
var EnergyPacket = /** @class */ (function () {
    function EnergyPacket(energyName, size, source) {
        this.passedNodes = {};
        this.energyName = energyName;
        this.size = size;
        this.source = source;
        this.passedNodes[source.id] = true;
    }
    EnergyPacket.prototype.validateNode = function (nodeId) {
        if (this.passedNodes[nodeId])
            return false;
        this.passedNodes[nodeId] = true;
        return true;
    };
    return EnergyPacket;
}());
var GLOBAL_NODE_ID = 0;
var EnergyNode = /** @class */ (function () {
    function EnergyNode(energyType, dimension) {
        this.energyTypes = {};
        this.maxValue = 2e9;
        this.initialized = false;
        this.removed = false;
        this.blocksMap = {};
        this.entries = [];
        this.receivers = [];
        this.energyIn = 0;
        this.currentIn = 0;
        this.energyOut = 0;
        this.currentOut = 0;
        this.energyPower = 0;
        this.currentPower = 0;
        this.id = GLOBAL_NODE_ID++;
        this.baseEnergy = energyType.name;
        this.addEnergyType(energyType);
        this.dimension = dimension;
    }
    EnergyNode.prototype.addEnergyType = function (energyType) {
        this.energyTypes[energyType.name] = energyType;
    };
    EnergyNode.prototype.addCoords = function (x, y, z) {
        this.blocksMap[x + ":" + y + ":" + z] = true;
    };
    EnergyNode.prototype.removeCoords = function (x, y, z) {
        delete this.blocksMap[x + ":" + y + ":" + z];
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
     * @returns true if link to the node was removed, false if it already removed
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
     */
    EnergyNode.prototype.addConnection = function (node) {
        if (this.addReceiver(node)) {
            node.addEntry(this);
        }
    };
    /**
     * Removes output connection to specified node
     * @param node receiver node
     */
    EnergyNode.prototype.removeConnection = function (node) {
        if (this.removeReceiver(node)) {
            node.removeEntry(this);
        }
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
        var energyIn = this.transferEnergy(amount, packet);
        if (energyIn > 0) {
            this.currentPower = Math.max(this.currentPower, packet.size);
            this.currentIn += energyIn;
        }
        return energyIn;
    };
    EnergyNode.prototype.add = function (amount, power) {
        if (power === void 0) { power = amount; }
        var add = this.addPacket(this.baseEnergy, amount, power);
        return amount - add;
    };
    EnergyNode.prototype.addPacket = function (energyName, amount, size) {
        var packet = new EnergyPacket(energyName, size, this);
        return this.transferEnergy(amount, packet);
    };
    EnergyNode.prototype.transferEnergy = function (amount, packet) {
        if (this.receivers.length == 0)
            return 0;
        var receivedAmount = amount;
        if (packet.size > this.maxValue) {
            amount = Math.min(amount, packet.size);
            this.onOverload(packet.size);
        }
        var receiversCount = this.receivers.length;
        for (var i = 0; i < receiversCount; i++) {
            var node = this.receivers[i];
            if (amount <= 0)
                break;
            if (packet.validateNode(node.id)) {
                amount -= node.receiveEnergy(Math.ceil(amount / (receiversCount - i)), packet);
            }
        }
        for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
            var node = _a[_i];
            if (amount <= 0)
                break;
            if (packet.validateNode(node.id)) {
                amount -= node.receiveEnergy(amount, packet);
            }
        }
        var energyOut = receivedAmount - amount;
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
    EnergyNode.prototype.isConductor = function (type) {
        return true;
    };
    EnergyNode.prototype.canReceiveEnergy = function (side, type) {
        return true;
    };
    EnergyNode.prototype.canExtractEnergy = function (side, type) {
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
    EnergyNode.prototype.init = function () {
    };
    EnergyNode.prototype.tick = function () {
        this.energyIn = this.currentIn;
        this.currentIn = 0;
        this.energyOut = this.currentOut;
        this.currentOut = 0;
        this.energyPower = this.currentPower;
        this.currentPower = 0;
    };
    EnergyNode.prototype.destroy = function () {
        this.removed = true;
        this.resetConnections();
        EnergyNet.removeEnergyNode(this);
    };
    EnergyNode.prototype.toString = function () {
        return "[EnergyNode id=" + this.id + ", type=" + this.baseEnergy + ", entries=" + this.entries.length + ", receivers=" + this.receivers.length + ", energyIn=" + this.energyIn + ", energyOut=" + this.energyOut + ", power=" + this.energyPower + "]";
    };
    return EnergyNode;
}());
var EnergyGrid = /** @class */ (function (_super) {
    __extends(EnergyGrid, _super);
    function EnergyGrid(energyType, maxValue, wireID, region) {
        var _this = _super.call(this, energyType, region.getDimension()) || this;
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
    EnergyGrid.prototype.mergeGrid = function (grid) {
        for (var key in grid.blocksMap) {
            this.blocksMap[key] = true;
        }
        for (var _i = 0, _a = grid.entries; _i < _a.length; _i++) {
            var node = _a[_i];
            node.addConnection(this);
        }
        for (var _b = 0, _c = grid.receivers; _b < _c.length; _b++) {
            var node = _c[_b];
            this.addConnection(node);
        }
        grid.destroy();
        return this;
    };
    EnergyGrid.prototype.rebuildRecursive = function (x, y, z, side) {
        if (this.removed)
            return;
        var coordKey = x + ":" + y + ":" + z;
        if (this.blocksMap[coordKey]) {
            return;
        }
        var node = EnergyNet.getNodeOnCoords(this.region, x, y, z);
        if (node && !this.isCompatible(node))
            return;
        if (node instanceof EnergyTileNode) {
            if (node.canReceiveEnergy(side, this.baseEnergy)) {
                this.addConnection(node);
            }
            if (node.canExtractEnergy(side, this.baseEnergy)) {
                node.addConnection(this);
            }
        }
        else {
            var blockID = this.region.getBlockId(x, y, z);
            if (this.blockID == blockID) {
                if (node) {
                    this.mergeGrid(node);
                }
                else {
                    this.blocksMap[coordKey] = true;
                    this.rebuildFor6Sides(x, y, z);
                }
            }
            else if (node) {
                EnergyGridBuilder.connectNodes(this, node);
            }
            else if (EnergyRegistry.isWire(blockID, this.baseEnergy)) {
                EnergyGridBuilder.buildWireGrid(this.region, x, y, z);
            }
        }
    };
    EnergyGrid.prototype.rebuildFor6Sides = function (x, y, z) {
        var coord1 = { x: x, y: y, z: z };
        for (var side = 0; side < 6; side++) {
            var coord2 = World.getRelativeCoords(x, y, z, side);
            if (this.canConductEnergy(coord1, coord2, side)) {
                this.rebuildRecursive(coord2.x, coord2.y, coord2.z, side ^ 1);
            }
        }
    };
    return EnergyGrid;
}(EnergyNode));
var EnergyTileNode = /** @class */ (function (_super) {
    __extends(EnergyTileNode, _super);
    function EnergyTileNode(energyType, parent) {
        var _this = _super.call(this, energyType, parent.dimension) || this;
        _this.tileEntity = parent;
        return _this;
    }
    EnergyTileNode.prototype.getParent = function () {
        return this.tileEntity;
    };
    EnergyTileNode.prototype.receiveEnergy = function (amount, packet) {
        var energyIn = this.tileEntity.energyReceive(packet.energyName, amount, packet.size);
        if (energyIn < amount && this.isConductor(packet.energyName)) {
            energyIn += this.transferEnergy(amount - energyIn, packet);
        }
        if (energyIn > 0) {
            this.currentPower = Math.max(this.currentPower, packet.size);
            this.currentIn += energyIn;
        }
        return energyIn;
    };
    EnergyTileNode.prototype.isConductor = function (type) {
        return this.tileEntity.isConductor(type);
    };
    EnergyTileNode.prototype.canReceiveEnergy = function (side, type) {
        return this.tileEntity.canReceiveEnergy(side, type);
    };
    EnergyTileNode.prototype.canExtractEnergy = function (side, type) {
        return this.tileEntity.canExtractEnergy(side, type);
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
    // adds energy type for tile entity prototype
    function addEnergyType(Prototype, energyType) {
        if (!Prototype.isEnergyTile) {
            setupAsEnergyTile(Prototype);
        }
        Prototype.energyTypes[energyType.name] = energyType;
    }
    EnergyTileRegistry.addEnergyType = addEnergyType;
    // same as addEnergyType, but works on already created prototypes, accessing them by id
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
    function setupAsEnergyTile(Prototype) {
        Prototype.isEnergyTile = true;
        Prototype.energyTypes = {};
        Prototype.energyTick = Prototype.energyTick || function () { };
        Prototype.energyReceive = Prototype.energyReceive || function () {
            return 0;
        };
        Prototype.isConductor = Prototype.isConductor || function () {
            return false;
        };
        Prototype.canReceiveEnergy = Prototype.canReceiveEnergy || function () {
            return true;
        };
        if (!Prototype.canExtractEnergy) {
            if (Prototype.isEnergySource) {
                Prototype.canExtractEnergy = function () {
                    return true;
                };
            }
            else {
                Prototype.canExtractEnergy = function () {
                    return false;
                };
            }
        }
    }
    EnergyTileRegistry.setupAsEnergyTile = setupAsEnergyTile;
    /* machine is tile entity, that uses energy */
    EnergyTileRegistry.machineIDs = {};
    function isMachine(id) {
        return !!EnergyTileRegistry.machineIDs[id];
    }
    EnergyTileRegistry.isMachine = isMachine;
})(EnergyTileRegistry || (EnergyTileRegistry = {}));
;
Callback.addCallback("TileEntityAdded", function (tileEntity) {
    if (tileEntity.isEnergyTile) {
        var node = void 0;
        for (var name in tileEntity.energyTypes) {
            var type = tileEntity.energyTypes[name];
            if (!node)
                node = new EnergyTileNode(type, tileEntity);
            else
                node.addEnergyType(type);
        }
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
    function buildGridForTile(te) {
        var tileNode = te.energyNode;
        var energyType = tileNode.baseEnergy;
        for (var side = 0; side < 6; side++) {
            var c = World.getRelativeCoords(te.x, te.y, te.z, side);
            var node = EnergyNet.getNodeOnCoords(te.blockSource, c.x, c.y, c.z);
            if (node && tileNode.isCompatible(node)) {
                if (tileNode.canExtractEnergy(side, energyType) && node.canReceiveEnergy(side ^ 1, energyType)) {
                    tileNode.addConnection(node);
                }
                if (tileNode.canReceiveEnergy(side, energyType) && node.canExtractEnergy(side ^ 1, energyType)) {
                    node.addConnection(tileNode);
                }
            }
            else {
                buildWireGrid(te.blockSource, c.x, c.y, c.z);
            }
        }
    }
    EnergyGridBuilder.buildGridForTile = buildGridForTile;
    function buildWireGrid(region, x, y, z) {
        var blockID = region.getBlockId(x, y, z);
        var wire = EnergyRegistry.getWireData(blockID);
        if (wire) {
            var grid = new wire.class(wire.type, wire.value, blockID, region);
            EnergyNet.addEnergyNode(grid);
            grid.rebuildRecursive(x, y, z);
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
    function rebuildForWire(region, x, y, z, wireID) {
        if (region.getBlockId(x, y, z) == wireID) {
            return buildWireGrid(region, x, y, z);
        }
        return null;
    }
    EnergyGridBuilder.rebuildForWire = rebuildForWire;
    function onWirePlaced(region, x, y, z) {
        var blockId = region.getBlockId(x, y, z);
        var coord1 = { x: x, y: y, z: z };
        for (var side = 0; side < 6; side++) {
            var coord2 = World.getRelativeCoords(x, y, z, side);
            if (region.getBlockId(coord2.x, coord2.y, coord2.z) != blockId)
                continue;
            var node = EnergyNet.getNodeOnCoords(region, coord2.x, coord2.y, coord2.z);
            if (node && node instanceof EnergyGrid && node.canConductEnergy(coord2, coord1, side ^ 1)) {
                node.rebuildRecursive(x, y, z, side ^ 1);
                return;
            }
        }
        EnergyGridBuilder.buildWireGrid(region, x, y, z);
    }
    EnergyGridBuilder.onWirePlaced = onWirePlaced;
    function onWireDestroyed(region, x, y, z, id) {
        var node = EnergyNet.getNodeOnCoords(region, x, y, z);
        if (node) {
            node.destroy();
            EnergyGridBuilder.rebuildForWire(region, x - 1, y, z, id);
            EnergyGridBuilder.rebuildForWire(region, x + 1, y, z, id);
            EnergyGridBuilder.rebuildForWire(region, x, y - 1, z, id);
            EnergyGridBuilder.rebuildForWire(region, x, y + 1, z, id);
            EnergyGridBuilder.rebuildForWire(region, x, y, z - 1, id);
            EnergyGridBuilder.rebuildForWire(region, x, y, z + 1, id);
        }
    }
    EnergyGridBuilder.onWireDestroyed = onWireDestroyed;
    Callback.addCallback("DestroyBlock", function (coords, block, player) {
        if (EnergyRegistry.isWire(block.id)) {
            var region = BlockSource.getDefaultForActor(player);
            onWireDestroyed(region, coords.x, coords.y, coords.z, block.id);
        }
    });
})(EnergyGridBuilder || (EnergyGridBuilder = {}));
var EnergyNet;
(function (EnergyNet) {
    /**
     * EnergyNodes container.
     * @key dimension id
     */
    var energyNodes = {};
    function getNodesByDimension(dimension) {
        return energyNodes[dimension] = energyNodes[dimension] || [];
    }
    EnergyNet.getNodesByDimension = getNodesByDimension;
    function addEnergyNode(node) {
        getNodesByDimension(node.dimension).push(node);
    }
    EnergyNet.addEnergyNode = addEnergyNode;
    function removeEnergyNode(node) {
        var nodes = getNodesByDimension(node.dimension);
        var index = nodes.indexOf(node);
        if (index != -1) {
            nodes.splice(index, 1);
        }
    }
    EnergyNet.removeEnergyNode = removeEnergyNode;
    function getNodeOnCoords(region, x, y, z) {
        var tileEntity = TileEntity.getTileEntity(x, y, z, region);
        if (tileEntity && tileEntity.__initialized && tileEntity.energyNode) {
            return tileEntity.energyNode;
        }
        var nodes = getNodesByDimension(region.getDimension());
        var coordKey = x + ":" + y + ":" + z;
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            if (node.blocksMap[coordKey])
                return node;
        }
        return null;
    }
    EnergyNet.getNodeOnCoords = getNodeOnCoords;
    function energyNodesTick() {
        for (var dimension in energyNodes) {
            for (var _i = 0, _a = energyNodes[dimension]; _i < _a.length; _i++) {
                var node = _a[_i];
                node.tick();
            }
        }
    }
    Callback.addCallback("LevelLeft", function () {
        energyNodes = {};
        GLOBAL_NODE_ID = 0;
    });
    Callback.addCallback("tick", function () {
        energyNodesTick();
    });
})(EnergyNet || (EnergyNet = {}));
EXPORT("EnergyTypeRegistry", EnergyRegistry);
EXPORT("EnergyTileRegistry", EnergyTileRegistry);
EXPORT("EnergyNode", EnergyNode);
EXPORT("EnergyGrid", EnergyGrid);
EXPORT("EnergyGridBuilder", EnergyGridBuilder);
EXPORT("EnergyNet", EnergyNet);
