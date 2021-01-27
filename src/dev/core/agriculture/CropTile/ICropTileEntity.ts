namespace Agriculture {
	export interface ICropTileEntity {
		crop: CropCard;
		data: CropTileData;
		region: BlockSource;
		generateSeeds(tileData: CropTileData): SeedBagStackData;
		pick(): boolean;
		isBlockBelow(reqBlockID: number): boolean;
		performManualHarvest(): boolean;
	}
}
