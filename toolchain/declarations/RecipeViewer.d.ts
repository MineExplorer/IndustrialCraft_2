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

    constructor(name: string, icon: number | Tile, content: {params?: UI.BindingsSet, drawing?: UI.DrawingSet, elements: {[key: string]: Partial<UI.UIElement>}});

    setDescription(text: string): this;
    setTankLimit(limit: number | {[key: string]: number}): this;

    abstract getAllList(): RecipePattern[];
    getList(id: number, data: number, isUsage: boolean): RecipePattern[];
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;

}


declare class RecipeTypeRegistry {
    public register(key: string, recipeType: RecipeType): void;
    public openRecipePage(key: string): void;
}