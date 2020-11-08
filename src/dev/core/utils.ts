namespace Utils {
	var fallStartHeight = 0;
	var isEnderPearlDamage = false;

	Callback.addCallback("LocalTick", function() {
		isEnderPearlDamage = false;
		if (Utils.isPlayerOnGround()) {
			Utils.resetFallHeight();
		}
	})

	Callback.addCallback("ProjectileHit", function(projectile: number) {
		if (Entity.getType(projectile) == 87) {
			isEnderPearlDamage = true;
		}
	});

	export function getFallDamage(damage: number = 0): number {
		if (isEnderPearlDamage) return damage;
		var pos = Player.getPosition().y;
		var height = fallStartHeight - pos;
		if (height > 7) {
			height = Math.round(height);
		} else if (height > 6) {
			height = Math.round(height - 0.125);
		} else if (height > 5) {
			height = Math.round(height - 0.25);
		} else {
			height = Math.round(height + 3/8);
		}
		
		var damage = height - 3;
		return (damage > 0)? damage : 0;
	}
	
	export function resetFallHeight(): void {
		fallStartHeight = Player.getPosition().y;
	}
	
	export function getFallDamageModifier(): number {
		var slot = Player.getArmorSlot(3);
		if (slot.id != 0 && slot.extra) {
			var enchants = slot.extra.getEnchants();
			var enchantLvl = enchants[Native.Enchantment.FEATHER_FALLING];
			if (enchantLvl) {
				return 1 - 0.12 * enchantLvl;
			}
		}
		return 1;
	}
	
	export function fixFallDamage(damage: number): void {
		var newDamage = Utils.getFallDamage(damage);
		if (newDamage < damage) {
			var armor = Player.getArmorSlot(3);
			if (newDamage == 0) {
				Game.prevent();
			} 
			else if (armor.id != ItemID.quantumBoots && armor.id != ItemID.nanoBoots) {
				var damageModifier = Utils.getFallDamageModifier();
				var damageReduce = Math.floor((damage - newDamage) * damageModifier);
				Entity.setHealth(player, Entity.getHealth(player) + damageReduce);
			}
		}
	}

	export function isPlayerOnGround(): boolean {
		var vel = Player.getVelocity();
		return Math.abs(vel.y - fallVelocity) < 0.0001;
	}
}