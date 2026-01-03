namespace Machine {
    export interface IWrenchable extends TileEntity {
        canRotate(side: number): boolean;
        getFacing(): number;
        setFacing(side: number): boolean;
        /**
         * @returns drop when machine is broken by inappropriate tool
         */
        getDefaultDrop(): ItemInstance;
        /**
         * @returns drop when machine is demontaged by wrench
         */
        getDemontaged(): ItemInstance;
    }
}