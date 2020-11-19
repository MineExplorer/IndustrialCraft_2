IDRegistry.genBlockID("teslaCoil");
Block.createBlock("teslaCoil", [
	{name: "Tesla Coil", texture: [["tesla_coil", 0], ["tesla_coil", 0], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.teslaCoil, "stone", 1, true);
ItemName.addTierTooltip("teslaCoil", 3);

MachineRegistry.setMachineDrop("teslaCoil", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.teslaCoil, count: 1, data: 0}, [
		"ror",
		"r#r",
		"cxc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingIron, 0, 'o', ItemID.coil, 0, 'r', 331, 0]);
});

namespace Machine {
	export class TeslaCoil
	extends ElectricMachine {
		constructor() {
			super(3);
		}
		
		tick(): void {
			if (this.data.energy >= 400 && this.data.isActive) {
				if (World.getThreadTime()%32 == 0) {
					var entities = Entity.getAll();
					var discharge = false;
					var damage = Math.floor(this.data.energy/400);
					for (var i in entities) {
						var ent = entities[i];
						var coords = Entity.getPosition(ent);
						var dx = this.x + 0.5 - coords.x;
						var dy = this.y + 0.5 - coords.y;
						var dz = this.z + 0.5 - coords.z;
						if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 4.5 && canTakeDamage(ent, "electricity") && Entity.getHealth(ent) > 0) {
							discharge = true;
							if (damage >= 24) {
								Entity.setFire(ent, 1, true);
								Entity.damageEntity(ent, damage, 6);
							}
							else Entity.damageEntity(ent, damage);
						}
					}
					if (discharge) this.data.energy = 1;
				}
				this.data.energy--;
			}
		}
	
		redstone(signal): void {
			this.data.isActive = signal.power > 0;
		}
	
		getEnergyStorage(): number {
			return 10000;
		}
	}

	MachineRegistry.registerElectricMachine(BlockID.teslaCoil, new TeslaCoil());
}