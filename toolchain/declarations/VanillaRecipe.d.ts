declare namespace VanillaRecipe {
    type RecipeFormat = {
        type?: string;
        tags?: string[];
        priority?: number;
        pattern?: string[];
        key?: {
            [key: string]: {
                item: string;
                data?: number;
                count?: number;
            };
        };
        ingredients?: {
            item: string;
            data?: number;
            count?: number;
        }[];
        result: {
            item: string,
            data?: number,
            count?: number
        } | {
            item: string,
            data?: number,
            count?: number
        }[];
    };
    export function setResourcePath(path: string): void;
    export function getFileName(recipeName: string): string;
    export function getFilePath(recipeName: string): string;
    export function resetRecipes(): void;
    export function getNumericID(stringID: string): number;
    export function convertToVanillaID(stringID: string): string;
    export function generateJSONRecipe(name: string, obj: any): void;
    export function addWorkbenchRecipeFromJSON(obj: RecipeFormat): void;
    export function addCraftingRecipe(name: string, obj: RecipeFormat, addToWorkbench?: boolean): void;
    export function addStonecutterRecipe(name: string, obj: RecipeFormat): void;
}
