/// <reference path="ProcessingMachine.ts" />

BlockRegistry.createBlock("compressor", [
	{name: "Compressor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.compressor, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.compressor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.compressor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor_active", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.compressor);

ItemName.addTierTooltip("compressor", 1);
ItemName.addConsumptionTooltip("compressor", "EU", 2);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.compressor, count: 1, data: 0}, [
		"p#p",
		"mcm"
	], ['#', BlockID.machineBlockBasic, -1, 'c', ItemID.circuitBasic, -1, 'm', ItemID.electricMotor, -1, 'p', VanillaBlockID.piston, -1]);

	MachineRecipeRegistry.registerRecipesFor<DataMap<Machine.ProcessingRecipe>>("compressor", {
		// Blocks
		"minecraft:sand:0": {id: 24, count: 1, data: 0, sourceCount: 4},
		"minecraft:sand:1": {id: VanillaBlockID.red_sandstone, count: 1, data: 0, sourceCount: 4},
		"minecraft:clay_ball": {id: VanillaBlockID.clay, count: 1, data: 0, sourceCount: 4},
		"minecraft:brick": {id: 45, count: 1, data: 0, sourceCount: 4},
		"minecraft:netherbrick": {id: 112, count: 1, data: 0, sourceCount: 4},
		"minecraft:glowstone_dust": {id: 89, count: 1, data: 0, sourceCount: 4},
		"minecraft:quartz": {id: 155, count: 1, data: 0, sourceCount: 4},
		"minecraft:snowball": {id: VanillaBlockID.snow, count: 1, data: 0},
		"minecraft:snow": {id: 79, count: 1, data: 0},
		"minecraft:ice": {id: VanillaBlockID.packed_ice, count: 1, data: 0, sourceCount: 9},
		"minecraft:packed_ice": {id: VanillaBlockID.blue_ice, count: 1, data: 0, sourceCount: 9},
		"minecraft:bone_meal": {id: VanillaBlockID.bone_block, count: 1, data: 0, sourceCount: 9},
		"minecraft:dried_kelp": {id: VanillaBlockID.dried_kelp_block, count: 1, data: 0, sourceCount: 9},
		// Items
		"item:dustEnergium": {id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), sourceCount: 9},
		"item:ingotAlloy": {id: ItemID.plateAlloy, count: 1, data: 0},
		"item:carbonMesh": {id: ItemID.carbonPlate, count: 1, data: 0},
		"item:coalBall": {id: ItemID.coalBlock, count: 1, data: 0},
		"item:coalChunk": {id: 264, count: 1, data: 0},
		"item:cellEmpty": {id: ItemID.cellAir, count: 1, data: 0},
		"item:dustLapis": {id: ItemID.plateLapis, count: 1, data: 0},
		"minecraft:blaze_powder": {id: VanillaItemID.blaze_rod, count: 1, data: 0, sourceCount: 5},
		// Dense Plates
		"item:plateIron": {id: ItemID.densePlateIron, count: 1, data: 0, sourceCount: 9},
		"item:plateGold": {id: ItemID.densePlateGold, count: 1, data: 0, sourceCount: 9},
		"item:plateTin": {id: ItemID.densePlateTin, count: 1, data: 0, sourceCount: 9},
		"item:plateCopper": {id: ItemID.densePlateCopper, count: 1, data: 0, sourceCount: 9},
		"item:plateBronze": {id: ItemID.densePlateBronze, count: 1, data: 0, sourceCount: 9},
		"item:plateSteel": {id: ItemID.densePlateSteel, count: 1, data: 0, sourceCount: 9},
		"item:plateLead": {id: ItemID.densePlateLead, count: 1, data: 0, sourceCount: 9},
		"item:plateSilver": {id: ItemID.densePlateSilver, count: 1, data: 0, sourceCount: 9},
		// Compact
		"minecraft:redstone": {id: 152, count: 1, data: 0, sourceCount: 9},
		"minecraft:lapis_lazuli": {id: 22, count: 1, data: 0, sourceCount: 9},
		"minecraft:coal": {id: VanillaBlockID.coal_block, count: 1, data: 0, sourceCount: 9},
		"minecraft:diamond": {id: 57, count: 1, data: 0, sourceCount: 9},
		"minecraft:emerald": {id: 133, count: 1, data: 0, sourceCount: 9},
		"minecraft:iron_ingot": {id: 42, count: 1, data: 0, sourceCount: 9},
		"minecraft:gold_ingot": {id: 41, count: 1, data: 0, sourceCount: 9},
		"minecraft:netherite_ingot": {id: VanillaBlockID.netherite_block, count: 1, data: 0, sourceCount: 9},
		"item:ingotCopper": {id: BlockID.blockCopper, count: 1, data: 0, sourceCount: 9},
		"item:ingotTin": {id: BlockID.blockTin, count: 1, data: 0, sourceCount: 9},
		"item:ingotLead": {id: BlockID.blockLead, count: 1, data: 0, sourceCount: 9},
		"item:ingotSteel": {id: BlockID.blockSteel, count: 1, data: 0, sourceCount: 9},
		"item:ingotBronze": {id: BlockID.blockBronze, count: 1, data: 0, sourceCount: 9},
		"item:ingotSilver": {id: BlockID.blockSilver, count: 1, data: 0, sourceCount: 9},
		"item:uranium238": {id: BlockID.blockUranium, count: 1, data: 0, sourceCount: 9},
		"item:dustSmallCopper": {id: ItemID.dustCopper, count: 1, data: 0, sourceCount: 9},
		"item:dustSmallTin": {id: ItemID.dustTin, count: 1, data: 0, sourceCount: 9},
		"item:dustSmallBronze": {id: ItemID.dustBronze, count: 1, data: 0, sourceCount: 9},
		"item:dustSmallIron": {id: ItemID.dustIron, count: 1, data: 0, sourceCount: 9},
		"item:dustSmallGold": {id: ItemID.dustGold, count: 1, data: 0, sourceCount: 9},
		"item:dustSmallLead": {id: ItemID.dustLead, count: 1, data: 0, sourceCount: 9},
		"item:dustSmallSilver": {id: ItemID.dustSilver, count: 1, data: 0, sourceCount: 9},
		"item:dustSmallSulfur": {id: ItemID.dustSulfur, count: 1, data: 0, sourceCount: 9},
		"item:smallUranium235": {id: ItemID.uranium235, count: 1, data: 0, sourceCount: 9},
		"item:smallPlutonium": {id: ItemID.plutonium, count: 1, data: 0, sourceCount: 9}
	}, true);
});

namespace Machine {
	const guiCompressor = MachineRegistry.createInventoryWindow("Compressor", {
		drawing: [
			{type: "bitmap", x: 530, y: 155, bitmap: "compressor_bar_background", scale: GUI_SCALE},
			{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE},
		],

		elements: {
			"progressScale": {type: "scale", x: 530, y: 155, direction: 0, bitmap: "compressor_bar_scale", scale: GUI_SCALE, clicker: {
				onClick: () => {
					RV?.RecipeTypeRegistry.openRecipePage("icpe_compressor");
				}
			}},
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

	export class Compressor extends ProcessingMachine {
		defaultEnergyDemand = 2;
		defaultProcessTime = 400;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiCompressor;
		}

		getRecipeResult(id: number, data: number): ProcessingRecipe {
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