/// <reference path="./ItemArmorIC2.ts" />

class ItemArmorSolarHelmet
extends ItemArmorIC2
implements IArmorFuncs {
	canSeeSky: boolean = false;
	
	constructor(nameID: string, name: string, params: ArmorParams) {
		super(nameID, name, params);
		ItemArmor.registerFuncs(nameID, this);
	}

	onHurt(): boolean {
		return false;
	}

	onTick(): boolean {
		var time = World.getWorldTime()%24000;
		var p = Player.getPosition();
		if (World.getThreadTime() % 20 == 0 && GenerationUtils.canSeeSky(p.x, p.y + 1, p.z) &&
			(time >= 23500 || time < 12550) && (!World.getWeather().rain || World.getLightLevel(p.x, p.y+1, p.z) > 14)) {
			for (var i = 1; i < 4; i++) {
				var energy = 20;
				var armor = Player.getArmorSlot(i);
				var energyAdd = ChargeItemRegistry.addEnergyTo(armor, "Eu", energy, 4);
				if (energyAdd > 0) {
					energy -= energyAdd;
					Player.setArmorSlot(i, armor.id, 1, armor.data, armor.extra);
					if (energy <= 0) break;
				}
			}
		}
		return false;
	}
}