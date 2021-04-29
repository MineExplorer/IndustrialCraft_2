namespace Agriculture {
	export interface ICropTileEntity extends TileEntity {
		region: WorldRegion;
		crop: CropCard;
		data: CropTileData;
		generateSeeds(tileData: CropTileData): ItemInstance;
		pick(): boolean;
		isBlockBelow(reqBlockID: number): boolean;
		performManualHarvest(): boolean;
		onLongClick(player: number): boolean;
		updateRender(): void;
	}
}
