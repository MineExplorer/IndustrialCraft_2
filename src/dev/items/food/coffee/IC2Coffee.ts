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

	function coffeeEffectTick(player: number, isPlayerDead?: boolean): void {
		let effect = entityEffects[player];
		if (effect) {
			if (effect.effectTimer > 1) {
				effect.effectTimer--;
			}
			else {
				delete entityEffects[player];
			}
		}
    }

	function onDeath(entity: number, attacker: number, damageType: number): void {
		if (EntityHelper.isPlayer(entity) && entityEffects[entity]) return;
		delete entityEffects[entity];
	}

	function onFoodEaten(food: number, ratio: number, player: number): void {
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
					delete entityEffects[player];
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
			let badEffectTime = (highest - 2) * 200;
			Entity.addEffect(player, PotionEffect.confusion, 1, badEffectTime);
			// * at this moment effect can be recreated by amplifyEffect
			entityEffects[player].effectTimer = badEffectTime;
			if (highest >= 4) {
				Entity.addEffect(player, PotionEffect.harm, highest - 3, 1);
			}
		}
		playerEntity.addItemToInventory(ItemID.mugEmpty, 1, 0);
	}

	export function craftFunction(api: Recipes.WorkbenchFieldAPI, field: UI.Slot[], result: ItemInstance, player: number): void {
		for (let i = 0; i < 9; i++) {
			const item = field[i];
			const emptyItem = LiquidRegistry.getEmptyItem(item.id, item.data);
			if (emptyItem) {
				const playerEntity = new PlayerEntity(player);
				playerEntity.addItemToInventory(emptyItem.id, 1, emptyItem.data);
			}
			api.decreaseFieldSlot(i);
		}
	}

	Callback.addCallback("FoodEaten", onFoodEaten);
	Callback.addCallback("ServerPlayerTick", coffeeEffectTick);
	Callback.addCallback("EntityDeath", onDeath);
}