/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropBeetroots extends CropVanilla {
		getID(): string {
			return "beetroots";
		}

		getAttributes(): string[] {
			return ["Red", "Food", "Beetroot"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 1,
				chemistry: 0,
				consumable: 4,
				defensive: 0,
				colorful: 1,
				weed: 2
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: 458
			};
		}

		getMaxSize(): number {
			return 4;
		}

		getSeed(te: ICropTileEntity): ItemInstance {
			return { id: 458, count: 1, data: 0 };
		}

		getProduct(): ItemInstance {
			return { id: 457, count: 1, data: 0 };
		}
	}
}