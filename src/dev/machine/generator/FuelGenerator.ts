/// <reference path="../Generator.ts" />

BlockRegistry.createBlock("primalGenerator", [
	{name: "Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.primalGenerator, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.primalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.primalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function() {
	Item.addCreativeGroup("EUGenerators", Translation.translate("Electric Generators"), [
		BlockID.primalGenerator,
		BlockID.geothermalGenerator,
		BlockID.semifluidGenerator,
		BlockID.solarPanel,
		BlockID.genWindmill,
		BlockID.genWatermill,
		BlockID.rtGenerator,
		BlockID.stirlingGenerator,
		BlockID.nuclearReactor,
		BlockID.reactorChamber
	]);

	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		"x",
		"#",
		"a"
	], ['#', BlockID.machineBlockBasic, 0, 'a', 61, 0, 'x', ItemID.storageBattery, -1]);

	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		" x ",
		"###",
		" a "
	], ['#', ItemID.plateIron, 0, 'a', BlockID.ironFurnace, -1, 'x', ItemID.storageBattery, -1]);
});


const guiGenerator = MachineRegistry.createInventoryWindow("Generator", {
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_SCALE},
	],

	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"burningScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 441, y: 75},
		"slotFuel": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});

namespace Machine {
	export class FuelGenerator extends Generator {
		defaultValues = {
			energy: 0,
			burn: 0,
			burnMax: 0
		}

		getScreenByName(): UI.IWindow {
			return guiGenerator;
		}

		setupContainer(): void {
			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => {
				return ChargeItemRegistry.isValidItem(id, "Eu", 1);
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", (name, id, count, data) => {
				return Recipes.getFuelBurnDuration(id, data) > 0;
			});
		}

		consumeFuel(slotName: string): number {
			let fuelSlot = this.container.getSlot(slotName);
			if (fuelSlot.id > 0) {
				let burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
				if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
					this.decreaseSlot(fuelSlot, 1);
					return burn;
				}
			}
			return 0;
		}

		onTick(): void {
			StorageInterface.checkHoppers(this);

			let newActive = false;
			const energyStorage = this.getEnergyStorage();
			if (this.data.energy + 10 <= energyStorage) {
				if (this.data.burn <= 0) {
					this.data.burn = this.data.burnMax = this.consumeFuel("slotFuel") / 4;
				}
				if (this.data.burn > 0) {
					this.data.energy = Math.min(this.data.energy + 10, energyStorage);
					this.data.burn--;
					newActive = true;
				}
			}
			this.setActive(newActive);

			this.chargeSlot("slotEnergy");
			this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.setText("textInfo1", this.data.energy + "/");
			this.container.sendChanges();
		}

		getOperationSound(): string {
			return "GeneratorLoop.ogg";
		}

		getEnergyStorage(): number {
			return 10000;
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
	}

	MachineRegistry.registerPrototype(BlockID.primalGenerator, new FuelGenerator());

	StorageInterface.createInterface(BlockID.primalGenerator, {
		slots: {
			"slotFuel": {input: true}
		},
		isValidInput: (item: ItemInstance) => Recipes.getFuelBurnDuration(item.id, item.data) > 0
	});
}