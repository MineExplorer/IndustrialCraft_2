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
		let type = Entity.getType(entity);
		return isFriendlyMobType(type) || isHostileMobType(type);
	}

	export function canTakeDamage(entity: number, damageSource: number): boolean {
		if (Entity.getHealth(entity) <= 0) return false;
		if (!IC2Config.wireDamageEnabled && damageSource == DamageSource.electricity) return false;

		let type = Entity.getType(entity);
		if (type == 1) {
			if (new PlayerActor(entity).getGameMode() == 1) return false;
			if (damageSource == DamageSource.electricity) {
				let player = new PlayerActor(entity);
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
		let vel = Entity.getVelocity(entity);
		return Math.abs(vel.y - fallVelocity) < 0.0001;
	}

	export function resetFallHeight(entity: number) {
		Entity.addEffect(entity, PotionEffect.slow_falling, 1, 3);
	}

	let insulationMaxVolt = {
		0: 5,
		1: 128,
		2: 512
	}

	export function dealDamageFromCables(entity: number, x: number, y: number, z: number): void {
		let region = BlockSource.getDefaultForActor(entity);
		for (let yy = y - 2; yy <= y + 1; yy++)
		for (let xx = x - 1; xx <= x + 1; xx++)
		for (let zz = z - 1; zz <= z + 1; zz++) {
			let blockID = region.getBlockId(xx, yy, zz);
			let cableData = CableRegistry.getCableData(blockID);
			if (cableData && cableData.insulation < cableData.maxInsulation) {
				let node = EnergyNet.getNodeOnCoords(region, xx, yy, zz);
				if (node && node.baseEnergy == "Eu" && node.energyPower > insulationMaxVolt[cableData.insulation]) {
					let damage = Math.ceil(node.energyPower / 32);
					Entity.damageEntity(entity, damage);
					return;
				}
			}
		}
	}

	Callback.addCallback("tick", function() {
		if (World.getThreadTime()%20 == 0) {
			let entities = Entity.getAll();
			for (let i in entities) {
				let ent = entities[i];
				if (canTakeDamage(ent, DamageSource.electricity)) {
					let coords = Entity.getPosition(ent);
					dealDamageFromCables(ent, Math.floor(coords.x), Math.floor(coords.y), Math.floor(coords.z));
				}
			}
		}
	});
}