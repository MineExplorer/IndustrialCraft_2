interface IReactor {
    getHeat(): number;

    setHeat(value: number): void;

    addHeat(amount: number): number;

    getMaxHeat(): number;

    setMaxHeat(value: number): void;

    addEmitHeat(amount: number): void;

    getHeatEffectModifier(): number;

    setHeatEffectModifier(value: number): void;

    getOutput(): number;

    getEnergyOutput(): number;

    addOutput(amount: number): number;

    getItemAt(x: number, y: number): ItemContainerSlot;

    setItemAt(x: number, y: number, id: number, count: number, data: number, extra?: ItemExtraData): void;

    explode(): void;

    isFluidCooled(): boolean;
}