/// <reference path="ProcessingMachine.ts" />

BlockRegistry.createBlock("electricFurnace", [
	{name: "Electric Furnace", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.electricFurnace, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.electricFurnace, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.electricFurnace, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.electricFurnace);

ItemName.addVoltageTooltip("electricFurnace", 32);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.electricFurnace, count: 1, data: 0}, [
		" a ",
		"x#x"
	], ['#', BlockID.ironFurnace, -1, 'x', 331, 0, 'a', ItemID.circuitBasic, 0]);
});


const guiElectricFurnace = MachineRegistry.createInventoryWindow("Electric Furnace", {
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("furnace");
			}
		}},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79},
		"slotEnergy": {type: "slot", x: 441, y: 218},
		"slotResult": {type: "slot", x: 625, y: 148},
		"slotUpgrade1": {type: "slot", x: 820, y: 60},
		"slotUpgrade2": {type: "slot", x: 820, y: 119},
		"slotUpgrade3": {type: "slot", x: 820, y: 178},
		"slotUpgrade4": {type: "slot", x: 820, y: 237},
	}
});

namespace Machine {
	export class ElectricFurnace extends ProcessingMachine {
		defaultEnergyDemand = 3;
		defaultProcessTime = 130;
		defaultDrop = BlockID.ironFurnace;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiElectricFurnace;
		}

		getRecipeResult(id: number, data: number): ItemInstance {
			return Recipes.getFurnaceRecipeResult(id, data, "iron");
		}

		getStartingSound(): string {
			return "ElectroFurnaceStart.ogg";
		}
		getOperationSound(): string {
			return "ElectroFurnaceLoop.ogg";
		}
		getFinishingSound(): string {
			return "ElectroFurnaceStop.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.electricFurnace, new ElectricFurnace());

	StorageInterface.createInterface(BlockID.electricFurnace, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance) => {
			return !!Recipes.getFurnaceRecipeResult(item.id, item.data, "iron");
		}
	});
}