/// <reference path="./SourceRecipeDictionary.ts" />

type CuttingRecipe = {
    source: ItemInputEntry,
    result: ItemOutputEntry,
    hardnessLevel: number
}

class BlockCutterRecipeDictionary extends SourceRecipeDictionary<CuttingRecipe> {
    addRecipe(input: ItemInputEntry, output: ItemOutputEntry, hardnessLevel: number): void {
        output.data ??= 0;
        this.register({ source: input, result: output, hardnessLevel: hardnessLevel});
    }
}