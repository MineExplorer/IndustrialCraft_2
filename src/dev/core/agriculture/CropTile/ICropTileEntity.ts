namespace Agriculture {
	export interface ICropTileEntity {
		x: number; y: number; z: number;
		region: WorldRegion;
		crop: CropCard;
		data: CropTileData;
		blockSource: BlockSource;
		generateSeeds(tileData: CropTileData): ItemInstance;
		pick(): boolean;
		isBlockBelow(reqBlockID: number): boolean;
		performManualHarvest(): boolean;
		onLongClick(player: number): boolean;
		updateRender(): void;
	}
}
