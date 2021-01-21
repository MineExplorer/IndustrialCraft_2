namespace RadiationAPI {
	type RadiationSource = {
		x: number,
		y: number,
		z: number,
		radius: number,
		timer: number
	}

	export let items = {};
	export let sources = {};
	export let hazmatArmor = {};

	export function setRadioactivity(itemID: number, duration: number, stack: boolean = false) {
		items[itemID] = {duration: duration, stack: stack};
	}

	export function getRadioactivity(itemID: number): {duration: number, stack: number} {
		return items[itemID];
	}

	export function isRadioactiveItem(itemID: number) {
		return !!items[itemID];
	}

	export function emitItemRadiation(entity: number, itemID: number) {
		let radiation = getRadioactivity(itemID);
		if (radiation) {
			if (radiation.stack) {
				addRadiation(entity, radiation.duration);
			} else {
				setRadiation(entity, radiation.duration);
			}
			return true;
		}
		return false;
	}

	export function getRadiation(entity: number): number {
		return EntityCustomData.getField(entity, "radiation");
	}

	export function resetRadiation(entity: number): void {
		EntityCustomData.putField(entity, "radiation", 0);
	}

	export function setRadiation(entity: number, duration: number): void {
		let currentDuration = EntityCustomData.getField(entity, "duration") || 0;
		if (duration > currentDuration) {
			EntityCustomData.putField(entity, "radiation", duration);
		}
	}

	export function addRadiation(entity: number, duration: number): void {
		duration = Math.max(getRadiation(entity) + duration, 0);
		EntityCustomData.putField(entity, "radiation", duration);
	}

	export function registerHazmatArmor(itemID: number): void {
		hazmatArmor[itemID] = true;
	}

	export function isHazmatArmor(itemID: number): boolean {
		return hazmatArmor[itemID];
	}

	export function checkPlayerArmor(entity: number): boolean {
		for (let i = 0; i < 4; i++) {
			let itemID = Entity.getArmorSlot(entity, i).id;
			if (!isHazmatArmor(itemID)) return true;
		}
		return false;
	}

	export function addEffect(ent: number, duration: number): void {
		let type = Entity.getType(ent);
		if (type == 1 && checkPlayerArmor(ent) || EntityHelper.isMob(ent)) {
			Entity.addEffect(Player.get(), PotionEffect.poison, 1, duration * 20);
			setRadiation(ent, duration);
		}
	}

	export function addEffectInRange(x: number, y: number, z: number, radius: number, duration: number): void {
		let entities = Entity.getAll();
		for (let i in entities) {
			let ent = entities[i];
			if (EntityHelper.canTakeDamage(ent, "radiation") && Entity.getHealth(ent) > 0) {
				let c = Entity.getPosition(ent);
				let xx = Math.abs(x - c.x), yy = Math.abs(y - c.y), zz = Math.abs(z - c.z);
				if (Math.sqrt(xx*xx + yy*yy + zz*zz) <= radius) {
					addEffect(ent, duration);
				}
			}
		}
	}

	export function addRadiationSource(x: number, y: number, z: number, radius: number, duration: number): void {
		sources[x+':'+y+':'+z] = {
			x: x,
			y: y,
			z: z,
			radius: radius,
			timer: duration
		}
	}

	export function onTick(): void {
		if (World.getThreadTime()%20 == 0) {
			for (let i in sources) {
				let source: RadiationSource = sources[i];
				addEffectInRange(source.x, source.y, source.z, source.radius, 10);
				source.timer--;
				if (source.timer <= 0) {
					delete sources[i];
				}
			}

			let entitiesData = EntityCustomData.getAll();
			for (let key in entitiesData) {
				let ent = parseInt(key);
				if (Entity.getType(ent) == 1) {
					let player = new PlayerActor(ent);
					if (checkPlayerArmor(ent)) {
						for (let i = 9; i < 45; i++) {
							let itemID = player.getInventorySlot(i).id;
							emitItemRadiation(ent, itemID);
						}
					}
				}
				let data = entitiesData[key];
				let duration = data["radiation"];
				if (duration > 0) {
					Entity.addEffect(ent, PotionEffect.poison, 1, duration * 20);
					if (Entity.getHealth(ent) == 1) {
						Entity.damageEntity(ent, 1);
					}
					duration--;
				}
			}
		}
	}

	Saver.addSavesScope("radiation",
		function read(scope: {sources: object}) {
			sources = scope.sources || {};
		},
		function save() {
			return {
				sources: sources
			}
		}
	);

	Callback.addCallback("tick", function() {
		onTick();
	});

	Callback.addCallback("EntityDeath", function(entity) {
		if (Entity.getType(entity) == 1) {
			resetRadiation(entity);
		}
	});
}