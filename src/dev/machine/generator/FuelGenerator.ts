/// <reference path="../Generator.ts" />

IDRegistry.genBlockID("primalGenerator");
Block.createBlock("primalGenerator", [
	{name: "Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.primalGenerator, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.primalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.primalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.primalGenerator);

MachineRegistry.setMachineDrop("primalGenerator");

Callback.addCallback("PreLoaded", function() {
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


var guiGenerator = InventoryWindow("Generator", {
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
	export class FuelGenerator
	extends Generator {
		constructor() {
			super(1);
		}

		defaultValues = {
			energy: 0,
			burn: 0,
			burnMax: 0,
			isActive: false
		}
		
		getScreenByName(): UI.StandartWindow {
			return guiGenerator;
		}

		setupContainer() {
			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (id, count, data) => ChargeItemRegistry.isValidItem(id, "Eu", 1));
			StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", (id, count, data) => Recipes.getFuelBurnDuration(id, data) > 0);
		}

		consumeFuel(slotName: string) {
			var fuelSlot = this.container.getSlot(slotName);
			if (fuelSlot.id > 0) {
				var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
				if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
					this.container.setSlot(slotName, fuelSlot.id, fuelSlot.count - 1, fuelSlot.data);
					this.container.validateSlot(slotName);
					return burn;
				}
			}
			return 0;
		}

		tick() {
			StorageInterface.checkHoppers(this);
			var energyStorage = this.getEnergyStorage();
			
			if (this.data.burn <= 0 && this.data.energy + 10 <= energyStorage) {
				this.data.burn = this.data.burnMax = this.consumeFuel("slotFuel") / 4;
			}
			if (this.data.burn > 0) {
				this.data.energy = Math.min(this.data.energy + 10, energyStorage);
				this.data.burn--;
				this.setActive(true);
				//this.startPlaySound();
			} else {
				this.setActive(false);
				//this.stopPlaySound();
			}
			
			this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 1);
			
			this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.setText("textInfo1", this.data.energy + "/");
			this.container.sendChanges();
		}

		getOperationSound() {
			return "GeneratorLoop.ogg";
		}
		
		getEnergyStorage() {
			return 10000;
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