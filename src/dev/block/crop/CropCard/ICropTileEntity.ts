interface ICropTileEntity {
	crop: CropCard;
	data: CropTileData;
	generateSeeds(tileData: CropTileData): SeedBagStackData;
	pick(): boolean;
	performManualHarvest(): boolean;
}