/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropRedWheat extends CropCard {
		getID(): string {
			return "redwheat";
		}

		getAttributes(): string[] {
			return ["Red", "Redstone", "Wheat"];
		}

		getDiscoveredBy(): string {
			return "raa1337";
		}

		getProperties(): CropCardProperties {
			return {
				tier: 6,
				chemistry: 3,
				consumable: 0,
				defensive: 0,
				colorful: 2,
				weed: 0
			};
		}

		getMaxSize(): number {
			return 7;
		}

		getOptimalHarvestSize(te: ICropTileEntity) {
			return this.getMaxSize();
		}

		canGrow(te: ICropTileEntity): boolean {
			const light = te.region.getLightLevel(te);
			return te.data.currentSize < 7 && light <= 10 && light >= 5;
		}

		getDropGainChance(te: ICropTileEntity): number {
			return .5;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return new ItemStack(Math.random() < 0.5 ? 331 : 295, 1, 0);
		}

		getGrowthDuration(te: ICropTileEntity): number {
			return 600;
		}

		getSizeAfterHarvest(te: ICropTileEntity): number {
			return 2;
		}
	}
}