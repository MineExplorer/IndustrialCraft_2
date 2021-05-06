namespace RadiationAPI {
	type RadiationSource = {
		x: number,
		y: number,
		z: number,
		dimension: number,
		radius: number,
		timer: number
	}

	export let radioactiveItems = {};
	export let hazmatArmor = {};
	export let sources: RadiationSource[] = [];
	export let effectDuration = {};

	export function setRadioactivity(itemID: number, duration: number, stack: boolean = false): void {
		radioactiveItems[itemID] = {duration: duration, stack: stack};
	}

	export function getRadioactivity(itemID: number): {duration: number, stack: number} {
		return radioactiveItems[itemID];
	}

	export function isRadioactiveItem(itemID: number): boolean {
		return !!radioactiveItems[itemID];
	}

	export function emitItemRadiation(entity: number, itemID: number): void {
		let radiation = getRadioactivity(itemID);
		if (radiation) {
			if (radiation.stack) {
				addRadiation(entity, radiation.duration);
			} else {
				setRadiation(entity, radiation.duration);
			}
		}
	}

	export function getRadiation(playerUid: number): number {
		return effectDuration[playerUid] || 0;
	}

	export function resetRadiation(playerUid: number): void {
		effectDuration[playerUid] = 0;
		Entity.clearEffect(playerUid, PotionEffect.fatal_poison);
	}

	export function setRadiation(playerUid: number, duration: number): void {
		if (duration > getRadiation(playerUid)) {
			effectDuration[playerUid] = duration;
		}
	}

	export function addRadiation(playerUid: number, duration: number): void {
		duration = Math.max(getRadiation(playerUid) + duration, 0);
		effectDuration[playerUid] = duration;
	}

	export function registerHazmatArmor(itemID: number): void {
		hazmatArmor[itemID] = true;
	}

	export function isHazmatArmor(itemID: number): boolean {
		return hazmatArmor[itemID];
	}

	export function hasHazmatSuit(playerUid: number): boolean {
		for (let i = 0; i < 4; i++) {
			let itemID = Entity.getArmorSlot(playerUid, i).id;
			if (!isHazmatArmor(itemID)) return false;
		}
		return true;
	}

	export function addEffect(ent: number, duration: number): void {
		let type = Entity.getType(ent);
		if (type == 1 && !hasHazmatSuit(ent) || EntityHelper.isMob(ent)) {
			Entity.addEffect(ent, PotionEffect.fatal_poison, 1, duration * 20);
			if (type == 1) setRadiation(ent, duration);
		}
	}

	export function addEffectInRange(region: WorldRegion, x: number, y: number, z: number, radius: number, duration: number): void {
		let entities = EntityHelper.getEntitiesInRadius(region, new Vector3(x, y, z), radius);
		for (let ent of entities) {
			if (EntityHelper.canTakeDamage(ent, DamageSource.radiation)) {
				addEffect(ent, duration);
			}
		}
	}

	export function addRadiationSource(x: number, y: number, z: number, dimension: number, radius: number, duration: number): void {
		sources.push({
			x: x,
			y: y,
			z: z,
			dimension: dimension,
			radius: radius,
			timer: duration
		});
	}

	Saver.addSavesScope("radiation",
		function read(scope: {source: RadiationSource[], effects: object}) {
			sources = scope.source || [];
			effectDuration = scope.effects || {};
		},
		function save() {
			return {
				source: sources,
				effects: effectDuration
			}
		}
	);

	Callback.addCallback("tick", function() {
		if (World.getThreadTime()%20 == 0) {
			for (let i = 0; i < sources.length; i++) {
				let source: RadiationSource = sources[i];
				let region = WorldRegion.getForDimension(source.dimension);
				if (!region) continue;
				addEffectInRange(region, source.x, source.y, source.z, source.radius, 10);
				source.timer--;
				if (source.timer <= 0) {
					sources.splice(i--, 1);
				}
			}
		}
	});

	Callback.addCallback("ServerPlayerTick", function(playerUid: number) {
		if (World.getThreadTime()%20 == 0) {
			if (!hasHazmatSuit(playerUid)) {
				let player = new PlayerActor(playerUid);
				for (let i = 9; i < 45; i++) {
					let itemID = player.getInventorySlot(i).id;
					emitItemRadiation(playerUid, itemID);
				}
			}
			let duration = effectDuration[playerUid];
			if (duration > 0) {
				Entity.addEffect(playerUid, PotionEffect.fatal_poison, 1, duration * 20);
				effectDuration[playerUid]--;
			}
		}
	});

	Callback.addCallback("EntityDeath", function(entity: number) {
		if (Entity.getType(entity) == 1 && getRadiation(entity) > 0) {
			resetRadiation(entity);
		}
	});
}