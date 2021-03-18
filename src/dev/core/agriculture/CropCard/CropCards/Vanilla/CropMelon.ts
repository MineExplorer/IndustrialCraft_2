/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropMelon extends CropVanilla {
		getID(): string {
			return "melon";
		}

		getAttributes(): string[] {
			return ["Green", "Food", "Stem"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 2,
				chemistry: 0,
				consumable: 4,
				defensive: 0,
				colorful: 2,
				weed: 0
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: 362
			};
		}

		getMaxSize(): number {
			return 4;
		}

		getSizeAfterHarvest(tileentity: ICropTileEntity): number {
			return this.getMaxSize() - 1;
		}

		getProduct(): ItemInstance {
			if (Math.random() < 0.5) {
				return { id: 103, count: 1, data: 0 };
			}
			return { id: 360, count: randomInt(2, 6), data: 0 };
		}

		getSeed(te: ICropTileEntity): ItemInstance {
			return { id: 362, count: randomInt(1, 3), data: 0 };
		}

		getGrowthDuration(te: ICropTileEntity): number {
			if (te.data.currentSize == 3) {
				return 700;
			}
			return 250;
		}
	}
}