BlockRegistry.createBlock("rtGenerator", [
	{name: "Radioisotope Thermoelectric Generator", texture: [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.rtGenerator, "stone", 1);
ItemName.addProductionTooltip(BlockID.rtGenerator, "EU", EnergyProductionModifiers.RTGenerator, 32 * EnergyProductionModifiers.RTGenerator);

TileRenderer.setStandardModel(BlockID.rtGenerator, 0, [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.rtGenerator, 0, [["machine_bottom", 0], ["rt_generator_top_active", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.rtGenerator, count: 1, data: 0}, [
		"ccc",
		"c#c",
		"cxc"
	], ['#', BlockID.reactorChamber, 0, 'x', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0]);
});

namespace Machine {
	const guiRTGenerator = MachineRegistry.createInventoryWindow("Radioisotope Thermoelectric Generator", {
		drawing: [
			{type: "bitmap", x: 630, y: 150, bitmap: "energy_bar_background", scale: GUI_SCALE},
		],

		elements: {
			"slot0": {type: "slot", x: 420, y: 120},
			"slot1": {type: "slot", x: 480, y: 120},
			"slot2": {type: "slot", x: 540, y: 120},
			"slot3": {type: "slot", x: 420, y: 180},
			"slot4": {type: "slot", x: 480, y: 180},
			"slot5": {type: "slot", x: 540, y: 180},
			"energyScale": {type: "scale", x: 630 + GUI_SCALE * 4, y: 150, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
			"textInfo1": {type: "text", x: 742, y: 148, width: 300, height: 30, text: "0/"},
			"textInfo2": {type: "text", x: 742, y: 178, width: 300, height: 30, text: "10000"}
		}
	});

	export class RTGenerator extends Generator {
		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id) => (id == ItemID.rtgPellet));
		}

		getScreenByName(): UI.IWindow {
			return guiRTGenerator;
		}

		onTick(): void {
			let numberOfPellets = 0;
			for (let i = 0; i < 6; i++) {
				const slot = this.container.getSlot("slot" + i);
				if (slot.id == ItemID.rtgPellet) {
					numberOfPellets++;
				}
			}
			if (numberOfPellets > 0) {
				this.setActive(true);
				const output = EnergyProductionModifiers.RTGenerator * 1 << (numberOfPellets - 1); // fast power of 2
				this.data.energy = Math.min(this.data.energy + output, this.getEnergyStorage());
			} else {
				this.setActive(false);
			}

			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.setText("textInfo1", this.data.energy + "/");
			this.container.sendChanges();
		}

		getEnergyStorage(): number {
			return 10000;
		}
	}

	MachineRegistry.registerPrototype(BlockID.rtGenerator, new RTGenerator());
}