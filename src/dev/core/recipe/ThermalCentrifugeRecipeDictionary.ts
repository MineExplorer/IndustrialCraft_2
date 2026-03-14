/// <reference path="./SourceRecipeDictionary.ts" />

type ThermalCentrifugeRecipe = {
    source: ItemInputEntry,
    result:  ItemOutputEntry[],
    heat: number,
    processTime?: number
}

namespace MachineRecipe {
    export class ThermalCentrifugeRecipeDictionary extends SourceRecipeDictionary<ThermalCentrifugeRecipe> {
        defaultProccessTime: number = 500;

        register(recipe: ThermalCentrifugeRecipe): void {
            if (recipe.result.some(o => !o.id)) {
                Logger.Log(`Invalid result id for ${this.name} recipe`, "ERROR");
                return;
            }
            super.register(recipe);
        }

        addRecipe(input: ItemInputEntry, output: ItemOutputEntry[], heat: number, processTime: number = this.defaultProccessTime): void {
            this.register({ source: input, result: output, heat: heat, processTime: processTime});
        }
    }
}