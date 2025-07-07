namespace JetpackProvider {
	const playerData = {};

	export function getFlying(playerUid: number): boolean {
		return playerData[playerUid] || false;
	}

	export function setFlying(playerUid: number, fly: boolean): boolean {
		return playerData[playerUid] = fly;
	}

	export function onTick(item: ItemInstance, playerUid: number): ItemInstance {
		const energyStored = ChargeItemRegistry.getEnergyStored(item);
		const vel = Entity.getVelocity(playerUid);
		if (item.extra && item.extra.getBoolean("hover")) {
			if (energyStored < 8 || EntityHelper.isOnGround(playerUid)) {
				item.extra.putBoolean("hover", false);
				const client = Network.getClientForPlayer(playerUid);
				if (client) BlockEngine.sendMessage(client, "§4", "message.hover_mode.disabled");
				return item;
			}
			else {
				if (vel.y < 0) {
					EntityHelper.resetFallHeight(playerUid);
				}
				if (World.getThreadTime() % 5 == 0) {
					const energyUse = getFlying(playerUid)? 40 : 20;
					ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energyUse, 0));
					return item;
				}
			}
		} else if (getFlying(playerUid) && energyStored > 8) {
			if (vel.y > -1.2 && vel.y < 0) {
				EntityHelper.resetFallHeight(playerUid);
			}
			ChargeItemRegistry.setEnergyStored(item, energyStored - 8);
			return item;
		}
		return null;
	}
}