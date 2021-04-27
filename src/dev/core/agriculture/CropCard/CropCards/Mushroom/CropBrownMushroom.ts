/// <reference path="../../CropCards/BaseCards/CropBaseMushroom.ts"/>
namespace Agriculture {
	// TODO make only base constructor like a flowers
	export class CropBrownMushroom extends CropBaseMushroom {
		getID(): string {
			return "brown_mushroom";
		}

		getAttributes(): string[] {
			return ["Brown", "Food", "Mushroom"];
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: VanillaBlockID.brown_mushroom
			};
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return IDConverter.getStack("red_mushroom");
		}
	}
}