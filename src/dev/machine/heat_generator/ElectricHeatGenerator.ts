BlockRegistry.createBlock("electricHeatGenerator", [
	{name: "Electric Heater", texture: [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.electricHeatGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.electricHeatGenerator, 4);
ItemName.addOutputTooltip(BlockID.electricHeatGenerator, "HU", 0, 100);

TileRenderer.setStandardModelWithRotation(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 1], ["heat_generator_side", 1], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.electricHeatGenerator, true);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.electricHeatGenerator, count: 1, data: 0}, [
		"xbx",
		"x#x",
		"xax"
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.casingIron, 0, 'a', ItemID.heatConductor, 0, 'b', ItemID.storageBattery, -1]);
});

const guiElectricHeatGenerator = MachineRegistry.createInventoryWindow("Electric Heater", {
	drawing: [
		{type: "bitmap", x: 399, y: 110, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 511, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE}
	],

	elements: {
		"slot0": {type: "slot", x: 490, y: 120},
		"slot1": {type: "slot", x: 550, y: 120},
		"slot2": {type: "slot", x: 610, y: 120},
		"slot3": {type: "slot", x: 670, y: 120},
		"slot4": {type: "slot", x: 730, y: 120},
		"slot5": {type: "slot", x: 490, y: 180},
		"slot6": {type: "slot", x: 550, y: 180},
		"slot7": {type: "slot", x: 610, y: 180},
		"slot8": {type: "slot", x: 670, y: 180},
		"slot9": {type: "slot", x: 730, y: 180},
		"slotEnergy": {type: "slot", x: 390, y: 180},
		"energyScale": {type: "scale", x: 399, y: 110, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 580, y: 264, width: 300, height: 30, text: "0    /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 680, y: 264, width: 300, height: 30, text: "0"}
	}
});

namespace Machine {
	export class ElectricHeatGenerator extends ElectricMachine {
		getTier(): number {
			return 4;
		}

		getScreenByName(): UI.IWindow {
			return guiElectricHeatGenerator;
		}

		setupContainer(): void {
			this.container.setGlobalAddTransferPolicy((container, name, id, amount, data) => {
				if (name == "slotEnergy") {
					return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier())? amount : 0;
				}
				if (id == ItemID.coil && container.getSlot(name).count == 0) {
					return 1;
				}
				return 0;
			});
		}

		calcOutput(): number {
			let maxOutput = 0;
			for (let i = 0; i < 10; i++) {
				const slot = this.container.getSlot("slot"+i);
				if (slot.id == ItemID.coil) {
					maxOutput += 10;
				}
			}
			return maxOutput;
		}

		onTick(): void {
			const maxOutput = this.calcOutput();
			let output = 0;

			if (this.data.energy >= 1) {
				const side = this.getFacing();
				const coords = StorageInterface.getRelativeCoords(this, side);
				const tile = this.region.getTileEntity(coords) as IHeatConsumer;
				if (tile && tile.canReceiveHeat && tile.canReceiveHeat(side ^ 1)) {
					output = tile.receiveHeat(Math.min(maxOutput, this.data.energy));
					if (output > 0) {
						this.setActive(true);
						this.data.energy -= output;
						let outputText = output.toString();
						for (let i = outputText.length; i < 6; i++) {
							outputText += " ";
						}
						this.container.setText("textInfo1", outputText + "/");
					}
				}
			}
			if (output == 0) {
				this.setActive(false);
				this.container.setText("textInfo1", "0     /");
			}

			this.dischargeSlot("slotEnergy");

			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.setText("textInfo2", maxOutput);
			this.container.sendChanges();
		}

		getEnergyStorage(): number {
			return 2000;
		}

		canRotate(): boolean {
			return true;
		}
	}

	MachineRegistry.registerPrototype(BlockID.electricHeatGenerator, new ElectricHeatGenerator());
}