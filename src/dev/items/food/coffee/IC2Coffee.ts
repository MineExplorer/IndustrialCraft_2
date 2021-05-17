namespace IC2Coffee {

	export type CofeeEffect = {
		amplifier: number;
		effectTimer: number;
	};

	let entityEffects = {};

	export function amplifyEffect(entity: number, potionId: number, maxAmplifier: number, extraDuration: number): number {
		const effect = entityEffects[entity];
		if (effect) {
			effect.effectTimer += extraDuration;
            if (effect.amplifier < maxAmplifier) effect.amplifier++;

            Entity.addEffect(entity, potionId, effect.amplifier, effect.effectTimer);
            return effect.amplifier;
		}
		Entity.addEffect(entity, potionId, 1, 300);
		entityEffects[entity] = {
			amplifier: 1,
			effectTimer: 300
		};
        return 1;
    }

	export function serverPlayerTick(playerUid: number, isPlayerDead?: boolean): void {
		let effect = entityEffects[playerUid];
		if (effect) {
			if (effect.effectTimer > 1) {
				effect.effectTimer--;
				return;
			}
			if (effect.effectTimer == 1) {
				delete entityEffects[playerUid];
			}
		}
    }

	export function onDeath(entity: number, attacker: number, damageType: number): void {
		if (EntityHelper.isPlayer(entity) && entityEffects[entity]) return;
		delete entityEffects[entity];
	}

	export function foodEaten(food: number, ratio: number, player: number): void {
		let maxAmplifier = 0;
		let extraDuration = 0;
		const playerEntity = new PlayerEntity(player);
		const itemId = playerEntity.getCarriedItem().id;
		const effect = entityEffects[player];
		switch (itemId) {
			case ItemID.mugCoffee:
				maxAmplifier = 6;
				extraDuration = 1200;
				break;
			case ItemID.mugColdCoffee:
				maxAmplifier = 1;
				extraDuration = 600;
				break;
			case ItemID.mugDarkCoffee:
				maxAmplifier = 5;
				extraDuration = 1200;
				break;
			case ItemID.terraWart:
				if (effect) {
					if (effect.amplifier < 3) return;
					effect.amplifier = 2;
				}
				return;
			case VanillaItemID.bucket:
				if (effect) {
					effect.amplifier = 0;
					effect.effectTimer = 0;
				}
				break;
			default: return;
		}
		let highest = 0;
		let x = amplifyEffect(player, PotionEffect.movementSpeed, maxAmplifier, extraDuration);
		if (x > highest) highest = x;
		x = amplifyEffect(player, PotionEffect.digSpeed, maxAmplifier, extraDuration);

		if (x > highest) highest = x;
		if (itemId == ItemID.mugCoffee) highest -= 2;

		if (highest >= 3) {
			var badEffectTime = (highest - 2) * 200;
			Entity.addEffect(player, PotionEffect.confusion, 1, badEffectTime);
			// * at this moment effect can be recreated by amplifyEffect
			entityEffects[player].effectTimer = badEffectTime;
			if (highest >= 4) {
				Entity.addEffect(player, PotionEffect.harm, highest - 3, 1);
			}
		}
		playerEntity.addItemToInventory(ItemID.mugEmpty, 1, 0);
	}

	export function craftFunction(api: Recipes.WorkbenchFieldAPI, field: UI.Slot[], result: ItemInstance): void {
		for (const item of field) {
			if (item.id == VanillaItemID.bucket) {
				if (item.count == 1) {
					item.data = 0;
				} else {
					api.decreaseFieldSlot(+i);
					// TODO: make addItemToInventory to player
					Player.addItemToInventory(VanillaItemID.bucket, 1, 0);
				}
			}
			else {
				api.decreaseFieldSlot(+i);
			}
		}
	}

	Callback.addCallback("FoodEaten", foodEaten);
	Callback.addCallback("ServerPlayerTick", serverPlayerTick);
	Callback.addCallback("EntityDeath", onDeath);

	Callback.addCallback("PreLoaded", function() {
		Recipes.addShaped({id: ItemID.mugColdCoffee, count: 1, data: 0}, [
			"x",
			"y",
			"z",
		], ['x', ItemID.coffeePowder, 0, 'y', 325, 8, 'z', ItemID.mugEmpty, 0], IC2Coffee.craftFunction);

		Recipes.addShaped({id: ItemID.mugCoffee, count: 1, data: 0}, [
			"x",
			"y",
			"z",
		], ['x', 353, 0, 'y', 325, 1, 'z', ItemID.mugDarkCoffee, 0], IC2Coffee.craftFunction);

		Recipes.addFurnace(ItemID.mugColdCoffee, ItemID.mugDarkCoffee, 0);
	});
}