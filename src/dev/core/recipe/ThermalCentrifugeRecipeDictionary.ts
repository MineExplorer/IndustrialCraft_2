/// <reference path="./SourceRecipeDictionary.ts" />

type ThermalCentrifugeRecipe = {
    source: ItemInputEntry,
    result:  ItemOutputEntry[],
    heat: number,
    processTime?: number
}

class ThermalCentrifugeRecipeDictionary extends SourceRecipeDictionary<ThermalCentrifugeRecipe> {
    defaultProccessTime: number = 500;

    addRecipe(input: ItemInputEntry, output: ItemOutputEntry[], heat: number, processTime: number = this.defaultProccessTime): void {
        this.register({ source: input, result: output, heat: heat, processTime: processTime});
    }
}