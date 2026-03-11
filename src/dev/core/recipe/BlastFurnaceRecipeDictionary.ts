/// <reference path="./SourceRecipeDictionary.ts" />

type BlastFurnaceRecipe = {
    source: { id: number, count?: number },
    result:  ItemOutputEntry[],
    heatCost: number
}

namespace MachineRecipe {
    export class BlastFurnaceRecipeDictionary extends SourceRecipeDictionary<BlastFurnaceRecipe> {
        register(recipe: BlastFurnaceRecipe): void {
            if (recipe.result.some(o => !o.id)) {
                Logger.Log(`Invalid result id for ${this.name} recipe`, "ERROR");
                return;
            }
            super.register(recipe);
        }

        addRecipe(input: ItemInputEntry, output: ItemOutputEntry[], heatCost: number): void {
            this.register({ source: input, result: output, heatCost: heatCost });
        }
    }
}