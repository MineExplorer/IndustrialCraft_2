/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropWheat extends CropVanilla {
		getID(): string {
			return "wheat";
		}

		getTexture(): string {
			return "ic2_wheat";
		}

		getAttributes(): string[] {
			return ["Yellow", "Food", "Wheat"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 1,
				chemistry: 0,
				consumable: 4,
				defensive: 0,
				colorful: 0,
				weed: 2
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: 295
			};
		}

		getMaxSize(): number {
			return 7;
		}

		getSizeAfterHarvest(tileentity: ICropTileEntity): number {
			return 2;
		}

		getProduct(): ItemInstance {
			return { id: 296, count: 1, data: 0 };
		}

		getSeed(te: ICropTileEntity): ItemInstance {
			return { id: 295, count: 1, data: 0 };
		}
	}
}