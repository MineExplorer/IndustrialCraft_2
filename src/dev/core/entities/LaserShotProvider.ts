namespace LaserShotProvider {
	let laserShots: LaserShot[] = [];

	export function shootLaser(player: number, pos: Vector, vel: Vector3, params: {power: number, range?: number, blockBreaks?: number, smelt?: boolean, dropChance?: number}) {
		const laser = new LaserShot(player, pos, vel, params);
		laserShots.push(laser);
	}

	export function removeShot(laser: LaserShot) {
		const index = laserShots.indexOf(laser);
		if (index >= 0) {
			Entity.remove(laser.entity);
			laserShots.splice(index, 1);
		}
	}

	export function updateAll() {
		for (let i = 0; i < laserShots.length; i++) {
			const laser = laserShots[i];
			const distance = Entity.getDistanceBetweenCoords(Entity.getPosition(laser.entity), laser.startPos)
			if (laser.power <= 0 || laser.blockBreaks <= 0 || distance > laser.range) {
				Entity.remove(laser.entity);
				laserShots.splice(i, 1);
				i--;
			} else {
				if (laser.hitBlock) {
					laser.hitBlock = false;
				} else {
					laser.power -= 0.25;
				}
				const vel = laser.velocity;
				Entity.setVelocity(laser.entity, vel.x, vel.y, vel.z);
				const c = Entity.getPosition(laser.entity);
				laser.checkBlock(Math.floor(c.x), Math.floor(c.y), Math.floor(c.z));
			}
		}
	}

	export function onProjectileHit(projectile: number, target) {
		for (let laser of laserShots) {
			if (laser.entity == projectile) {
				laser.onProjectileHit(target);
				break;
			}
		}
	}
}

Callback.addCallback("tick", function() {
	LaserShotProvider.updateAll();
});

Callback.addCallback("ProjectileHit", function(projectile, item, target) {
	LaserShotProvider.onProjectileHit(projectile, target);
});
