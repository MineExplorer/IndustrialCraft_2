BlockRegistry.createBlock("teslaCoil", [
	{name: "Tesla Coil", texture: [["tesla_coil", 0], ["tesla_coil", 0], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.teslaCoil, "stone", 1, true);
ItemName.addTierTooltip("teslaCoil", 3);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.teslaCoil, count: 1, data: 0}, [
		"ror",
		"r#r",
		"cxc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingIron, 0, 'o', ItemID.coil, 0, 'r', 331, 0]);
});

namespace Machine {
	export class TeslaCoil extends ElectricMachine {
		defaultValues = {
			energy: 0,
			isEnabled: false
		}

		getScreenName(): string {
			return null;
		}

		getTier(): number {
			return 3;
		}

		onTick(): void {
			if (this.data.isEnabled && this.data.energy >= 400) {
				this.data.energy--;
				if (World.getThreadTime()%32 == 0) {
					let entities = this.region.listEntitiesInAABB(this.x - 4, this.y - 4, this.z - 4, this.x + 5, this.y + 5, this.z + 5);
					let damage = Math.floor(this.data.energy / 400);
					for (let ent of entities) {
						if (!EntityHelper.canTakeDamage(ent, DamageSource.electricity)) continue;
						if (damage >= 24) {
							Entity.setFire(ent, 1, true);
						}
						Entity.damageEntity(ent, damage, 6);
						this.data.energy -= damage * 400;
						return;
					}
				}
			}
		}

		onRedstoneUpdate(signal: number): void {
			this.data.isEnabled = signal > 0;
		}

		getEnergyStorage(): number {
			return 10000;
		}
	}

	MachineRegistry.registerPrototype(BlockID.teslaCoil, new TeslaCoil());
}