/// <reference path="ProcessingMachine.ts" />

IDRegistry.genBlockID("extractor");
Block.createBlock("extractor", [
	{name: "Extractor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.extractor, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.extractor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.extractor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 1], ["extractor_side", 1], ["extractor_side", 1]]);
TileRenderer.setRotationFunction(BlockID.extractor);

ItemName.addTierTooltip("extractor", 1);

MachineRegistry.setMachineDrop("extractor", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.extractor, count: 1, data: 0}, [
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.treetap, 0, 'a', ItemID.circuitBasic, 0]);

	MachineRecipeRegistry.registerRecipesFor("extractor", {
		"ItemID.latex": {id: ItemID.rubber, count: 3},
		"BlockID.rubberTreeSapling": {id: ItemID.rubber, count: 1},
		"BlockID.rubberTreeLog": {id: ItemID.rubber, count: 1},
		35: {id: 35, count: 1},
		289: {id: ItemID.dustSulfur, count: 1},
		"ItemID.tinCanFull": {id: ItemID.tinCanEmpty, count: 1},
	}, true);
});

var guiExtractor = InventoryWindow("Extractor", {
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "extractor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_SCALE},
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
	export class Extractor
	extends ProcessingMachine {
		defaultValues = {
			energy: 0,
			power_tier: 1,
			energy_storage: 1200,
			energy_consumption: 2,
			work_time: 400,
			progress: 0,
			isActive: false
		}

		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName() {
			return guiExtractor;
		}

		getRecipeResult(id: number) {
			return MachineRecipeRegistry.getRecipeResult("extractor", id);
		}

		getOperationSound() {
			return "ExtractorOp.ogg";
		}

		getInterruptSound() {
			return "InterruptOne.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.extractor, new Extractor());

	StorageInterface.createInterface(BlockID.extractor, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance) => {
			return MachineRecipeRegistry.hasRecipeFor("extractor", item.id);
		}
	});
}