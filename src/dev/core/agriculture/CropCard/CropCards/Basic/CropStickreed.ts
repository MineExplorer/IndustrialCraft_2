/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropStickreed extends CropCard {
		getID(): string {
			return "stickreed";
		}

		getAttributes(): string[] {
			return ["Reed", "Resin"];
		}

		getDiscoveredBy(): string {
			return "raa1337";
		}

		getProperties(): CropCardProperties {
			return {
				tier: 2,
				chemistry: 0,
				consumable: 0,
				defensive: 2,
				colorful: 0,
				weed: 2
			};
		}

		getMaxSize(): number {
			return 4;
		}

		getOptimalHarvestSize(te: ICropTileEntity) {
			return 4;
		}

		canGrow(te: ICropTileEntity): boolean {
			return te.data.currentSize < this.getMaxSize();
		}

		canBeHarvested(te: ICropTileEntity) {
			return te.data.currentSize > 1;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			if (te.data.currentSize <= 3) {
				return { id: 338, count: te.data.currentSize - 1, data: 0 };
			}
			return { id: ItemID.latex, count: 1, data: 0 };
		}

		getSizeAfterHarvest(te: ICropTileEntity): number {
			return 1;
		}

		onEntityCollision(te: ICropTileEntity, entity: number) { return false }

		getGrowthDuration(te: ICropTileEntity): number {
			if (te.data.currentSize == 4) return 400;
			return 100;
		}
	}
}