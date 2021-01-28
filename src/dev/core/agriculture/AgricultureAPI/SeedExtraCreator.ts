/// <reference path="../CropTile/CropTileData.ts" />
namespace Agriculture {
	export class SeedExtraCreator {
		generateExtraFromValues(data: CropTileData) {
			const extra = new ItemExtraData();
			extra.putInt("growth", data.statGrowth);
			extra.putInt("gain", data.statGain);
			extra.putInt("resistance", data.statResistance);
			extra.putInt("scan", data.scanLevel);
			return extra;
		}

		getDefaultExtra(cardIndex: number) {
			const extra = new ItemExtraData();
			const card = AgricultureAPI.getCropCardByIndex(cardIndex);
			const baseSeed = card.getBaseSeed();
			extra.putInt("growth", baseSeed.growth);
			extra.putInt("gain", baseSeed.gain);
			extra.putInt("resistance", baseSeed.resistance);
			extra.putInt("scan", 4);
			return extra;
		}
	}
}