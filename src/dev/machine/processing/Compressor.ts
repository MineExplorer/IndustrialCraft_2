/// <reference path="ProcessingMachine.ts" />

IDRegistry.genBlockID("compressor");
Block.createBlock("compressor", [
	{name: "Compressor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.compressor, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.compressor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.compressor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.compressor);

ItemName.addTierTooltip("compressor", 1);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.compressor, count: 1, data: 0}, [
		"x x",
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', 1, -1, 'a', ItemID.circuitBasic, 0]);

	MachineRecipeRegistry.registerRecipesFor("compressor", {
		// Blocks
		80: {id: 79, count: 1, data: 0},
		12: {id: 24, count: 1, data: 0, sourceCount: 4},
		336: {id: 45, count: 1, data: 0, sourceCount: 4},
		405: {id: 112, count: 1, data: 0, sourceCount: 4},
		348: {id: 89, count: 1, data: 0, sourceCount: 4},
		406: {id: 155, count: 1, data: 0, sourceCount: 4},
		// Items
		"ItemID.dustEnergium": {id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), sourceCount: 9},
		"ItemID.ingotAlloy": {id: ItemID.plateAlloy, count: 1, data: 0},
		"ItemID.carbonMesh": {id: ItemID.carbonPlate, count: 1, data: 0},
		"ItemID.coalBall": {id: ItemID.coalBlock, count: 1, data: 0},
		"ItemID.coalChunk": {id: 264, count: 1, data: 0},
		"ItemID.cellEmpty": {id: ItemID.cellAir, count: 1, data: 0},
		"ItemID.dustLapis": {id: ItemID.plateLapis, count: 1, data: 0},
		// Dense Plates
		"ItemID.plateIron": {id: ItemID.densePlateIron, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateGold": {id: ItemID.densePlateGold, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateTin": {id: ItemID.densePlateTin, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateCopper": {id: ItemID.densePlateCopper, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateBronze": {id: ItemID.densePlateBronze, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateSteel": {id: ItemID.densePlateSteel, count: 1, data: 0, sourceCount: 9},
		"ItemID.plateLead": {id: ItemID.densePlateLead, count: 1, data: 0, sourceCount: 9},
		// Compact
		331: {id: 152, count: 1, data: 0, sourceCount: 9},
		"minecraft:lapis_lazuli": {id: 22, count: 1, data: 0, sourceCount: 9},
		264: {id: 57, count: 1, data: 0, sourceCount: 9},
		388: {id: 133, count: 1, data: 0, sourceCount: 9},
		265: {id: 42, count: 1, data: 0, sourceCount: 9},
		266: {id: 41, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotCopper": {id: BlockID.blockCopper, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotTin": {id: BlockID.blockTin, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotLead": {id: BlockID.blockLead, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotSteel": {id: BlockID.blockSteel, count: 1, data: 0, sourceCount: 9},
		"ItemID.ingotBronze": {id: BlockID.blockBronze, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallIron": {id: ItemID.dustIron, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallGold": {id: ItemID.dustGold, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallCopper": {id: ItemID.dustCopper, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallTin": {id: ItemID.dustTin, count: 1, data: 0, sourceCount: 9},
		"ItemID.dustSmallLead": {id: ItemID.dustLead, count: 1, data: 0, sourceCount: 9},
		"ItemID.smallUranium235": {id: ItemID.uranium235, count: 1, data: 0, sourceCount: 9},
		"ItemID.smallPlutonium": {id: ItemID.plutonium, count: 1, data: 0, sourceCount: 9}
	}, true);
});


const guiCompressor = InventoryWindow("Compressor", {
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "compressor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE},
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, bitmap: "compressor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79},
		"slotEnergy": {type: "slot", x: 441, y: 218},
		"slotResult": {type: "slot", x: 625, y: 148},
		"slotUpgrade1": {type: "slot", x: 820, y: 60,},
		"slotUpgrade2": {type: "slot", x: 820, y: 119},
		"slotUpgrade3": {type: "slot", x: 820, y: 178},
		"slotUpgrade4": {type: "slot", x: 820, y: 237},
	}
});

namespace Machine {
	export class Compressor extends ProcessingMachine {
		defaultEnergyDemand = 2;
		defaultProcessTime = 400;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName() {
			return guiCompressor;
		}

		getRecipeResult(id: number, data: number): MachineRecipeRegistry.RecipeData {
			return MachineRecipeRegistry.getRecipeResult("compressor", id, data);
		}

		getOperationSound(): string {
			return "CompressorOp.ogg";
		}

		getInterruptSound(): string {
			return "InterruptOne.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.compressor, new Compressor());

	StorageInterface.createInterface(BlockID.compressor, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: function(item: ItemInstance) {
			return MachineRecipeRegistry.hasRecipeFor("compressor", item.id, item.data);
		}
	});
}