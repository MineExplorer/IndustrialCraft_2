declare namespace TileRenderer {
    type BoxVertexes = [number, number, number, number, number, number];
    const modelData: {};
    function createBlockModel(id: string | number, data: number, boxes: BoxVertexes[]): ICRender.Model;
    function setStaticModel(id: number, data: number, boxes: BoxVertexes[]): void;
    function getRotatedBoxVertexes(box: BoxVertexes, rotation: number): BoxVertexes;
    function setStaticModelWithRotation(id: number, boxes: BoxVertexes[]): void;
    function setCollisionShape(id: number, data: number, boxes: BoxVertexes[], setRaycastShape?: boolean): void;
    function setShapeWithRotation(id: number, data: number, boxes: BoxVertexes[]): void;
    function setEmptyCollisionShape(id: number): void;
    function setStandardModel(id: number, data: number, texture: BlockRenderer.ModelTextureSet): void;
    function setStandardModelWithRotation(id: number, data: number, texture: BlockRenderer.ModelTextureSet, hasVertical?: boolean): void;
    /** @deprecated use setStandardModel instead*/
    function setStandartModel(id: number, texture: BlockRenderer.ModelTextureSet, data?: number): void;
    function setHandAndUiModel(id: number, data: number, texture: BlockRenderer.ModelTextureSet): void;
    function registerRenderModel(id: number, data: number, texture: BlockRenderer.ModelTextureSet): void;
    function registerModelWithRotation(id: number, data: number, texture: BlockRenderer.ModelTextureSet, hasVertical?: boolean): void;
    /** @deprecated use registerModelWithRotation instead*/
    function registerRotationModel(id: number, data: number, texture: BlockRenderer.ModelTextureSet): void;
    /** @deprecated use registerModelWithRotation instead*/
    function registerFullRotationModel(id: number, data: number, texture: BlockRenderer.ModelTextureSet): void;
    function getRenderModel(id: number, data: string | number): Nullable<ICRender.Model>;
    /** Client-side only */
    function mapAtCoords(x: number, y: number, z: number, id: number, data: string | number): void;
    function getBlockRotation(player: number, hasVertical?: boolean): number;
    function setRotationFunction(id: string | number, hasVertical?: boolean, placeSound?: string): void;
    /** @deprecated */
    function setRotationPlaceFunction(id: string | number, hasVertical?: boolean, placeSound?: string): void;
    function setupWireModel(id: number, data: number, width: number, groupName: string, preventSelfAdd?: boolean): void;
    function getCropModel(texture: [string, number]): ICRender.Model;
    function getCropModel(block: [number, number]): ICRender.Model;
    /** @deprecated use render types instead */
    function setCropModel(id: number, data: number, height?: number): void;
    /** @deprecated use render types instead */
    function setPlantModel(id: number, data: number, texture: string, meta?: number): void;
    /** @deprecated not supported */
    function setSlabShape(): void;
    /** @deprecated not supported */
    function setSlabPlaceFunction(): void;
}
