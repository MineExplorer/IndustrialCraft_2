namespace Agriculture {
	export class CropBaseMetalUncommon extends CropCard {
		getProperties(): CropCardProperties {
			return {
				tier: 6,
				chemistry: 2,
				consumable: 0,
				defensive: 0,
				colorful: 2,
				weed: 0
			}
		}

		getMaxSize(): number {
			return 5;
		}

		getCropRootsRequirement(): any {

		}

		getOptimalHarvestSize(tileentity: ICropTileEntity) {
			return 5;
		}

		getRootsLength(tileentity: ICropTileEntity): number {
			return 5;
		}

		canGrow(tileentity: ICropTileEntity): boolean {
			if (tileentity.data.currentSize < 4) return true;
			if (tileentity.data.currentSize == 4) {
				if (!this.getCropRootsRequirement() || !this.getCropRootsRequirement().length) return true;
				for (const ind of this.getCropRootsRequirement()) {
					// TODO check eval
					if (tileentity.isBlockBelow(eval(ind))) return true;
				}
			}
			return false;
		}

		dropGainChance(): number {
			return Math.pow(0.95, this.getProperties().tier);
		}

		getGrowthDuration(tileentity: ICropTileEntity): number {
			if (tileentity.data.currentSize == 4) {
				return 2200;
			}
			return 750;
		}

		getSizeAfterHarvest(tileentity: ICropTileEntity): number {
			return 2;
		}
	}
}
