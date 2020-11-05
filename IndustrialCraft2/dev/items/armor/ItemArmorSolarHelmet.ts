/// <reference path="./ItemArmorIC2.ts" />

class ItemArmorSolarHelmet
extends ItemArmorIC2
implements OnHurtListener, OnTickListener {	
	constructor(nameID: string, name: string, params: ArmorParams) {
		super(nameID, name, params);
	}
	
	onHurt(params: {attacker: number, damage: number, type: number}, item: ItemInstance): ItemInstance {
		return item;
	}

	onTick(item: ItemInstance, index: number, player: number): void {
		let time = World.getWorldTime()%24000;
		let pos = Entity.getPosition(player);
		let region = BlockSource.getDefaultForActor(player);
		if (World.getThreadTime() % 20 == 0 && region.canSeeSky(pos.x, pos.y + 1, pos.z) &&
			(time >= 23500 || time < 12550) && (!World.getWeather().rain || region.getLightLevel(pos.x, pos.y + 1, pos.z) > 14)) {
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
	}
}