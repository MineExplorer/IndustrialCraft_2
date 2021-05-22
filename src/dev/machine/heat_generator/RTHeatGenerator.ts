IDRegistry.genBlockID("rtHeatGenerator");
Block.createBlock("rtHeatGenerator", [
	{name: "Radioisotope Heat Generator", texture: [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.rtHeatGenerator, "stone", 1, true);

TileRenderer.setHandAndUiModel(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 1], ["rt_generator_side", 0], ["heat_pipe", 1], ["rt_generator_side", 0], ["rt_generator_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.rtHeatGenerator, true);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.rtHeatGenerator, count: 1, data: 0}, [
		"ccc",
		"c#c",
		"cxc"
	], ['#', BlockID.reactorChamber, 0, 'x', ItemID.heatConductor, 0, 'c', ItemID.casingIron, 0]);
});

const guiRTHeatGenerator = InventoryWindow("Radioisotope Heat Generator", {
	drawing: [
		{type: "bitmap", x: 380, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE}
	],

	elements: {
		"slot0": {type: "slot", x: 420, y: 100},
		"slot1": {type: "slot", x: 480, y: 100},
		"slot2": {type: "slot", x: 540, y: 100},
		"slot3": {type: "slot", x: 420, y: 160},
		"slot4": {type: "slot", x: 480, y: 160},
		"slot5": {type: "slot", x: 540, y: 160},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 450, y: 264, width: 300, height: 30, text: "0     /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 550, y: 264, width: 300, height: 30, text: "0"}
	}
});

namespace Machine {
	export class RTHeatGenerator extends MachineBase {
		getScreenByName() {
			return guiRTHeatGenerator;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id) => (id == ItemID.rtgPellet));
		}

		calculateOutput(): number {
			let output = 1;
			for (let i = 0; i < 6; i++) {
				let slot = this.container.getSlot("slot"+i);
				if (slot.id == ItemID.rtgPellet) {
					output *= 2;
				}
			}
			return output > 1 ? output : 0;
		}

		getOutputText(output: number): string {
			let outputText = output.toString();
			for (let i = outputText.length; i < 6; i++) {
				outputText += " ";
			}
			return outputText;
		}

		onTick(): void {
			let output = this.calculateOutput();
			let maxOutput = output;

			let isActive = output > 0;
			if (isActive) {
				output = this.spreadHeat(output);
			}
			this.setActive(isActive);

			this.container.setText("textInfo1", this.getOutputText(output) + "/");
			this.container.setText("textInfo2", maxOutput);
			this.container.sendChanges();
		}

		spreadHeat(heat: number): number {
			let side = this.getFacing();
			let coords = StorageInterface.getRelativeCoords(this, side);
			let tile = this.region.getTileEntity(coords) as IHeatConsumer;
			if (tile && tile.canReceiveHeat && tile.canReceiveHeat(side ^ 1)) {
				return tile.receiveHeat(heat);
			}
			return 0;
		}

		canRotate(): boolean {
			return true;
		}
	}

	MachineRegistry.registerPrototype(BlockID.rtHeatGenerator, new RTHeatGenerator());
}
