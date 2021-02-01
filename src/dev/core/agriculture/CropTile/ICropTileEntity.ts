namespace Agriculture {
	export interface ICropTileEntity {
		x: number; y: number; z: number;
		region: WorldRegion;
		crop: CropCard;
		data: CropTileData;
		blockSource: BlockSource;
		generateSeeds(tileData: CropTileData): SeedBagStackData;
		pick(): boolean;
		isBlockBelow(reqBlockID: number): boolean;
		performManualHarvest(): boolean;
		updateRender(): void;
	}
}
