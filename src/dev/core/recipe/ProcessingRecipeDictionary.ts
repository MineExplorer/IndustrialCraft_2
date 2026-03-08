/// <reference path="./SourceRecipeDictionary.ts" />

type ItemProcessingRecipe = {
	source: ItemInputEntry,
	result: ItemOutputEntry[]
	processTime?: number
}

namespace MachineRecipe {
    export class ProcessingRecipeDictionary extends SourceRecipeDictionary<ItemProcessingRecipe> {
        constructor(public defaultProccessTime: number) {
            super();
        }

        addRecipe(input: ItemInputEntry, output: ItemOutputEntry | ItemOutputEntry[], processTime: number = this.defaultProccessTime): void {
            if (!Array.isArray(output)) {
                output = [output];
            }
            this.register({ source: input, result: output, processTime: processTime});
        }
    }
}