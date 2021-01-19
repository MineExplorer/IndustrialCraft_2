interface ICropTileEntity {
	crop: CropCard;
	data: any; // Change it
	generateSeeds(tileData: any): SeedBagStackData; // Change tileData type
	pick(): boolean;
	performManualHarvest(): boolean;
}