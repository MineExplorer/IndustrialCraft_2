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

			let entity = Entity.findNearest({ x: te.x + .5, y: te.y + .5, z: te.z + .5 }, null, 2);
			if (!entity) return;

			Entity.damageEntity(entity, te.data.currentSize * 2);
			if (Entity.getType(entity) == EntityType.PLAYER && !this.hasMetalArmor(entity)) {
				Entity.addEffect(entity, PotionEffect.poison, 1, 50);
			}
			if (te.crop.canGrow(te)) te.data.growthPoints += 100;
			World.drop(te.x + .5, te.y + .5, te.z + .5, 367, 1, 0);
		}

		hasMetalArmor(player: number): boolean {
			for (let i = 0; i < 4; i++) {
				const armorSlot = new PlayerEntity(player).getArmor(i);
				if (armorSlot.id > 297 && armorSlot.id < 302) return false;
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