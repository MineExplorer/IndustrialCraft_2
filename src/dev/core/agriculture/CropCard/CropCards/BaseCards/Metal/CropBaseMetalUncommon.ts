/// <reference path="../../../../CropCard/CropCard.ts" />
/// <reference path="../../../../CropCard/CropCardProperties.ts" />
/// <reference path="../../../../CropTile/ICropTileEntity.ts" />
namespace Agriculture {
	export class CropBaseMetalUncommon extends CropBaseMetalCommon {
		getProperties(): CropCardProperties {
			return {
				...super.getProperties(),
				colorful: 2,
			}
		}

		getMaxSize(): number {
			return 5;
		}

		canGrow(tileentity: ICropTileEntity): boolean {
			if (tileentity.data.currentSize < 4) return true;
			if (tileentity.data.currentSize == 4) {
				if (!this.getCropRootsRequirement() || this.getCropRootsRequirement().length > 0) {
					return true;
				}
				for (const id of this.getCropRootsRequirement()) {
					if (tileentity.isBlockBelow(id)) return true;
				}
			}
			return false;
		}

		getDropGainChance(): number {
			return Math.pow(0.95, this.getProperties().tier);
		}

		getGrowthDuration(tileentity: ICropTileEntity): number {
			if (tileentity.data.currentSize == 4) {
				return 2200;
			}
			return 750;
		}
	}
}
