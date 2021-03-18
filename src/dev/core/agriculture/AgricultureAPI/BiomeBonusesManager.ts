/// <reference path="NutrientBiomeBonus.ts" />
namespace Agriculture {
	export class BiomeBonusesManager {

		static getHumidityBiomeBonus(x: number, z: number) {
			// * yes it really zero
			return 0;
		}

		static getNutrientBiomeBonus(x: number, z: number) {
			const biome = World.getBiome(x, z);
			return NutrientBiomeBonus[biome] || 0;
		}
	}
}