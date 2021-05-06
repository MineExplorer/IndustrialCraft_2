namespace Machine {
    export interface IWrenchable extends TileEntity {
        isWrenchable(): boolean;
        getFacing(): number;
        setFacing(side: number): void;
        getDefaultDrop(): number;
        adjustDrop(item: ItemInstance): ItemInstance;
    }
}