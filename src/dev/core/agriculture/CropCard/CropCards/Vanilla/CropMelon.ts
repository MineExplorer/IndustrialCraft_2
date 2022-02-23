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
				id: VanillaItemID.melon_seeds
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
				return { id: VanillaBlockID.melon_block, count: 1, data: 0 };
			}
			return IDConverter.getStack("melon_slice", MathUtil.randomInt(2, 6));
		}

		getSeed(te: ICropTileEntity): ItemInstance {
			return { id: VanillaItemID.melon_seeds, count: MathUtil.randomInt(1, 3), data: 0 };
		}

		getGrowthDuration(te: ICropTileEntity): number {
			if (te.data.currentSize == 3) {
				return 700;
			}
			return 250;
		}
	}
}