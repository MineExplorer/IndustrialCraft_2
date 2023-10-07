namespace Machine {
    export interface IWrenchable extends TileEntity {
        canRotate(side: number): boolean;
        getFacing(): number;
        setFacing(side: number): boolean;
        getDefaultDrop(): number;
        adjustDrop(item: ItemInstance): ItemInstance;
    }
}