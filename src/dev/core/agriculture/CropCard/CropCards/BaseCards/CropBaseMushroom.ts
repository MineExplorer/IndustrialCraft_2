namespace Agriculture {
	export abstract class CropBaseMushroom extends CropCard {
		getProperties(): CropCardProperties {
			return {
				tier: 2,
				chemistry: 0,
				consumable: 4,
				defensive: 0,
				colorful: 0,
				weed: 4
			}
		}

		getMaxSize(): number {
			return 3;
		}

		canGrow(tileentity: ICropTileEntity): boolean {
			return tileentity.data.currentSize < this.getMaxSize() && tileentity.data.storageWater > 0;
		}

		getGrowthDuration(tileentity: ICropTileEntity): number {
			return 200;
		}
	}
}
