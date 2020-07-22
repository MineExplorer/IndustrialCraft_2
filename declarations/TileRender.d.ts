declare namespace TileRenderer {
    const data: {};
    function setStandartModel(id: number, texture: any[], data?: number): void;
    function registerRenderModel(id: number, data: number, texture: any[]): void;
    function registerRotationModel(id: number, data: number, texture: any[]): void;
    function registerFullRotationModel(id: number, data: number, texture: any[]): void;
    function getRenderModel(id: number, data: number | string): any;
    function mapAtCoords(x: number, y: number, z: number, id: number, data: number | string): void;
    function getBlockRotation(isFullRotation?: boolean): number;
    function setRotationPlaceFunction(id: number, fullRotation?: boolean, placeSound?: string): void;
    function setupWireModel(id: number, data: number, width: number, groupName: string, preventSelfAdd?: boolean): void;
    function setEmptyCollisionShape(id: number): void;
    function getCropModel(texture: any[]): any;
    function setSlabShape(id: number, count: number): void;
    function setSlabPlaceFunction(id: number, count: number, fullBlockID: number): void;
}
