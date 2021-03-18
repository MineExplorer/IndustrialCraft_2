/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropCarrots extends CropVanilla {
		getID(): string {
			return "carrots";
		}

		getTexture(): string {
			return "ic2_carrots";
		}

		getAttributes(): string[] {
			return ["Orange", "Food", "Carrots"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 2,
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
				id: 391
			};
		}

		getMaxSize(): number {
			return 3;
		}

		getProduct(): ItemInstance {
			return { id: 391, count: 1, data: 0 };
		}

		getSeed(te: ICropTileEntity): ItemInstance {
			return this.getProduct();
		}
	}
}