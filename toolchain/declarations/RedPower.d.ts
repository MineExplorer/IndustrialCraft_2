/// <reference path="./core-engine.d.ts" />
/// <reference path="./BlockEngine.d.ts" />

declare namespace RedCore {
    export interface IScrewdriver {
        canBeUsed(item: ItemInstance): boolean;
        useItem(item: ItemStack, player: number): void;
    }
    
    export namespace Machine {
        export function isMachine(id: number): boolean;
        export function registerPrototype(id: number, Prototype: TileEntity.TileEntityPrototype): void;
        export function registerMachine(id: number, Prototype: TileEntity.TileEntityPrototype, allowEu?: boolean): void;
        export function updateGuiHeader(gui: any, text: string): void;
        export function createInventoryWindow(header: string, uiDescriptor: {
            drawing?: UI.DrawingSet;
            elements: UI.ElementSet;
        }): UI.StandartWindow;
        export function registerScrewdriver(id: number, properties: IScrewdriver): void;
        export function getScrewdriverData(id: number): Nullable<IScrewdriver>;
        export function isScrewdriver(item: ItemInstance): boolean;
        type BlockTexture = {
            top: string;
            bottom: string;
            side: string;
            side2?: string;
        };
        export function createBlockWithRotation(stringID: string, name: string, texture: {
            default: BlockTexture;
            active: BlockTexture;
        }, blockType?: string | Block.SpecialType): void;
        export {};
    }

    export namespace SmelterRecipes {
        type RecipeFormat = {
            result: ItemInstance;
            input: ItemInstance[];
        };
        const recipeData: RecipeFormat[];
        function addRecipe(result: {
            id: number;
            count: number;
            data?: number;
        }, input: {
            id: number;
            count: number;
            data?: number;
        }[]): void;
        function removeRecipe(inputItems: ItemInstance[]): Nullable<ItemInstance>;
        function getInput(container: ItemContainer): ItemInstance[];
        function getRecipe(inputItems: ItemInstance[]): RecipeFormat;
        function performRecipe(recipe: RecipeFormat, container: ItemContainer): void;
    }

    export namespace World {
        const oreConfig: {
            oreGenCopper: boolean;
            oreGenTin: boolean;
            oreGenSilver: boolean;
            oreGenTungsten: boolean;
            oreGenNikolite: boolean;
            oreGenRuby: boolean;
            oreGenSapphire: boolean;
            oreGenGreenSapphire: boolean;
        };
        const genMarbleChance: number;
        const genBasaltChance: number;
        function randomCoords(random: java.util.Random, chunkX: number, chunkZ: number, minHeight?: number, maxHeight?: number): Vector;
    }

    export namespace Integration {
        function registerPlant(blockID: number): void;
        function registerSeeds(itemID: number, blockID: number): void;
        function addDeployerItem(itemID: number): void;
    }

    export const requireGlobal: (command: string) => any;
}