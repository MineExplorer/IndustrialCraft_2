Callback.addCallback("EntityHurt", function(attacker: number, victim: number, damage: number, type: number) {
	if (damage > 0 && EntityHelper.isPlayer(victim) && EntityHelper.isPhysicalDamage(type)) {
		let defencePoints = 0;
		for (let i = 0; i < 4; i++) {
			const item = Entity.getArmorSlot(victim, i);
			const armor = ItemRegistry.getInstanceOf(item.id);
			if (armor instanceof ArmorNanoSuit || armor instanceof ArmorQuantumSuit) {
				if (ChargeItemRegistry.getEnergyStored(item) >= armor.getEnergyPerDamage() * damage) {
					defencePoints += armor.getExtraDefence();
				}
			}
		}
		if (defencePoints > 0) {
			let damageGot = damage / 5;
			const damageReceived = damageGot * (20 - defencePoints) / 20;
			if (damageGot > 1) {
				damageGot = Math.floor(damageGot);
			}
			let damageAbsorbed = Math.ceil(damageGot - Math.floor(damageReceived));
			const health = Math.min(Entity.getMaxHealth(victim), Entity.getHealth(victim));
			//Game.message(`time: ${World.getThreadTime()}, ${damage} damage of type ${type} taken`);
			//Game.message(`health: ${health}, vanilla reduce: ${damageGot}, mod reduce: ${damageReceived}, delta: ${damageAbsorbed}`);
			if (damageReceived < 1) {
				if (damageGot < 1) {
					if (Math.random() >= damageReceived / damageGot) {
						runOnMainThread(() => {
							const curHealth = Entity.getHealth(victim);
							//Game.message(`Health fix: ${curHealth}/${health}`);
							if (curHealth < health) {
								Entity.setHealth(victim, curHealth + 1);
							}
						});
					}
					return;
				}
				else if (Math.random() < damageReceived) {
					damageAbsorbed--;
				}
			}
			if (damageAbsorbed > 0) {
				Entity.setHealth(victim, health + damageAbsorbed);
			}
		}
	}
});
