/// <reference path="../../../CropCard/CropCard.ts" />
/// <reference path="../../../CropCard/CropCardProperties.ts" />
/// <reference path="../../../CropTile/ICropTileEntity.ts" />
namespace Agriculture {
	export class CropColorFlowerCard extends CropCard {
		constructor(protected id: string, protected attributes: string[], protected dye: ItemInstance, protected baseSeed?: BaseSeed) {
			super();
		}

		getID(): string {
			return this.id;
		}

		getAttributes(): string[] {
			return this.attributes;
		}

		getDiscoveredBy(): string {
			return "Notch";
		}

		getProperties(): CropCardProperties {
			return {
				tier: 2,
				chemistry: 1,
				consumable: 1,
				defensive: 0,
				colorful: 5,
				weed: 1
			}
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				...this.baseSeed
			};
		}

		getMaxSize(): number {
			return 4;
		}

		getOptimalHarvestSize(): number {
			return 4;
		}

		canGrow(tileentity: ICropTileEntity): boolean {
			const light = tileentity.region.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
			return tileentity.data.currentSize < tileentity.crop.getMaxSize() && light >= 12;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return this.dye;
		}

		getSizeAfterHarvest(te: ICropTileEntity): number {
			return 3
		}

		getGrowthDuration(te: ICropTileEntity): number {
			if (te.data.currentSize == 3) return 600;
			return 400;
		}
	}
}
