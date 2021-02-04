namespace Agriculture {
	export class CropNetherWart extends CropCard {
		getID(): string {
			return "nether_wart";
		}

		getTexture(): string {
			return "ic2_nether_wart";
		}

		getDiscoveredBy(): string {
			return "Notch";
		}

		getAttributes(): string[] {
			return ["Red", "Nether", "Ingredient", "Soulsand"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 5,
				chemistry: 4,
				consumable: 2,
				defensive: 0,
				colorful: 2,
				weed: 1
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: 372
			};
		}

		getMaxSize(): number {
			return 3;
		}

		getDropGainChance(te: ICropTileEntity): number {
			return 2;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return { id: 372, count: 1, data: 0 };
		}

		tick(te: ICropTileEntity): void {
			if (te.isBlockBelow(88)) {
				if (te.crop.canGrow(te)) {
					te.data.growthPoints += 100;
				}
			} else if (te.isBlockBelow(80) && Math.random() < 1 / 300) {
				te.data.crop = CropCardManager.getIndexByCropCardID("terra_wart");
				te.crop = CropCardManager.getCardFromID("terra_wart");
			}
		}
	}
}