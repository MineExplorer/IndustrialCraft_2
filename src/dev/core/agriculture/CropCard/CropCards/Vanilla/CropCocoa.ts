namespace Agriculture {
	export class CropCocoa extends CropCard {
		getID(): string {
			return "cocoa";
		}

		getTexture(): string {
			return "ic2_cocoa";
		}

		getAttributes(): string[] {
			return ["Brown", "Food", "Stem"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 3,
				chemistry: 1,
				consumable: 3,
				defensive: 0,
				colorful: 4,
				weed: 0
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				...IDConverter.getIDData("cocoa_beans"),
				size: 1,
				growth: 0,
				gain: 0,
				resistance: 0
			};
		}

		getMaxSize(): number {
			return 4;
		}

		getOptimalHarvestSize(te: ICropTileEntity): number {
			return 4;
		}

		canGrow(te: ICropTileEntity): boolean {
			return te.data.currentSize <= 3 && te.data.storageNutrients >= 3;
		}

		canBeHarvested(te: ICropTileEntity): boolean {
			return te.data.currentSize == this.getMaxSize();
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return IDConverter.getStack("cocoa_beans", 1);
		}

		getGrowthDuration(te: ICropTileEntity): number {
			if (te.data.currentSize == 3) {
				return 900;
			}
			return 400;
		}

		getSizeAfterHarvest(tileentity: ICropTileEntity): number {
			return 3;
		}
	}
}