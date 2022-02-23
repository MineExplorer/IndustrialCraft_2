/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropPumpkin extends CropVanilla {
		getID(): string {
			return "pumpkin";
		}

		getAttributes(): string[] {
			return ["Orange", "Decoration", "Stem"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 1,
				chemistry: 0,
				consumable: 1,
				defensive: 0,
				colorful: 3,
				weed: 1
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: VanillaItemID.pumpkin_seeds
			};
		}

		getMaxSize(): number {
			return 4;
		}

		getSizeAfterHarvest(tileentity: ICropTileEntity): number {
			return this.getMaxSize() - 1;
		}

		getProduct(): ItemInstance {
			return { id: VanillaBlockID.pumpkin, count: 1, data: 0 };
		}

		getSeed(te: ICropTileEntity): ItemInstance {
			return { id: VanillaItemID.pumpkin_seeds, count: MathUtil.randomInt(1, 4), data: 0 };
		}

		getGrowthDuration(te: ICropTileEntity): number {
			if (te.data.currentSize == 3) return 600;
			return 200;
		}
	}
}