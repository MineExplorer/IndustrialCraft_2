/// <reference path="../../../../CropCard/CropCard.ts" />
/// <reference path="../../../../CropCard/CropCardProperties.ts" />
/// <reference path="../../../../CropTile/ICropTileEntity.ts" />
namespace Agriculture {
	export abstract class CropBaseMetalCommon extends CropCard {
		getProperties(): CropCardProperties {
			return {
				tier: 6,
				chemistry: 2,
				consumable: 0,
				defensive: 0,
				colorful: 1,
				weed: 0
			}
		}

		getMaxSize(): number {
			return 4;
		}

		getRootsLength(te: ICropTileEntity) {
			return 5
		}

		getCropRootsRequirement(): number[] {
			return [];
		}

		canGrow(tileentity: ICropTileEntity): boolean {
			if (tileentity.data.currentSize < 3) return true;
			if (tileentity.data.currentSize == 3) {
				// TODO check it
				if (!this.getCropRootsRequirement() || this.getCropRootsRequirement().length == 0) return true;
				for (const id of this.getCropRootsRequirement()) {
					if (tileentity.isBlockBelow(id)) return true;
				}
			}
			return false;
		}

		dropGainChance(te: ICropTileEntity): number {
			return super.dropGainChance(te) / 2;
			// return AgricultureAPI.abstractFunctions["IC2CropCard"] / 2;
		}

		getGrowthDuration(tileentity: ICropTileEntity): number {
			if (tileentity.data.currentSize == 3) {
				return 2000;
			}
			return 800;
		}

		getSizeAfterHarvest(tileentity: ICropTileEntity): number {
			return 2;
		}
	}
}
