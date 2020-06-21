declare namespace EnergyRegistry {
    const energyTypes: {};
    function createEnergyType(name: any, value: any, wireParams: any): EnergyType;
    function assureEnergyType(name: any, value: any, wireParams: any): any;
    function getEnergyType(name: any): any;
    function getValueRatio(name1: any, name2: any): number;
    const wireData: {};
    function getWireData(id: any): any;
    function isWire(id: any, type: any): boolean;
    function onWirePlaced(x: any, y: any, z: any): void;
    function onWireDestroyed(x: any, y: any, z: any, id: any): void;
}
declare class EnergyType {
    constructor(name: any);
    name: any;
    value: number;
    wireData: {};
    registerWire(id: any, maxValue: any, overloadFunc: any, canConnectFunc: any): {
        type: any;
        value: any;
    };
}
declare namespace TileEntityRegistry {
    function addEnergyType(Prototype: any, energyType: any): void;
    function addEnergyTypeForId(id: any, energyType: any): void;
    function setupInitialParams(Prototype: any): void;
    const machineIDs: {};
    function isMachine(id: any): any;
    const quickCoordAccess: {};
    function addMacineAccessAtCoords(x: any, y: any, z: any, machine: any): void;
    function removeMachineAccessAtCoords(x: any, y: any, z: any): void;
    function accessMachineAtCoords(x: any, y: any, z: any): any;
    function executeForAllInNet(net: any, func: any): void;
}
declare namespace EnergyNetBuilder {
    const energyNets: any[];
    function addEnergyNet(net: any): void;
    function removeNet(net: any): void;
    function removeNetOnCoords(x: any, y: any, z: any): void;
    function removeNetByBlock(x: any, y: any, z: any, wireId: any): void;
    function mergeNets(net1: any, net2: any): void;
    function buildForTile(tile: any, type: any): EnergyNet;
    function buildTileNet(net: any, x: any, y: any, z: any, side: any): void;
    function buildForWire(x: any, y: any, z: any, id: any): EnergyNet;
    function rebuildForWire(x: any, y: any, z: any, id: any): void;
    function rebuildRecursive(net: any, wireId: any, x: any, y: any, z: any, side: any): void;
    function rebuildFor6Sides(net: any, wireBlock: any, x: any, y: any, z: any): void;
    function rebuildTileNet(tile: any): void;
    function rebuildTileConnections(x: any, y: any, z: any, tile: any): void;
    function getNetOnCoords(x: any, y: any, z: any): any;
    function getNetByBlock(x: any, y: any, z: any, wireId: any): any;
    function tickEnergyNets(): void;
    function getRelativeCoords(x: any, y: any, z: any, side: any): {
        x: any;
        y: any;
        z: any;
    };
}
declare class EnergyNet {
    constructor(energyType: any, maxPacketSize: any, overloadFunc: any);
    energyType: any;
    energyName: any;
    maxPacketSize: any;
    netId: number;
    wireMap: {};
    onOverload: any;
    store: number;
    transfered: number;
    voltage: number;
    lastStore: number;
    lastTransfered: number;
    lastVoltage: number;
    source: {
        parent: () => EnergyNet;
        add: (amount: any, voltage: any) => number;
        addAll: (amount: any, voltage: any) => void;
    };
    connectedNets: {};
    connectionsCount: number;
    tileEntities: any[];
    addConnection(net: any): void;
    removeConnection(net: any): void;
    addTileEntity(tileEntity: any): void;
    removeTileEntity(tileEntity: any): void;
    addEnergy(amount: any, voltage: any, source: any, explored: any): number;
    addToBuffer(amount: any, voltage: any): void;
    tick(): void;
    toString(): string;
}
