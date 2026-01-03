/// <reference path="./IJetpack.ts" />

namespace JetpackProvider {
	const jetpacks: {[key: number]: IJetpack} = {};
	let playerData = {};

	export function registerItem(itemId: number, instance: IJetpack): void {
		ToolHUD.setButtonFor(itemId, "button_fly");
		ToolHUD.setButtonFor(itemId, "button_hover");
		jetpacks[itemId] = instance;
	}

	export function canBeFlying(item: ItemInstance, playerPos: Vector): boolean {
		const jetpack = jetpacks[item.id];
		if (!jetpack) return true; // reverse compatibility
		return jetpack.canFly(item, playerPos);
	}

	export function getFlying(playerUid: number): boolean {
		return playerData[playerUid] || false;
	}

	export function setFlying(playerUid: number, fly: boolean): boolean {
		return playerData[playerUid] = fly;
	}

	export function onTick(item: ItemInstance, playerUid: number): ItemInstance {
		const energyStored = ChargeItemRegistry.getEnergyStored(item);
		const canFly = canBeFlying(item, Entity.getPosition(playerUid));
		const vel = Entity.getVelocity(playerUid);
		if (item.extra && item.extra.getBoolean("hover")) {
			if (!canFly || EntityHelper.isOnGround(playerUid)) {
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
		} else if (getFlying(playerUid) && canFly) {
			if (vel.y > -1.2 && vel.y < 0) {
				EntityHelper.resetFallHeight(playerUid);
			}
			ChargeItemRegistry.setEnergyStored(item, energyStored - 8);
			return item;
		}
		return null;
	}

	Callback.addCallback("ServerLevelLeft", function() {
		playerData = {};
	});
}