namespace Agriculture {
	export class CropWeed extends CropCard {
		getID(): string {
			return "weed";
		}

		getAttributes(): string[] {
			return ["Weed", "Bad"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 0,
				chemistry: 0,
				consumable: 0,
				defensive: 1,
				colorful: 0,
				weed: 5
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				addToCreative: false
			};
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return null;
		}

		onLeftClick(te: ICropTileEntity, player: number): boolean {
			return false;
		}

		canBeHarvested(te: ICropTileEntity): boolean {
			return false;
		}

		onEntityCollision(te: ICropTileEntity, entity: number): boolean {
			return false;
		}
	}
}