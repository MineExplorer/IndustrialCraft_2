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
				id: VanillaBlockID.red_mushroom
			};
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return IDConverter.getStack("red_mushroom");
		}
	}
}