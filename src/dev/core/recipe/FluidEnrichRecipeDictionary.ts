/// <reference path="../recipe/RecipeDictionary.ts" />

type LiquidRecipeEntry = {name: string, amount: number};

type FluidEnrichRecipe = {
	source: ItemInputEntry
	inputFluid: LiquidRecipeEntry
	outputFluid: LiquidRecipeEntry
};

namespace MachineRecipe {
	export class FluidEnrichRecipeDictionary extends RecipeDictionary<FluidEnrichRecipe> {
		register(recipe: FluidEnrichRecipe): void {
			recipe.source.data ??= -1;
			recipe.source.count ??= 1;
			const recipeKey = this.getInputKey(recipe.inputFluid.name, recipe.source.id, recipe.source.data);
			this.putRecipe(recipeKey, recipe);
		}

		getRecipe(fluid: string, source: {id: number, data: number}): Nullable<FluidEnrichRecipe> {
			return this.recipes[this.getInputKey(fluid, source.id, source.data)] ||
				this.recipes[this.getInputKey(fluid, source.id, -1)] || null;
		}

		removeRecipe(fluid: string, source: ItemInstance): boolean {
			const recipeKey = this.getInputKey(fluid, source.id, source.data);
			return this.removeByKey(recipeKey);
		}

		getInputKey(fluid: string, sourceId: number, sourceData: number): string {
			return fluid + ":" + sourceId + ":" + sourceData;
		}

		addRecipe(input: ItemInputEntry, inputFluid: LiquidRecipeEntry, outputFluid: LiquidRecipeEntry): void {
			this.register({ source: input, inputFluid: inputFluid, outputFluid: outputFluid});
		}
	}
}