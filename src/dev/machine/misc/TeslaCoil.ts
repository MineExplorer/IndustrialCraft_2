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
		defaultValues = {
			energy: 0,
			isActive: false
		}

		getTier(): number {
			return 3;
		}

		tick(): void {
			if (this.data.energy >= 400 && this.data.isActive) {
				if (World.getThreadTime()%32 == 0) {
					let entities = Entity.getAll();
					let discharge = false;
					let damage = Math.floor(this.data.energy/400);
					for (let i in entities) {
						let ent = entities[i];
						let coords = Entity.getPosition(ent);
						let dx = this.x + 0.5 - coords.x;
						let dy = this.y + 0.5 - coords.y;
						let dz = this.z + 0.5 - coords.z;
						if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 4.5 && EntityHelper.canTakeDamage(ent, "electricity") && Entity.getHealth(ent) > 0) {
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

		onRedstoneUpdate(signal: number): void {
			this.data.isActive = signal > 0;
		}

		getEnergyStorage(): number {
			return 10000;
		}

		onItemUse(): boolean {
			return true;
		}
	}

	MachineRegistry.registerPrototype(BlockID.teslaCoil, new TeslaCoil());
}