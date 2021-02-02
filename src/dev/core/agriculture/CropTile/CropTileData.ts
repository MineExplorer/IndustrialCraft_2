namespace Agriculture {
	export type CropTileData = {
		// * may be crop is not needed
		crop: number;
		currentSize: number;
		statGain: number;
		statGrowth: number;
		scanLevel: number;
		statResistance: number;
		storageWater: number;
		storageNutrients: number;
		growthPoints: number;
	}
}
