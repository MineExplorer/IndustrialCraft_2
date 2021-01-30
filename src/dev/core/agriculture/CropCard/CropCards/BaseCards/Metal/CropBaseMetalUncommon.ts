/// <reference path="../../../../CropCard/CropCard.ts" />
/// <reference path="../../../../CropCard/CropCardProperties.ts" />
/// <reference path="../../../../CropTile/ICropTileEntity.ts" />
namespace Agriculture {
	export abstract class CropBaseMetalUncommon extends CropCard {
		getProperties(): CropCardProperties {
			return {
				tier: 6,
				chemistry: 2,
				consumable: 0,
				defensive: 0,
				colorful: 2,
				weed: 0
			}
		}

		getMaxSize(): number {
			return 5;
		}

		getCropRootsRequirement(): number[] {
			return [];
		}

		getOptimalHarvestSize(tileentity: ICropTileEntity) {
			return 5;
		}

		getRootsLength(tileentity: ICropTileEntity): number {
			return 5;
		}

		canGrow(tileentity: ICropTileEntity): boolean {
			if (tileentity.data.currentSize < 4) return true;
			if (tileentity.data.currentSize == 4) {
				if (!this.getCropRootsRequirement() || !this.getCropRootsRequirement().length) return true;
				for (const id of this.getCropRootsRequirement()) {
					if (tileentity.isBlockBelow(id)) return true;
				}
			}
			return false;
		}

		dropGainChance(): number {
			return Math.pow(0.95, this.getProperties().tier);
		}

		getGrowthDuration(tileentity: ICropTileEntity): number {
			if (tileentity.data.currentSize == 4) {
				return 2200;
			}
			return 750;
		}

		getSizeAfterHarvest(tileentity: ICropTileEntity): number {
			return 2;
		}
	}
}
