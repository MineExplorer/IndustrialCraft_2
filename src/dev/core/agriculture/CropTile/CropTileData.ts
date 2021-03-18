namespace Agriculture {
	export type CropTileData = {
		// * may be crop is not needed
		crop: number;
		crossingBase: boolean;
		dirty: boolean;
		currentSize: number;
		statGain: number;
		statGrowth: number;
		scanLevel: number;
		statResistance: number;
		terrainAirQuality: number;
		terrainHumidity: number;
		terrainNutrients: number;
		storageWater: number;
		storageNutrients: number;
		storageWeedEX: number;
		growthPoints: number;
	}
}
