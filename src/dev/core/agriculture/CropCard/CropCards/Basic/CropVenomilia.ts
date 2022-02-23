namespace Agriculture {
	export class CropVenomilia extends CropCard {
		getID(): string {
			return "venomilia";
		}

		getAttributes(): string[] {
			return ["Purple", "Flower", "Tulip", "Poison"];
		}

		getProperties(): CropCardProperties {
			return {
				tier: 3,
				chemistry: 3,
				consumable: 1,
				defensive: 3,
				colorful: 3,
				weed: 3
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				addToCreative: false
			};
		}

		getMaxSize(): number {
			return 6;
		}

		getOptimalHarvestSize(): number {
			return 4;
		}

		getDiscoveredBy(): string {
			return "raGan";
		}

		canGrow(te: ICropTileEntity): boolean {
			const light = te.region.getLightLevel(te);
			return (te.data.currentSize <= 4 && light >= 12) || te.data.currentSize == 5;
		}

		canBeHarvested(te: ICropTileEntity): boolean {
			return te.data.currentSize >= 4;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			if (te.data.currentSize == 5) {
				return new ItemStack(ItemID.grinPowder, 1, 0);
			}
			if (te.data.currentSize >= 4) {
				return IDConverter.getStack("purple_dye", 1);
			}
			return null;
		}

		getSizeAfterHarvest(tileentity: ICropTileEntity): number {
			return 3;
		}

		getGrowthDuration(te: ICropTileEntity): number {
			if (te.data.currentSize >= 3) return 600;
			return 400;
		}

		onRightClick(te: ICropTileEntity, entity: number): boolean {
			if (Entity.getCarriedItem(entity).id != 0) {
				return this.onEntityCollision(te, entity);
			}
			return te.performManualHarvest();
		}

		onLeftClick(te: ICropTileEntity, entity: number): boolean {
			if (Entity.getCarriedItem(entity).id != 0) {
				this.onEntityCollision(te, entity);
			}
			return te.pick();
		}

		onEntityCollision(te: ICropTileEntity, entity: number): boolean {
			if (te.data.currentSize == 5) {
				const armorSlot = new PlayerEntity(entity).getArmor(3);
				if (MathUtil.randomInt(0, 50) && armorSlot.id != 0) {
					return super.onEntityCollision(te, entity);
				}
				Entity.addEffect(entity, PotionEffect.poison, 1, (MathUtil.randomInt(0, 10) + 5) * 20);
				te.data.currentSize = 4;
				te.updateRender();
			}
			return super.onEntityCollision(te, entity);
		}

		isWeed(te: ICropTileEntity): boolean {
			return te.data.currentSize == 5 && te.data.statGrowth >= 8;
		}
	}
}