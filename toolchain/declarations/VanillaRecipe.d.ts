declare namespace VanillaRecipe {
    type ItemObj = {
        item: string;
        data?: number;
        count?: number;
    };
    type RecipeFormat = {
        type?: string;
        tags?: string[];
        priority?: number;
        pattern?: string[];
        key?: {
            [key: string]: ItemObj;
        };
        ingredients?: ItemObj[];
        result: ItemObj | ItemObj[];
    };
    export function setResourcePath(path: string): void;
    export function setBehaviorPath(path: string): void;
    export function getFileName(recipeName: string): string;
    export function getFilePath(recipeName: string): string;
    export function resetRecipes(path: string): void;
    export function getNumericID(stringID: string): number;
    export function convertToVanillaID(stringID: string): string;
    export function generateJSONRecipe(name: string, obj: any): void;
    export function addWorkbenchRecipeFromJSON(obj: RecipeFormat): void;
    export function addCraftingRecipe(name: string, obj: RecipeFormat, addToWorkbench?: boolean): void;
    export function addShapedRecipe(name: string, obj: RecipeFormat, addToWorkbench?: boolean): void;
    export function addShapelessRecipe(name: string, obj: RecipeFormat, addToWorkbench?: boolean): void;
    export function deleteRecipe(name: string): void;
    export function addStonecutterRecipe(name: string, obj: RecipeFormat): void;
    export {};
}
