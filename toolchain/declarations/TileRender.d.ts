/// <reference path="./core-engine.d.ts" />

declare namespace TileRenderer {
    const data: {};
    type BoxVertexes = [number, number, number, number, number, number];
    function createBlockModel(id: number, data: number, boxes: BoxVertexes[]): ICRender.Model;
    function setStaticModel(id: number, data: number, boxes: BoxVertexes[]): void;
    function setStaticModelWithRotation(id: number, boxes: BoxVertexes[]): void;
    function getRotatedBoxVertexes(rotation: number, box: BoxVertexes): BoxVertexes;
    function setCollisionShape(id: number, data: number, boxes: BoxVertexes[]): void;
    function setEmptyCollisionShape(id: number): void;
    function setStandardModel(id: number, data: number, texture: [string, number][]): void;
    function setStandardModelWithRotation(id: number, data: number, texture: [string, number][], hasVertical?: boolean): void;
    /** @deprecated use setStandardModel instead*/
    function setStandartModel(id: number, texture: [string, number][], data?: number): void;
    function setHandAndUiModel(id: number, data: number, texture: [string, number][]): void;
    function registerRenderModel(id: number, data: number, texture: [string, number][]): void;
    function registerModelWithRotation(id: number, data: number, texture: [string, number][], hasVertical?: boolean): void;
    /** @deprecated use registerModelWithRotation instead*/
    function registerRotationModel(id: number, data: number, texture: [string, number][]): void;
    /** @deprecated use registerModelWithRotation instead*/
    function registerFullRotationModel(id: number, data: number, texture: [string, number][]): void;
    function getRenderModel(id: number, data: string | number): ICRender.Model;
    function mapAtCoords(x: number, y: number, z: number, id: number, data: string | number): void;
    function getBlockRotation(player: number, hasVertical?: boolean): number;
    function setRotationFunction(id: string | number, hasVertical?: boolean, placeSound?: string): void;
    /** @deprecated use setRotationFunction instead*/
    function setRotationPlaceFunction(id: string | number, hasVertical?: boolean, placeSound?: string): void;
    function setupWireModel(id: number, data: number, width: number, groupName: string, preventSelfAdd?: boolean): void;
    function getCropModel(texture: [string, number]): ICRender.Model;
}
