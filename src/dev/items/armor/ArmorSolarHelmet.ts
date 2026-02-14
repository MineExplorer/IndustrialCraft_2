/// <reference path="./ArmorIC2.ts" />

class ArmorSolarHelmet extends ArmorIC2
implements ArmorListeners {
	constructor(stringID: string, name: string, params: ArmorParams) {
		super(stringID, name, params);
		this.preventDamaging();
	}

	onTick(item: ItemInstance, index: number, playerUid: number): void {
		const tickRate = 20;
		const time = World.getWorldTime() % 24000;
		if (World.getThreadTime() % tickRate == 0 && (time >= 23500 || time < 12550)) {
			const pos = Entity.getPosition(playerUid);
			const region = WorldRegion.getForActor(playerUid);
			if (region.canSeeSky(pos) && (!World.getWeather().rain || region.getLightLevel(pos) > 14)) {
				for (let i = 1; i < 4; i++) {
					let energy = tickRate;
					const armor = Entity.getArmorSlot(playerUid, i);
					const energyAdd = ChargeItemRegistry.addEnergyTo(armor, "Eu", energy, 4, true);
					if (energyAdd > 0) {
						energy -= energyAdd;
						Entity.setArmorSlot(playerUid, i, armor.id, 1, armor.data, armor.extra);
						if (energy <= 0) break;
					}
				}
			}
		}
	}
}