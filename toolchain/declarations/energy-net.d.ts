declare namespace EnergyTypeRegistry {
    type WireData = {
        type: EnergyType;
        maxValue: number;
        class: typeof EnergyGrid;
    };
    const energyTypes: {
        [key: number]: EnergyType;
    };
    const wireData: {
        [key: number]: WireData;
    };
    /**
     * @param name - name of this energy type
     * @param value - value of one unit in [Eu] (IC2 Energy)
    */
    function createEnergyType(name: string, value: number): EnergyType;
    function assureEnergyType(name: string, value: number): EnergyType;
    function getEnergyType(name: string): EnergyType;
    function getValueRatio(name1: string, name2: string): number;
    function registerWire(blockID: number, type: EnergyType, maxValue: number, energyGridClass?: typeof EnergyGrid): void;
    function getWireData(blockID: number): Nullable<WireData>;
    function createWireGrid(blockID: number, blockSource: BlockSource): EnergyGrid;
    function isWire(blockID: number, type?: string): boolean;
}
declare class EnergyType {
    name: string;
    value: number;
    constructor(name: string, value?: number);
    registerWire(id: number, maxValue: number, energyGridClass?: typeof EnergyGrid): void;
}
declare const enum TransferMode {
    Split = 1,
    Full = 2
}
declare class EnergyPacket {
    energyName: string;
    size: number;
    source: EnergyNode;
    transferMode: TransferMode;
    nodeList: {
        [key: number]: TransferMode;
    };
    constructor(energyName: string, size: number, source: EnergyNode, transferMode?: TransferMode);
    validateNode(nodeId: number): boolean;
    setNodePassed(nodeId: number, mode?: TransferMode): void;
}
declare class BlockNode {
    x: number;
    y: number;
    z: number;
    tile: Tile;
    adjacentBlocks: BlockNode[];
    adjacentTileEntityNodes: EnergyTileNode[];
    constructor(x: number, y: number, z: number, tile: Tile);
    static getCoordKey(x: number, y: number, z: number): string;
    getCoordKey(): string;
    private addAdjacentBlock;
    private removeAdjacentBlock;
    linkBlock(blockNode: BlockNode): void;
    unlinkBlock(blockNode: BlockNode): void;
    unlinkAllBlocks(): void;
    addAdjacentTileEntityNode(node: EnergyTileNode): boolean;
    removeAdjacentTileEntityNode(node: EnergyTileNode): boolean;
    clearAdjacentTileEntityNodes(): void;
}
declare class BlockNodesSet {
    data: {
        [coordKey: string]: BlockNode;
    };
    getCoordKey(x: number, y: number, z: number): string;
    has(x: number, y: number, z: number): boolean;
    get(x: number, y: number, z: number): BlockNode;
    add(x: number, y: number, z: number, tile: Tile): BlockNode;
    addNode(blockNode: BlockNode): BlockNode;
    remove(x: number, y: number, z: number): BlockNode;
    removeNode(blockNode: BlockNode): BlockNode;
    containsNode(blockNode: BlockNode): boolean;
    mergeFrom(other: BlockNodesSet): void;
    forEachNode(func: (blockNode: BlockNode) => void): void;
    clear(): void;
}
declare type EnergyNodeKind = "grid" | "tile";
declare abstract class EnergyNode {
    id: number;
    baseEnergy: string;
    abstract readonly kind: EnergyNodeKind;
    energyTypes: object;
    dimension: number;
    maxValue: number;
    removed: boolean;
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
    abstract hasCoords(x: number, y: number, z: number): boolean;
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
    readonly kind: EnergyNodeKind;
    blockNodes: BlockNodesSet;
    /** @deprecated */
    blocksMap: {
        [coordKey: string]: BlockNode;
    };
    blockID: number;
    region: BlockSource;
    idleTicks: number;
    constructor(energyType: EnergyType, maxValue: number, wireID: number, region: BlockSource);
    isCompatible(node: EnergyNode): boolean;
    addCoords(x: number, y: number, z: number, tile: Tile): BlockNode;
    hasCoords(x: number, y: number, z: number): boolean;
    /**
     * Determines whether the specified wire block can be absorbed into this grid.
     */
    isValidWire(tile: Tile): boolean;
    mergeGrid(grid: EnergyGrid): EnergyGrid;
    private getSideForTileNode;
    private collectConnectedBlocks;
    private createGridComponent;
    private rebuildConnectionsFromBlockGraph;
    private splitByComponents;
    rebuildRecursive(x: number, y: number, z: number, side?: number): void;
    removeCoords(x: number, y: number, z: number): BlockNode;
    private connectBlockToNeighbor;
    rebuildFor6Sides(blockNode: BlockNode): void;
    tick(): void;
    toString(): string;
}
declare class EnergyTileNode extends EnergyNode {
    readonly kind: EnergyNodeKind;
    tileEntity: EnergyTile;
    initialized: boolean;
    constructor(energyType: EnergyType, parent: EnergyTile);
    getParent(): EnergyTile;
    hasCoords(x: number, y: number, z: number): boolean;
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
    const machineIDs: {};
    function isMachine(id: number): boolean;
}
declare namespace EnergyGridBuilder {
    function connectNodes(node1: EnergyNode, node2: EnergyNode): void;
    function buildGridForTile(te: EnergyTile): void;
    function buildWireGrid(region: BlockSource, x: number, y: number, z: number): EnergyGrid;
    function rebuildWireGrid(region: BlockSource, x: number, y: number, z: number): void;
    function rebuildForWire(region: BlockSource, x: number, y: number, z: number, wireID: number): EnergyGrid;
    function onWirePlaced(region: BlockSource, x: number, y: number, z: number): void;
}
declare namespace EnergyNet {
    let globalNodeID: number;
    function addEnergyNode(node: EnergyNode): void;
    function removeEnergyNode(node: EnergyNode): void;
    function enqueueRemoval(node: EnergyNode): void;
    function flushRemovals(): void;
    function getNodeOnCoords(region: BlockSource, x: number, y: number, z: number): EnergyNode;
}
