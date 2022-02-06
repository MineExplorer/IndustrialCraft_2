/// <reference path="./core-engine.d.ts" />

declare namespace EnergyTypeRegistry {
    type WireData = {
        type: EnergyType;
        maxValue: number;
        class: typeof EnergyGrid;
    };
    let energyTypes: {
        [key: number]: EnergyType;
    };
    let wireData: {
        [key: number]: WireData;
    };
    /**
     * name - name of this energy type,
     * value - value of one unit in [Eu] (IC2 Energy)
    */
    function createEnergyType(name: string, value: number): EnergyType;
    function assureEnergyType(name: string, value: number): EnergyType;
    function getEnergyType(name: string): EnergyType;
    function getValueRatio(name1: string, name2: string): number;
    function registerWire(blockID: number, type: EnergyType, maxValue: number, energyGridClass?: typeof EnergyGrid): void;
    function getWireData(blockID: number): WireData;
    function isWire(blockID: number, type?: string): boolean;
}
declare class EnergyType {
    name: string;
    value: number;
    constructor(name: string, value?: number);
    registerWire(id: number, maxValue: number, energyGridClass?: typeof EnergyGrid): void;
}
declare class EnergyPacket {
    energyName: string;
    size: number;
    source: EnergyNode;
    nodeList: object;
    constructor(energyName: string, size: number, source: EnergyNode);
    validateNode(nodeId: number): boolean;
    setNodePassed(nodeId: number): void;
}
declare class EnergyNode {
    id: number;
    baseEnergy: string;
    energyTypes: object;
    dimension: number;
    maxValue: number;
    removed: boolean;
    blocksMap: object;
    entries: EnergyNode[];
    receivers: EnergyNode[];
    energyIn: number;
    currentIn: number;
    energyOut: number;
    currentOut: number;
    energyPower: number;
    currentPower: number;
    constructor(energyType: EnergyType, dimension: number);
    addEnergyType(energyType: EnergyType): void;
    addCoords(x: number, y: number, z: number): void;
    removeCoords(x: number, y: number, z: number): void;
    private addEntry;
    private removeEntry;
    /**
     * @param node receiver node
     * @returns true if link to the node was added, false if it already exists
     */
    private addReceiver;
    /**
     * @param node receiver node
     * @returns true if link to the node was removed, false if it's already removed
     */
    private removeReceiver;
    /**
     * Adds output connection to specified node
     * @param node receiver node
     */
    addConnection(node: EnergyNode): void;
    /**
     * Removes output connection to specified node
     * @param node receiver node
     */
    removeConnection(node: EnergyNode): void;
    resetConnections(): void;
    receiveEnergy(amount: number, packet: EnergyPacket): number;
    add(amount: number, power?: number): number;
    addPacket(energyName: string, amount: number, size?: number): number;
    transferEnergy(amount: number, packet: EnergyPacket): number;
    /** @deprecated */
    addAll(amount: number, power?: number): void;
    onOverload(packetSize: number): void;
    isConductor(type: string): boolean;
    canReceiveEnergy(side: number, type: string): boolean;
    canExtractEnergy(side: number, type: string): boolean;
    canConductEnergy(coord1: Vector, coord2: Vector, side: number): boolean;
    isCompatible(node: EnergyNode): boolean;
    tick(): void;
    destroy(): void;
    toString(): string;
}
declare class EnergyGrid extends EnergyNode {
    blockID: number;
    region: BlockSource;
    rebuild: boolean;
    constructor(energyType: EnergyType, maxValue: number, wireID: number, region: BlockSource);
    isCompatible(node: EnergyNode): boolean;
    mergeGrid(grid: EnergyNode): EnergyNode;
    rebuildGrid(): void;
    rebuildRecursive(x: number, y: number, z: number, side?: number): void;
    rebuildFor6Sides(x: number, y: number, z: number): void;
    tick(): void;
}
declare class EnergyTileNode extends EnergyNode {
    tileEntity: EnergyTile;
    initialized: boolean;
    constructor(energyType: EnergyType, parent: EnergyTile);
    getParent(): EnergyTile;
    receiveEnergy(amount: number, packet: EnergyPacket): number;
    isConductor(type: string): boolean;
    canReceiveEnergy(side: number, type: string): boolean;
    canExtractEnergy(side: number, type: string): boolean;
    init(): void;
    tick(): void;
}
interface EnergyTile extends TileEntity {
    isEnergyTile?: boolean;
    energyTypes?: object;
    energyNode: EnergyTileNode;
    energyTick(type: string, node: EnergyTileNode): void;
    energyReceive(type: string, amount: number, voltage: number): number;
    isConductor(type: string): boolean;
    canReceiveEnergy(side: number, type: string): boolean;
    canExtractEnergy(side: number, type: string): boolean;
}
declare namespace EnergyTileRegistry {
    function addEnergyType(Prototype: EnergyTile, energyType: EnergyType): void;
    function addEnergyTypeForId(id: number, energyType: EnergyType): void;
    function setupAsEnergyTile(Prototype: EnergyTile): void;
    let machineIDs: {};
    function isMachine(id: number): boolean;
}
declare namespace EnergyGridBuilder {
    function connectNodes(node1: EnergyNode, node2: EnergyNode): void;
    function buildGridForTile(te: EnergyTile): void;
    function buildWireGrid(region: BlockSource, x: number, y: number, z: number): EnergyGrid;
    function rebuildWireGrid(region: BlockSource, x: number, y: number, z: number): void;
    function rebuildForWire(region: BlockSource, x: number, y: number, z: number, wireID: number): EnergyGrid;
    function onWirePlaced(region: BlockSource, x: number, y: number, z: number): void;
    function onWireDestroyed(region: BlockSource, x: number, y: number, z: number, id: number): void;
}
declare namespace EnergyNet {
    function getNodesByDimension(dimension: number): EnergyNode[];
    function addEnergyNode(node: EnergyNode): void;
    function removeEnergyNode(node: EnergyNode): void;
    function getNodeOnCoords(region: BlockSource, x: number, y: number, z: number): EnergyNode;
}
