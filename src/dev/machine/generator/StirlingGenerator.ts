/// <reference path="../IHeatConsumer.ts" />

IDRegistry.genBlockID("stirlingGenerator");
Block.createBlock("stirlingGenerator", [
	{name: "Stirling Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.stirlingGenerator, "stone", 1, true);

TileRenderer.setHandAndUiModel(BlockID.stirlingGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.stirlingGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.stirlingGenerator, true);

MachineRegistry.setMachineDrop("stirlingGenerator", BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.stirlingGenerator, count: 1, data: 0}, [
		"cxc",
		"c#c",
		"ccc"
	], ['#', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});

namespace Machine {
	export class StirlingGenerator
	extends Generator
	implements IHeatConsumer {
		defaultValues = {
			energy: 0,
			heat: 0
		}
			
		canReceiveHeat(side: number) {
			return this.data.meta == side;
		}
		
		heatReceive(amount: number) {
			if (this.data.energy == 0) {
				this.data.energy = Math.round(amount / 2);
				return amount;
			}
			return 0;
		}
		
		energyTick(type: string, src: any) {
			if (src.add(this.data.energy) < this.data.energy) {
				this.data.energy = 0;
			}
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (ICTool.isWrench(item.id)) {
				ICTool.rotateMachine(this, coords.side, item, player)
				return true;
			}
			return super.onItemUse(coords, item, player);
		}
	}

	MachineRegistry.registerGenerator(BlockID.stirlingGenerator, new StirlingGenerator(4));
}