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
interface AdjacentNodeLink {
    node: EnergyGraphNode;
    canInput: boolean;
    canOutput: boolean;
}
interface EnergyGraphNode {
    adjacentLinks: AdjacentNodeLink[];
    addAdjacentLink(node: EnergyGraphNode, canInput: boolean, canOutput: boolean): boolean;
    removeAdjacentLink(node: EnergyGraphNode): boolean;
    resetAdjacentLinks(): void;
}
declare class BlockNode implements EnergyGraphNode {
    x: number;
    y: number;
    z: number;
    tile: Tile;
    parent: EnergyGrid;
    adjacentLinks: AdjacentNodeLink[];
    extraData: {
        [key: string]: any;
    };
    constructor(parent: EnergyGrid, x: number, y: number, z: number, tile: Tile);
    static getCoordKey(x: number, y: number, z: number): string;
    getCoordKey(): string;
    linkBlock(blockNode: BlockNode): void;
    unlinkBlock(blockNode: BlockNode): void;
    linkTile(tileNode: EnergyTileNode, canInput: boolean, canOutput: boolean): void;
    unlinkTile(tileNode: EnergyTileNode): void;
    addAdjacentLink(node: BlockNode | EnergyTileNode, canInput: boolean, canOutput: boolean): boolean;
    removeAdjacentLink(node: EnergyGraphNode): boolean;
    resetAdjacentLinks(): void;
}
declare class BlockNodesSet {
    parent: EnergyGrid;
    data: {
        [coordKey: string]: BlockNode;
    };
    constructor(parent: EnergyGrid);
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
    energyTypes: {
        [key: string]: EnergyType;
    };
    dimension: number;
    maxValue: number;
    removed: boolean;
    entries: EnergyNode[];
    receivers: EnergyNode[];
    activeReceivers: EnergyNode[];
    energyIn: number;
    currentIn: number;
    energyOut: number;
    currentOut: number;
    energyPower: number;
    currentPower: number;
    isFull: boolean;
    freeCapacity: number;
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
     * @returns — true if connection was added, false if it already exists
     */
    addConnection(node: EnergyNode): boolean;
    /**
     * Removes output connection to specified node
     * @param node receiver node
     * @returns true if connection was removed, false if it's already removed
     */
    removeConnection(node: EnergyNode): boolean;
    resetConnections(): void;
    receiveEnergy(amount: number, packet: EnergyPacket): number;
    add(amount: number, power?: number): number;
    addPacket(energyName: string, amount: number, power?: number, receivers?: EnergyNode[]): number;
    transferEnergy(amount: number, packet: EnergyPacket, receivers?: EnergyNode[]): number;
    /** @deprecated */
    addAll(amount: number, power?: number): void;
    onOverload(packetSize: number): void;
    abstract getFreeCapacity(energyName: string): number;
    canProduceEnergy(): boolean;
    isConductor(energyName: string): boolean;
    canReceiveEnergy(side: number, energyName: string): boolean;
    canEmitEnergy(side: number, energyName: string): boolean;
    canConductEnergy(coord1: Vector, coord2: Vector, side: number): boolean;
    isCompatible(node: EnergyNode): boolean;
    getActiveReceivers(): EnergyNode[];
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
    rebuild: boolean;
    idleTicks: number;
    energyPotential: number;
    constructor(energyType: EnergyType, maxValue: number, wireID: number, region: BlockSource);
    isCompatible(node: EnergyNode): boolean;
    addCoords(x: number, y: number, z: number, tile: Tile): BlockNode;
    hasCoords(x: number, y: number, z: number): boolean;
    /**
     * Determines whether the specified wire block can be absorbed into this grid.
     */
    isValidWire(tile: Tile): boolean;
    mergeGrid(grid: EnergyGrid): EnergyGrid;
    rebuildRecursive(x: number, y: number, z: number, side?: number): void;
    removeCoords(x: number, y: number, z: number): BlockNode;
    removeTileNodeLinks(tileNode: EnergyTileNode): boolean;
    rebuildFor6Sides(blockNode: BlockNode): void;
    /**
     * Validates integrity of the grid's structure and splits or removes it if necessary.
     */
    checkAndRebuild(): void;
    getFreeCapacity(energyName: string): number;
    transferBuffer(energyName: string): void;
    tick(): void;
    toString(): string;
    protected connectBlockToNeighbor(blockNode: BlockNode, x: number, y: number, z: number, side: number): void;
    protected collectConnectedBlocks(startNode: BlockNode, visited: {
        [coordKey: string]: boolean;
    }): BlockNode[];
    protected createGridComponent(component: BlockNode[]): EnergyGrid;
    protected splitByComponents(): EnergyGrid[];
    protected reconnectBlockGraph(): void;
    protected rebuildConnectionsFromBlockGraph(): void;
}
declare class EnergyTileNode extends EnergyNode implements EnergyGraphNode {
    readonly kind: EnergyNodeKind;
    tileEntity: EnergyTile;
    initialized: boolean;
    adjacentLinks: AdjacentNodeLink[];
    gridConnectionsCount: number;
    energyAmounts: EnergyBuffer;
    constructor(energyType: EnergyType, parent: EnergyTile);
    static createFor(tileEntity: EnergyTile, energyTypes: {
        [key: string]: EnergyType;
    }): EnergyTileNode;
    getParent(): EnergyTile;
    hasCoords(x: number, y: number, z: number): boolean;
    addConnection(node: EnergyNode): boolean;
    /**
     * Removes output connection to specified node
     * @param node receiver node
     */
    removeConnection(node: EnergyNode): boolean;
    linkTile(tileNode: EnergyTileNode, canInput: boolean, canOutput: boolean): void;
    unlinkTile(tileNode: EnergyTileNode): void;
    addAdjacentLink(node: EnergyGraphNode, canInput: boolean, canOutput: boolean): boolean;
    removeAdjacentLink(node: EnergyGraphNode): boolean;
    resetAdjacentLinks(): void;
    receiveEnergy(amount: number, packet: EnergyPacket): number;
    getFreeCapacity(energyName: string): number;
    canProduceEnergy(): boolean;
    isConductor(energyName: string): boolean;
    canReceiveEnergy(side: number, energyName: string): boolean;
    canEmitEnergy(side: number, energyName: string): boolean;
    resetConnections(): void;
    add(amount: number, power?: number): number;
    addToBuffer(energyName: string, amount: number, size: number, power?: number): number;
    getBuffer(energyName: string, createIfNotFound?: boolean): {
        amount: number;
        power: number;
        packetSize: number;
    };
    init(): void;
    tick(): void;
}
declare type EnergyBuffer = {
    [energyName: string]: {
        amount: number;
        power: number;
        packetSize: number;
    };
};
interface EnergyTile extends TileEntity {
    isEnergyTile?: boolean;
    /**
     * Dictionary of energy types registered for tile entity.
     */
    energyTypes?: {
        [energyName: string]: EnergyType;
    };
    /**
     * Tile entity energy node.
     */
    energyNode: EnergyTileNode;
    /**
     * This method is called during energy net tick and allows to send energy packets from the tile entity node.
     * @param energyName main energy type of the node
     * @param node energy node reference
     */
    energyTick(energyName: string, node: EnergyTileNode): void;
    /**
     * This method is called when the tile entity receives an energy packet.
     * @param energyName energy type
     * @param amount received energy amount
     * @param power energy power, indicates original packet energy or the energy of an individual packet if the received amount is a sum of multiple packets.
     */
    energyReceive(energyName: string, amount: number, power: number): number;
    /**
     * @returns available capacity in the tile's energy buffer or -1 if not supported
     * @param energyName energy type name
     */
    getFreeEnergyAmount?(energyName?: string): number;
    /**
     * @returns true if tile can produce energy, false otherwise
     */
    isEnergyProducer(): boolean;
    /**
     * If returns true, the tile node can transfer incoming energy packets to other nodes.
     * @param energyName energy type name
     */
    isConductor(energyName: string): boolean;
    /**
     * Specifies from which sides the tile entity can receive energy. The tile entity must recreate its connections if this value changes.
     * @param side block side
     * @param energyName energy type name
     */
    canReceiveEnergy(side: number, energyName: string): boolean;
    /**
     * Specifies from which sides the tile entity can emit energy. The tile entity must recreate its connections if this value changes.
     * @param side block side
     * @param energyName energy type name
     */
    canEmitEnergy(side: number, energyName: string): boolean;
    /** @deprecated use canEmitEnergy instead */
    canExtractEnergy?(side: number, energyName: string): boolean;
}
declare namespace EnergyTileRegistry {
    /** Adds energy type for tile entity prototype */
    function addEnergyType(Prototype: EnergyTile, energyType: EnergyType): void;
    /** Same as addEnergyType, but works on already created prototypes, accessing them by id */
    function addEnergyTypeForId(id: number, energyType: EnergyType): void;
    /**
     * Adds default EnergyTile interface implementation for tile entity prototype.
     * @param Prototype tile entity prototype
     */
    function setupAsEnergyTile(Prototype: EnergyTile): void;
}
declare namespace EnergyGridBuilder {
    function connectNodes(node1: EnergyNode, node2: EnergyNode): void;
    function buildGridForTile(te: EnergyTile): void;
    function buildWireGrid(region: BlockSource, x: number, y: number, z: number): EnergyGrid;
    function rebuildWireGrid(region: BlockSource, x: number, y: number, z: number): void;
    function onWirePlaced(region: BlockSource, x: number, y: number, z: number): void;
}
declare namespace EnergyNet {
    let globalNodeID: number;
    function addEnergyNode(node: EnergyNode): void;
    function removeEnergyNode(node: EnergyNode): void;
    function enqueueRemoval(node: EnergyNode): void;
    function flushRemovals(): void;
    function getNodeOnCoords(region: BlockSource, x: number, y: number, z: number): EnergyNode;
    let debugEnabled: boolean;
}
