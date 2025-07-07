﻿/// <reference path="ProcessingMachine.ts" />

BlockRegistry.createBlock("macerator", [
{name: "Macerator", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.macerator, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.macerator, 2, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.macerator, 2, [["machine_bottom", 0], ["macerator_top_active", 0], ["machine_side", 0], ["macerator_front_active", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.macerator);

ItemName.addTierTooltip("macerator", 1);

Callback.addCallback("PreLoaded", function() {
	if (IC2Config.hardRecipes) {
		Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
			"xxx",
			"b#b",
			" a "
		], ['#', BlockID.machineBlockBasic, -1, 'x', 264, -1, 'b', ItemID.circuitBasic, -1, 'a', ItemID.electricMotor, -1]);
	} else {
		Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
			"xxx",
			"b#b",
			" a "
		], ['#', BlockID.machineBlockBasic, -1, 'x', 318, -1, 'b', 4, -1, 'a', ItemID.circuitBasic, -1]);
	}

	MachineRecipeRegistry.registerRecipesFor("macerator", {
		// ores
		"minecraft:gold_ore": {id: ItemID.crushedGold, count: 2, data: 0},
		"minecraft:iron_ore": {id: ItemID.crushedIron, count: 2, data: 0},
		"BlockID.oreCopper": {id: ItemID.crushedCopper, count: 2, data: 0},
		"BlockID.oreTin": {id: ItemID.crushedTin, count: 2, data: 0},
		"BlockID.oreLead": {id: ItemID.crushedLead, count: 2, data: 0},
		"BlockID.oreSilver": {id: ItemID.crushedSilver, count: 2, data: 0},
		"BlockID.oreUranium": {id: ItemID.crushedUranium, count: 2, data: 0},
		// ingots
		"minecraft:iron_ingot": {id: ItemID.dustIron, count: 1, data: 0},
		"minecraft:gold_ingot": {id: ItemID.dustGold, count: 1, data: 0},
		"ItemID.ingotCopper": {id: ItemID.dustCopper, count: 1, data: 0},
		"ItemID.ingotTin": {id: ItemID.dustTin, count: 1, data: 0},
		"ItemID.ingotBronze": {id: ItemID.dustBronze, count: 1, data: 0},
		"ItemID.ingotSteel": {id: ItemID.dustSteel, count: 1, data: 0},
		"ItemID.ingotLead": {id: ItemID.dustLead, count: 1, data: 0},
		"ItemID.ingotSilver": {id: ItemID.dustSilver, count: 1, data: 0},
		// plates
		"ItemID.plateIron": {id: ItemID.dustIron, count: 1, data: 0},
		"ItemID.plateGold": {id: ItemID.dustGold, count: 1, data: 0},
		"ItemID.plateCopper": {id: ItemID.dustCopper, count: 1, data: 0},
		"ItemID.plateTin": {id: ItemID.dustTin, count: 1, data: 0},
		"ItemID.plateBronze": {id: ItemID.dustBronze, count: 1, data: 0},
		"ItemID.plateSteel": {id: ItemID.dustSteel, count: 1, data: 0},
		"ItemID.plateLead": {id: ItemID.dustLead, count: 1, data: 0},
		"ItemID.plateLapis": {id: ItemID.dustLapis, count: 1, data: 0},
		// dense plates
		"ItemID.densePlateIron": {id: ItemID.dustIron, count: 9, data: 0},
		"ItemID.densePlateGold": {id: ItemID.dustGold, count: 9, data: 0},
		"ItemID.densePlateCopper": {id: ItemID.dustCopper, count: 9, data: 0},
		"ItemID.densePlateTin": {id: ItemID.dustTin, count: 9, data: 0},
		"ItemID.densePlateBronze": {id: ItemID.dustBronze, count: 9, data: 0},
		"ItemID.densePlateSteel": {id: ItemID.dustSteel, count: 9, data: 0},
		"ItemID.densePlateLead": {id: ItemID.dustLead, count: 9, data: 0},
		// other resources
		"minecraft:lapis_block": {id: ItemID.dustLapis, count: 9, data: 0},
		"minecraft:coal_block": {id: ItemID.dustCoal, count: 9, data: 0},
		"minecraft:coal:0": {id: ItemID.dustCoal, count: 1, data: 0},
		"minecraft:diamond": {id: ItemID.dustDiamond, count: 1, data: 0},
		"minecraft:lapis_lazuli": {id: ItemID.dustLapis, count: 1, data: 0},
		"minecraft:spider_eye": {id: ItemID.grinPowder, count: 2, data: 0},
		"minecraft:poisonous_potato": {id: ItemID.grinPowder, count: 1, data: 0},
		// other materials
		"minecraft:stone:0": {id: 4, count: 1, data: 0},
		"minecraft:cobblestone": {id: 12, count: 1, data: 0},
		"minecraft:gravel": {id: 318, count: 1, data: 0},
		"minecraft:sandstone": {id: 12, count: 2, data: 0},
		"minecraft:wool": {id: 287, count: 2, data: 0},
		"minecraft:ice": {id: 332, count: 4, data: 0},
		"minecraft:glowstone": {id: 348, count: 4, data: 0},
		"minecraft:redstone_block": {id: 331, count: 9, data: 0},
		"minecraft:quartz_block": {id: 406, count: 4, data: 0},
		"minecraft:quartz_stairs": {id: 406, count: 6, data: 0},
		"minecraft:sandstone_stairs": {id: 12, count: 3, data: 0},
		"minecraft:red_sandstone": {id: 12, count: 2, data: 1},
		"minecraft:red_sandstone_stairs": {id: 12, count: 3, data: 1},
		"minecraft:bone": IDConverter.getStack("bone_meal", 5),
		"minecraft:blaze_rod": {id: 377, count: 5, data: 0},
		// plants
		"minecraft:planks": {id: ItemID.bioChaff, count: 1, sourceCount: 4},
		"BlockID.rubberTreeSapling": {id: ItemID.bioChaff, count: 1, sourceCount: 4},
		"BlockID.rubberTreeLeaves": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:leaves": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:leaves2": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:deadbush": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:cactus": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:pumpkin": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:wheat": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:reeds": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:melon_slice": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:carrot": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:potato": {id: ItemID.bioChaff, count: 1, sourceCount: 8},
		"minecraft:pumpkin_seeds": {id: ItemID.bioChaff, count: 1, sourceCount: 16},
		"minecraft:melon_seeds": {id: ItemID.bioChaff, count: 1, sourceCount: 16},
		"ItemID.weed": {id: ItemID.bioChaff, count: 1, sourceCount: 32},
		"ItemID.bioChaff": {id: 3, count: 1, data: 0},
		"ItemID.coffeeBeans": {id: ItemID.coffeePowder, count: 3, data: 0},
	}, true);
});


const guiMacerator = MachineRegistry.createInventoryWindow("Macerator", {
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "macerator_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, bitmap: "macerator_bar_scale", scale: GUI_SCALE, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("icpe_macerator");
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
	export class Macerator extends ProcessingMachine {
		defaultEnergyDemand = 2;
		defaultProcessTime = 300;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiMacerator;
		}

		getRecipeResult(id: number, data: number): MachineRecipeRegistry.RecipeData {
			return MachineRecipeRegistry.getRecipeResult("macerator", id, data);
		}

		getOperationSound(): string {
			return "MaceratorOp.ogg";
		}

		getInterruptSound(): string {
			return "InterruptOne.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.macerator, new Macerator());

	StorageInterface.createInterface(BlockID.macerator, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance) => {
			return MachineRecipeRegistry.hasRecipeFor("macerator", item.id, item.data);
		}
	});
}
