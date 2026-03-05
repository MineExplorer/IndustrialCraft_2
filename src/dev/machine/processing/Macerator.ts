/// <reference path="BasicProcessingMachine.ts" />

BlockRegistry.createBlock("macerator", [
{name: "Macerator", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.macerator, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.macerator, 2, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.macerator, 2, [["machine_bottom", 0], ["macerator_top_active", 0], ["machine_side", 0], ["macerator_front_active", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.macerator);

ItemName.addTierTooltip("macerator", 1);
ItemName.addConsumptionTooltip("macerator", "EU", 2);

Callback.addCallback("PreLoaded", function() {
	if (IC2Config.hardRecipes) {
		Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
			"xfx",
			"b#b",
			" a "
		], ['#', BlockID.machineBlockBasic, -1, 'x', 264, -1, 'f', 318, -1, 'b', ItemID.circuitBasic, -1, 'a', ItemID.electricMotor, -1]);
	} else {
		Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
			"xxx",
			"b#b",
			" a "
		], ['#', BlockID.machineBlockBasic, -1, 'x', 318, -1, 'b', ItemID.circuitBasic, -1, 'a', ItemID.electricMotor, -1]);
	}

	MachineRecipeRegistry.registerRecipes<Machine.ProcessingRecipe>("macerator", [
		// ores
		{ source: {id: VanillaBlockID.gold_ore}, result: {id: ItemID.crushedGold, count: 2} },
		{ source: {id: VanillaBlockID.iron_ore}, result: {id: ItemID.crushedIron, count: 2} },
		{ source: {id: BlockID.oreCopper}, result: {id: ItemID.crushedCopper, count: 2} },
		{ source: {id: BlockID.oreTin}, result: {id: ItemID.crushedTin, count: 2} },
		{ source: {id: BlockID.oreLead}, result: {id: ItemID.crushedLead, count: 2} },
		{ source: {id: BlockID.oreSilver}, result: {id: ItemID.crushedSilver, count: 2} },
		{ source: {id: BlockID.oreUranium}, result: {id: ItemID.crushedUranium, count: 2} },

		// ingots
		{ source: {id: VanillaItemID.iron_ingot}, result: {id: ItemID.dustIron, count: 1} },
		{ source: {id: VanillaItemID.gold_ingot}, result: {id: ItemID.dustGold, count: 1} },
		{ source: {id: ItemID.ingotCopper}, result: {id: ItemID.dustCopper, count: 1} },
		{ source: {id: ItemID.ingotTin}, result: {id: ItemID.dustTin, count: 1} },
		{ source: {id: ItemID.ingotBronze}, result: {id: ItemID.dustBronze, count: 1} },
		{ source: {id: ItemID.ingotSteel}, result: {id: ItemID.dustSteel, count: 1} },
		{ source: {id: ItemID.ingotLead}, result: {id: ItemID.dustLead, count: 1} },
		{ source: {id: ItemID.ingotSilver}, result: {id: ItemID.dustSilver, count: 1} },

		// plates
		{ source: {id: ItemID.plateIron}, result: {id: ItemID.dustIron, count: 1} },
		{ source: {id: ItemID.plateGold}, result: {id: ItemID.dustGold, count: 1} },
		{ source: {id: ItemID.plateCopper}, result: {id: ItemID.dustCopper, count: 1} },
		{ source: {id: ItemID.plateTin}, result: {id: ItemID.dustTin, count: 1} },
		{ source: {id: ItemID.plateBronze}, result: {id: ItemID.dustBronze, count: 1} },
		{ source: {id: ItemID.plateSteel}, result: {id: ItemID.dustSteel, count: 1} },
		{ source: {id: ItemID.plateLead}, result: {id: ItemID.dustLead, count: 1} },
		{ source: {id: ItemID.plateSilver}, result: {id: ItemID.dustSilver, count: 1} },
		{ source: {id: ItemID.plateLapis}, result: {id: ItemID.dustLapis, count: 1} },

		// dense plates
		{ source: {id: ItemID.densePlateIron}, result: {id: ItemID.dustIron, count: 9} },
		{ source: {id: ItemID.densePlateGold}, result: {id: ItemID.dustGold, count: 9} },
		{ source: {id: ItemID.densePlateCopper}, result: {id: ItemID.dustCopper, count: 9} },
		{ source: {id: ItemID.densePlateTin}, result: {id: ItemID.dustTin, count: 9} },
		{ source: {id: ItemID.densePlateBronze}, result: {id: ItemID.dustBronze, count: 9} },
		{ source: {id: ItemID.densePlateSteel}, result: {id: ItemID.dustSteel, count: 9} },
		{ source: {id: ItemID.densePlateLead}, result: {id: ItemID.dustLead, count: 9} },
		{ source: {id: ItemID.densePlateSilver}, result: {id: ItemID.dustSilver, count: 9} },

		// casings
		{ source: {id: ItemID.casingIron}, result: {id: ItemID.dustSmallIron, count: 4} },
		{ source: {id: ItemID.casingGold}, result: {id: ItemID.dustSmallGold, count: 4} },
		{ source: {id: ItemID.casingCopper}, result: {id: ItemID.dustSmallCopper, count: 4} },
		{ source: {id: ItemID.casingTin}, result: {id: ItemID.dustSmallTin, count: 4} },
		{ source: {id: ItemID.casingBronze}, result: {id: ItemID.dustSmallBronze, count: 4} },
		{ source: {id: ItemID.casingSteel}, result: {id: ItemID.dustSmallSteel, count: 4} },
		{ source: {id: ItemID.casingLead}, result: {id: ItemID.dustSmallLead, count: 4} },
		{ source: {id: ItemID.casingSilver}, result: {id: ItemID.dustSmallSilver, count: 4} },

		// nuggets
		{ source: {id: VanillaItemID.iron_nugget}, result: {id: ItemID.dustSmallIron, count: 1} },
		{ source: {id: VanillaItemID.gold_nugget}, result: {id: ItemID.dustSmallGold, count: 1} },

		// other resources
		{ source: {id: VanillaBlockID.lapis_block}, result: {id: ItemID.dustLapis, count: 9} },
		{ source: {id: VanillaBlockID.coal_block}, result: {id: ItemID.dustCoal, count: 9} },
		{ source: {id: VanillaItemID.coal, data: 0}, result: {id: ItemID.dustCoal, count: 1} },
		{ source: {id: VanillaItemID.diamond}, result: {id: ItemID.dustDiamond, count: 1} },
		{ source: {id: VanillaItemID.lapis_lazuli}, result: {id: ItemID.dustLapis, count: 1} },
		{ source: {id: VanillaItemID.spider_eye}, result: {id: ItemID.grinPowder, count: 2} },
		{ source: {id: VanillaItemID.poisonous_potato}, result: {id: ItemID.grinPowder, count: 1} },

		// other materials
		{ source: {id: VanillaBlockID.stone, data: 0}, result: {id: 4, count: 1} },
		{ source: {id: VanillaBlockID.cobblestone}, result: {id: 12, count: 1, data: 0} },
		{ source: {id: VanillaBlockID.gravel}, result: {id: 318, count: 1} },
		{ source: {id: VanillaBlockID.sandstone}, result: {id: 12, count: 2, data: 0} },
		{ source: {id: VanillaBlockID.wool}, result: {id: 287, count: 2} },
		{ source: {id: VanillaBlockID.ice}, result: {id: 332, count: 4} },
		{ source: {id: VanillaBlockID.glowstone}, result: {id: 348, count: 4} },
		{ source: {id: VanillaBlockID.redstone_block}, result: {id: 331, count: 9} },
		{ source: {id: VanillaBlockID.quartz_block}, result: {id: 406, count: 4} },
		{ source: {id: VanillaBlockID.quartz_stairs}, result: {id: 406, count: 6} },
		{ source: {id: VanillaBlockID.sandstone_stairs}, result: {id: 12, count: 3, data: 0} },
		{ source: {id: VanillaBlockID.red_sandstone}, result: {id: 12, count: 2, data: 1} },
		{ source: {id: VanillaBlockID.red_sandstone_stairs}, result: {id: 12, count: 3, data: 1} },
		{ source: {id: VanillaItemID.bone}, result: {id: VanillaItemID.bone_meal, count: 5} },
		{ source: {id: VanillaItemID.blaze_rod}, result: {id: 377, count: 5} },

		// plants
		{ source: {id: VanillaBlockID.planks, count: 4}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: BlockID.rubberTreeSapling, count: 4}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: BlockID.rubberTreeLeaves, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaBlockID.leaves, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaBlockID.leaves2, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaBlockID.deadbush, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaBlockID.cactus, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaBlockID.pumpkin, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaBlockID.wheat, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaBlockID.reeds, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaItemID.melon_slice, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaItemID.carrot, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaItemID.potato, count: 8}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaItemID.pumpkin_seeds, count: 16}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: VanillaItemID.melon_seeds, count: 16}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: ItemID.weed, count: 32}, result: {id: ItemID.bioChaff, count: 1} },
		{ source: {id: ItemID.bioChaff}, result: {id: 3, count: 1} },
		{ source: {id: ItemID.coffeeBeans}, result: {id: ItemID.coffeePowder, count: 3, data: 0} }
	]);
});

namespace Machine {
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

	export class Macerator extends BasicProcessingMachine {
		defaultEnergyDemand = 2;
		defaultProcessTime = 300;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiMacerator;
		}

		getRecipeDictionary(): ProcessingRecipeDictionary<ProcessingRecipe> {
			return MachineRecipeRegistry.getDictionary("macerator");
		}

		getOperationSound(): string {
			return "MaceratorOp.ogg";
		}

		getInterruptSound(): string {
			return "InterruptOne.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.macerator, new Macerator());

	MachineRecipeRegistry.registerDictionary<ProcessingRecipe>("macerator", new ProcessingRecipeDictionary(300));

	StorageInterface.createInterface(BlockID.macerator, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance, side: number, tileEntity: Macerator) => {
			return tileEntity.isValidSource(item.id, item.data);;
		}
	});
}
