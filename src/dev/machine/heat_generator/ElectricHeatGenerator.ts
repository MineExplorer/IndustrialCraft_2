IDRegistry.genBlockID("electricHeatGenerator");
Block.createBlock("electricHeatGenerator", [
	{name: "Electric Heater", texture: [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.electricHeatGenerator, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 1], ["heat_generator_side", 1], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.electricHeatGenerator, true);

ItemName.addTierTooltip("electricHeatGenerator", 4);

MachineRegistry.setMachineDrop("electricHeatGenerator");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.electricHeatGenerator, count: 1, data: 0}, [
		"xbx",
		"x#x",
		"xax"
	], ['#', ItemID.circuitBasic, 0, 'x', ItemID.casingIron, 0, 'a', ItemID.heatConductor, 0, 'b', ItemID.storageBattery, -1]);
});

const guiElectricHeatGenerator = InventoryWindow("Electric Heater", {
	drawing: [
		{type: "bitmap", x: 342, y: 110, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 461, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE}
	],

	elements: {
		"slot0": {type: "slot", x: 440, y: 120},
		"slot1": {type: "slot", x: 500, y: 120},
		"slot2": {type: "slot", x: 560, y: 120},
		"slot3": {type: "slot", x: 620, y: 120},
		"slot4": {type: "slot", x: 680, y: 120},
		"slot5": {type: "slot", x: 440, y: 180},
		"slot6": {type: "slot", x: 500, y: 180},
		"slot7": {type: "slot", x: 560, y: 180},
		"slot8": {type: "slot", x: 620, y: 180},
		"slot9": {type: "slot", x: 680, y: 180},
		"slotEnergy": {type: "slot", x: 340, y: 180},
		"energyScale": {type: "scale", x: 342, y: 110, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 530, y: 264, width: 300, height: 30, text: "0    /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 630, y: 264, width: 300, height: 30, text: "0"}
	}
});

namespace Machine {
	export class ElectricHeatGenerator extends ElectricMachine {
		readonly hasVerticalRotation: boolean = true;

		getTier(): number {
			return 4;
		}

		getScreenByName() {
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
				let slot = this.container.getSlot("slot"+i);
				if (slot.id == ItemID.coil) {
					maxOutput += 10;
				}
			}
			return maxOutput;
		}

		tick(): void {
			let maxOutput = this.calcOutput();
			let output = 0;

			if (this.data.energy >= 1) {
				let side = this.getFacing();
				let coords = StorageInterface.getRelativeCoords(this, side);
				let TE = this.region.getTileEntity(coords);
				if (TE && TE.canReceiveHeat && TE.canReceiveHeat(side ^ 1)) {
					output = TE.heatReceive(Math.min(maxOutput, this.data.energy));
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

			const energyStorage = this.getEnergyStorage()
			this.dischargeSlot("slotEnergy");

			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.setText("textInfo2", maxOutput);
			this.container.sendChanges();
		}

		getEnergyStorage(): number {
			return 2000;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (ICTool.isValidWrench(item)) {
				ICTool.rotateMachine(this, coords.side, item, player)
				return true;
			}
			return super.onItemUse(coords, item, player);
		}
	}

	MachineRegistry.registerPrototype(BlockID.electricHeatGenerator, new ElectricHeatGenerator());
}