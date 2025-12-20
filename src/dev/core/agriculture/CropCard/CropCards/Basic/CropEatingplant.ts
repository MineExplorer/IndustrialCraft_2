/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropEatingplant extends CropCard {
		getID(): string {
			return "eatingplant";
		}

		getAttributes(): string[] {
			return ["Bad", "Food"];
		}

		getDiscoveredBy(): string {
			return "Hasudako";
		}

		getProperties(): CropCardProperties {
			return {
				tier: 6,
				chemistry: 1,
				consumable: 1,
				defensive: 3,
				colorful: 1,
				weed: 4
			};
		}

		getMaxSize(): number {
			return 6;
		}

		getOptimalHarvestSize(te: ICropTileEntity): number {
			return 4;
		}

		canGrow(te: ICropTileEntity): boolean {
			let light = te.region.getLightLevel(te);
			if (te.data.currentSize < 3) {
				return light > 10;
			}
			return te.isBlockBelow(10) && te.data.currentSize < this.getMaxSize() && light > 10;
		}

		canBeHarvested(te: ICropTileEntity): boolean {
			return te.data.currentSize >= 4 && te.data.currentSize < 6;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			if (te.data.currentSize >= 4 && te.data.currentSize < 6) {
				return { id: 81, count: 1, data: 0 };
			}
			return null;
		}

		tick(te: ICropTileEntity): void {
			if (te.data.currentSize == 1) return;

			const range = 1;
			const entities = te.region.listEntitiesInAABB(
				te.x + .5 - range, te.y, te.z + .5 - range,
				te.x + .5 + range, te.y + range * 2, te.z + .5 + range
			);
			for (let entity of entities) {
				if (!(EntityHelper.isPlayer(entity) && new PlayerEntity(entity).getGameMode() == 0) 
					&& !EntityHelper.isMob(entity)) continue;
				
				Entity.damageEntity(entity, te.data.currentSize * 2);
				if (!this.hasMetalArmor(entity)) {
					Entity.addEffect(entity, PotionEffect.poison, 1, 50);
				}
				if (te.crop.canGrow(te)) te.data.growthPoints += 100;
				te.region.dropAtBlock(te.x, te.y, te.z, 367, 1, 0);
			}
		}

		hasMetalArmor(entity: number): boolean {
			for (let i = 0; i < 4; i++) {
				const armorSlot = Entity.getArmorSlot(entity, i);
				// break loop if no armor or leather armor
				if (armorSlot.id == 0 || (armorSlot.id >= 298 && armorSlot.id <= 301)) return false;
			}
			return true;
		}

		getGrowthDuration(te: ICropTileEntity): number {
			const multiplier = 1;
			//TODO: compare with PC version when BiomeDictionary will be available
			return Math.round(super.getGrowthDuration(te) * multiplier);
		}

		getSizeAfterHarvest(te: ICropTileEntity): number {
			return 1;
		}

		getRootsLength(te: ICropTileEntity): number {
			return 5;
		}
	}
}