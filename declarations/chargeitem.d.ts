declare namespace ChargeItemRegistry {
    const chargeData: {};
    function registerItem(id: number, energyType: string, capacity: number, transferLimit: number, level: number, itemType?: string, inCreativeCharged?: number, inCreativeDischarged?: number): void;
    function registerFlashItem(id: number, energyType: string, amount: number, level: number): void;
    function registerExtraItem(id: number, energyType: string, capacity: number, transferLimit: number, level: number, itemType?: string, addScale?: boolean, addToCreative?: boolean): void;
    function registerChargeFunction(id: number, func: any): void;
    function registerDischargeFunction(id: number, func: any): void;
    function getItemData(id: number): any;
    function isFlashStorage(id: number): boolean;
    function isValidItem(id: number, energyType: string, level: number, itemType?: string): boolean;
    function isValidStorage(id: number, energyType: string, level: number): boolean;
    function getEnergyStored(item: any, energyType?: string): number;
    function getMaxCharge(itemid: number, energyType?: string): number;
    function setEnergyStored(item: any, amount: number): void;
    function getEnergyFrom(item: any, energyType: string, amount: number, transf: number, level: number, getFromAll?: boolean): number;
    function getEnergyFrom(item: any, energyType: string, amount: number, level: number, getFromAll?: boolean): number;
    function addEnergyTo(item: any, energyType: string, amount: number, transf: number, level: number): number;
    function addEnergyTo(item: any, energyType: string, amount: number, level: number): number;
    function transferEnergy(api: any, field: any, result: any): void;
}
