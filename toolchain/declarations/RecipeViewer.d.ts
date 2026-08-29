declare interface LiquidInstance {
    liquid: string;
    amount: number;
}


declare interface RecipePattern {
    input?: ItemInstance[];
    output?: ItemInstance[];
    inputLiq?: LiquidInstance[];
    outputLiq?: LiquidInstance[];
    [key: string]: any;
}


declare abstract class RecipeType {
    readonly window: UI.Window;
    readonly icon: ItemInstance;
    constructor(name: string, icon: Tile | number, content: {
        params?: UI.BindingSet;
        drawing?: UI.DrawingElements[];
        elements: {
            [key: string]: Partial<UI.UIElement>;
        };
    });
    setGridView(row: number, col: number, border?: boolean | number): RecipeType;
    setDescription(text: string): RecipeType;
    setTankLimit(limit: number): RecipeType;
    getName(): string;
    getIcon(): ItemInstance;
    getDescription(): string;
    getWindow(): UI.Window;
    getRecipeCountPerPage(): number;
    abstract getAllList(): RecipePattern[];
    getList(id: number, data: number, isUsage: boolean): RecipePattern[];
    getListByLiquid(liquid: string, isUsage: boolean): RecipePattern[];
    hasAnyRecipe(id: number, data: number, isUsage: boolean): boolean;
    hasAnyRecipeByLiquid(liquid: string, isUsage: boolean): boolean;
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;
    showRecipe(recipes: RecipePattern[]): void;
    slotTooltip(name: string, item: ItemInstance, tips: {
        [key: string]: any;
    }): string;
    tankTooltip(name: string, liquid: LiquidInstance, tips: {
        [key: string]: any;
    }): string;
}

declare class RecipeTypeRegistry {
    register(key: string, recipeType: RecipeType): void;
    get(key: string): RecipeType;
    isExist(key: string): boolean;
    delete(key: string): void;
    getAllKeys(): string[];
    getLength(): number;
    getActiveType(id: number, data: number, isUsage: boolean): string[];
    getActiveTypeByLiquid(liquid: string, isUsage: boolean): string[];
    openRecipePage(recipeKey: string | string[]): void;
    openRecipePageByItem(id: number, data: number, isUsage: boolean): boolean;
    openRecipePageByLiquid(liquid: string, isUsage: boolean): boolean;
    getLiquidByTex(texture: string): string;
}