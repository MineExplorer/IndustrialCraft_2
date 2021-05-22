namespace Machine {
    export interface IWrenchable extends TileEntity {
        canRotate(side: number): boolean;
        getFacing(): number;
        setFacing(side: number): void;
        getDefaultDrop(): number;
        adjustDrop(item: ItemInstance): ItemInstance;
    }
}