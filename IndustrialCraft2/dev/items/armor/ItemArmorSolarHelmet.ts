/// <reference path="./ItemArmorIC2.ts" />

class ItemArmorSolarHelmet
extends ItemArmorIC2
implements OnTickListener {
	canSeeSky: boolean = false;
	
	constructor(nameID: string, name: string, params: ArmorParams) {
		super(nameID, name, params);
	}

	onTick(item: ItemInstance, index: number, player: number): boolean {
		let time = World.getWorldTime()%24000;
		let p = Entity.getPosition(player);
		let region = BlockSource.getDefaultForActor(player);
		if (World.getThreadTime() % 20 == 0 && region.canSeeSky(p.x, p.y + 1, p.z) &&
			(time >= 23500 || time < 12550) && (!World.getWeather().rain || World.getLightLevel(p.x, p.y + 1, p.z) > 14)) {
			for (let i = 1; i < 4; i++) {
				let energy = 20;
				let armor = Entity.getArmorSlot(player, i);
				let energyAdd = ChargeItemRegistry.addEnergyTo(armor, "Eu", energy, 4);
				if (energyAdd > 0) {
					energy -= energyAdd;
					Entity.setArmorSlot(player, i, armor.id, 1, armor.data, armor.extra);
					if (energy <= 0) break;
				}
			}
		}
		return false;
	}
}