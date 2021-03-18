namespace Agriculture {
	export class CropTerraWart extends CropCard {
		getID(): string {
			return "nether_wart";
		}

		getAttributes(): string[] {
			return ["Blue", "Aether", "Consumable", "Snow"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 5,
				chemistry: 2,
				consumable: 4,
				defensive: 0,
				colorful: 3,
				weed: 0
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: "ItemID.terraWart"
			};
		}

		getMaxSize(): number {
			return 3;
		}

		getDropGainChance(te: ICropTileEntity): number {
			return .8;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			return { id: ItemID.terraWart, count: 1, data: 0 };
		}

		tick(te: ICropTileEntity): void {
			if (te.isBlockBelow(80)) {
				if (te.crop.canGrow(te)) {
					te.data.growthPoints += 100;
				}
			} else if (te.isBlockBelow(88) && Math.random() < 1 / 300) {
				te.data.crop = CropCardManager.getIndexByCropCardID("nether_wart");
				te.crop = CropCardManager.getCardFromID("nether_wart");
			}
		}
	}
}