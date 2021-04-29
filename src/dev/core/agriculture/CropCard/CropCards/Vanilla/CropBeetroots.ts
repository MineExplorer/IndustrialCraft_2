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
				id: VanillaItemID.beetroot_seeds
			};
		}

		getMaxSize(): number {
			return 4;
		}

		getSeed(te: ICropTileEntity): ItemInstance {
			return { id: VanillaItemID.beetroot_seeds, count: 1, data: 0 };
		}

		getProduct(): ItemInstance {
			return IDConverter.getStack("beetroot");
		}
	}
}