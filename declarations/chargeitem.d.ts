/// <reference path="./core-engine.d.ts" />

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
    function getEnergyStored(item: ItemInstance, energyType?: string): number;
    function getMaxCharge(id: number, energyType?: string): number;
    function setEnergyStored(item: ItemInstance, amount: number): void;
    function getEnergyFrom(item: ItemInstance, energyType: string, amount: number, transf: number, level: number, getFromAll?: boolean): number;
    function getEnergyFrom(item: ItemInstance, energyType: string, amount: number, level: number, getFromAll?: boolean): number;
    function addEnergyTo(item: ItemInstance, energyType: string, amount: number, transf: number, level: number): number;
    function addEnergyTo(item: ItemInstance, energyType: string, amount: number, level: number): number;
    function transferEnergy(api: any, field: any, result: ItemInstance): void;
}
