enum DamageSource {
	electricity,
	radiation
}

namespace EntityHelper {
	export function isFriendlyMobType(type: number): boolean {
		if (type >= 10 && type <= 31) return true;
		if (type == 74 || type == 75) return true;
		if (type == 108 || type == 109 || type >= 111 && type <= 113 || type == 115 || type == 118) {
			return true;
		}
		return false;
	}

	export function isHostileMobType(type: number): boolean {
		if (type >= 32 && type <= 59) return true;
		if (type == 104 || type == 105 || type == 110 || type == 114 || type == 116) {
			return true;
		}
		return false;
	}

	export function isMob(entity: number): boolean {
		const type = Entity.getType(entity);
		return isFriendlyMobType(type) || isHostileMobType(type);
	}

	export function isPlayer(entity: number): boolean {
		const type = Entity.getType(entity);
		return type == 1 || type == 63;
	}

	export function canTakeDamage(entity: number, damageSource: number): boolean {
		if (Entity.getHealth(entity) <= 0) return false;
		if (isPlayer(entity)) {
			const player = new PlayerActor(entity);
			if (player.getGameMode() == 1) return false;
			if (damageSource == DamageSource.electricity) {
				if (player.getArmor(0).id == ItemID.hazmatHelmet && player.getArmor(1).id == ItemID.hazmatChestplate &&
				player.getArmor(2).id == ItemID.hazmatLeggings && player.getArmor(3).id == ItemID.rubberBoots) {
					return false;
				}
				return true;
			}
			if (damageSource == DamageSource.radiation) {
				return !RadiationAPI.hasHazmatSuit(entity);
			}
		}
		return isMob(entity);
	}

	export function isOnGround(entity: number): boolean {
		const vel = Entity.getVelocity(entity);
		return Math.abs(vel.y - fallVelocity) < 0.0001;
	}

	export function resetFallHeight(entity: number) {
		Entity.addEffect(entity, PotionEffect.slow_falling, 1, 3);
	}

	export function getEntitiesInRadius(region: WorldRegion, pos: Vector, rad: number): number[] {
		const list = region.listEntitiesInAABB(pos.x - rad, pos.y - rad, pos.z - rad, pos.x + rad, pos.y + rad, pos.z + rad);
		const entities = [];
		for (let ent of list) {
			if (Entity.getDistanceBetweenCoords(pos, Entity.getPosition(ent)) <= rad) {
				entities.push(ent);
			}
		}
		return entities;
	}
}