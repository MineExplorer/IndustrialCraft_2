/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropReed extends CropCard {
		getID(): string {
			return "reed";
		}

		getAttributes(): string[] {
			return ["Reed"];
		}

		getDiscoveredBy(): string {
			return "Notch";
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

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: IDConverter.getID("reeds"),
				size: 1,
				growth: 3,
				gain: 0,
				resistance: 2
			};
		}

		getMaxSize(): number {
			return 3;
		}

		canBeHarvested(te: ICropTileEntity) {
			return te.data.currentSize > 1;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return IDConverter.getStack("reeds",  te.data.currentSize - 1);
		}

		onEntityCollision(te: ICropTileEntity, entity: number) { return false }

		getGrowthDuration(te: ICropTileEntity): number {
			return 200;
		}
	}
}