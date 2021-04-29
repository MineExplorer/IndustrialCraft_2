/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	// TODO check base card with potato
	export class CropPotato extends CropVanilla {
		getID(): string {
			return "potato";
		}

		getAttributes(): string[] {
			return ["Yellow", "Food", "Potato"];
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
				id: VanillaItemID.potato
			};
		}

		getMaxSize(): number {
			return 4;
		}
		// TODO rewrite to get base IC2Card canGrow
		canGrow(te: ICropTileEntity): boolean {
			return te.data.currentSize < te.crop.getMaxSize();
		}

		getOptimalHarvestSize(te: ICropTileEntity): number {
			return 3;
		}

		canBeHarvested(te: ICropTileEntity): boolean {
			return te.data.currentSize >= this.getOptimalHarvestSize(te);
		}

		getGain(te: ICropTileEntity): ItemInstance {
			if (te.data.currentSize >= 4 && Math.random() < 0.05) {
				return { id: VanillaItemID.poisonous_potato, count: 1, data: 0 };
			} else if (te.data.currentSize >= 3) {
				return { id: VanillaItemID.potato, count: 1, data: 0 };
			}
			return null;
		}

		getSeed(te: ICropTileEntity): ItemInstance {
			// TODO check seed of CropPotato
			return { id: 0, count: 1, data: 0 }
		}

		getSizeAfterHarvest(tileentity: ICropTileEntity): number {
			return 1;
		}
	}
}