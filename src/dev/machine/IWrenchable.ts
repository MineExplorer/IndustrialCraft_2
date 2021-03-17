interface IWrenchable {
    isWrenchable(): boolean;
    getFacing(): number;
    setFacing(side: number): void;
    getDefaultDrop(): number;
    adjustDrop(item: ItemInstance): ItemInstance;
}