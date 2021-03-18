/// <reference path="../../CropCards/BaseCards/CropBaseMushroom.ts"/>
namespace Agriculture {
	// TODO make only base constructor like a flowers
	export class CropRedMushroom extends CropBaseMushroom {
		getID(): string {
			return "red_mushroom";
		}

		getAttributes(): string[] {
			return ["Red", "Food", "Mushroom"];
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: 40
			};
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return { id: 40, count: 1, data: 0 };
		}
	}
}