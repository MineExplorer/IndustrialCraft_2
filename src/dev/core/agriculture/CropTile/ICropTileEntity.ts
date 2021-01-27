namespace Agriculture {
	export interface ICropTileEntity {
		x: number; y: number; z: number;
		crop: CropCard;
		data: CropTileData;
		region: BlockSource;
		generateSeeds(tileData: CropTileData): SeedBagStackData;
		pick(): boolean;
		isBlockBelow(reqBlockID: number): boolean;
		performManualHarvest(): boolean;
	}
}
