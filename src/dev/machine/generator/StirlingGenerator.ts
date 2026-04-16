/// <reference path="../IHeatConsumer.ts" />

BlockRegistry.createBlock("stirlingGenerator", [
	{name: "Stirling Generator", texture: [["ic_machine_bottom", 0], ["ic_machine_top", 0], ["stirling_generator_back", 0], ["machine_heat_pipe", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.stirlingGenerator, "stone", 1);

TileRenderer.setHandAndUiModel(BlockID.stirlingGenerator, 0, [["ic_machine_bottom", 0], ["ic_machine_top", 0], ["stirling_generator_back", 0], ["machine_heat_pipe", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.stirlingGenerator, 0, [["ic_machine_bottom", 0], ["ic_machine_top", 0], ["stirling_generator_back", 0], ["machine_heat_pipe", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.stirlingGenerator, true);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.stirlingGenerator, count: 1, data: 0}, [
		"cxc",
		"c#c",
		"ccc"
	], ['#', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});

namespace Machine {
	export class StirlingGenerator extends Generator
	implements IHeatConsumer {
		defaultValues = {
			energy: 0,
			heat: 0
		}

		getScreenName(): string {
			return null;
		}

		getTier(): number {
			return 4;
		}

		canRotate(): boolean {
			return true;
		}

		canReceiveHeat(side: number): boolean {
			return side == this.getFacing();
		}

		receiveHeat(amount: number): number {
			if (this.data.energy == 0) {
				this.data.energy = Math.round(amount / 2);
				return amount;
			}
			return 0;
		}
		
		getEnergyCapacity(): number {
			return this.data.energy;
		}

		energyTick(type: string, src: EnergyTileNode): void {
			if (src.add(this.data.energy) < this.data.energy) {
				this.data.energy = 0;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.stirlingGenerator, new StirlingGenerator());
}