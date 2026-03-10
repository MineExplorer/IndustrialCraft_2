/// <reference path="./SourceRecipeDictionary.ts" />

type CuttingRecipe = {
    source: ItemInputEntry,
    result: ItemOutputEntry,
    hardnessLevel: number
}

namespace MachineRecipe {
    export class BlockCutterRecipeDictionary extends SourceRecipeDictionary<CuttingRecipe> {
        register(recipe: CuttingRecipe): void {
            if (!recipe.result.id) {
                Logger.Log(`Invalid result id for ${this.name} recipe`, "ERROR");
                return;
            }
            super.register(recipe);
        }

        addRecipe(input: ItemInputEntry, output: ItemOutputEntry, hardnessLevel: number): void {
            output.data ??= 0;
            this.register({ source: input, result: output, hardnessLevel: hardnessLevel});
        }
    }
}