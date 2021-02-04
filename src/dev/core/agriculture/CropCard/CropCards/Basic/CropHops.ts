/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropHops extends CropCard {
		getID(): string {
			return "hops";
		}

		getAttributes(): string[] {
			return ["Green", "Ingredient", "Wheat"];
		}

		getDiscoveredBy(): string {
			return "Snoochy";
		}

		getProperties(): CropCardProperties {
			return {
				tier: 5,
				chemistry: 2,
				consumable: 2,
				defensive: 0,
				colorful: 1,
				weed: 1
			};
		}

		getMaxSize(): number {
			return 7;
		}

		canGrow(te: ICropTileEntity): boolean {
			const light = te.region.getLightLevel(te);
			return te.data.currentSize < 7 && light >= 9;
		}

		getGrowthDuration(te: ICropTileEntity): number {
			return 600;
		}

		canBeHarvested(te: ICropTileEntity): boolean {
			return te.data.currentSize >= 4;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			// TODO check hops count
			return { id: ItemID.hops, count: 1, data: 0 };
		}

		getSizeAfterHarvest(te: ICropTileEntity): number {
			return 3;
		}
	}
}