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

	const dictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipeRegistry.getDictionary("macerator");
	// ores
	dictionary.addRecipe({id: VanillaBlockID.gold_ore}, {id: ItemID.crushedGold, count: 2});
	dictionary.addRecipe({id: VanillaBlockID.iron_ore}, {id: ItemID.crushedIron, count: 2});
	dictionary.addRecipe({id: BlockID.oreCopper}, {id: ItemID.crushedCopper, count: 2});
	dictionary.addRecipe({id: BlockID.oreTin}, {id: ItemID.crushedTin, count: 2});
	dictionary.addRecipe({id: BlockID.oreLead}, {id: ItemID.crushedLead, count: 2});
	dictionary.addRecipe({id: BlockID.oreSilver}, {id: ItemID.crushedSilver, count: 2});
	dictionary.addRecipe({id: BlockID.oreUranium}, {id: ItemID.crushedUranium, count: 2});
	
	// ingots
	dictionary.addRecipe({id: VanillaItemID.iron_ingot}, {id: ItemID.dustIron, count: 1}, 200);
	dictionary.addRecipe({id: VanillaItemID.gold_ingot}, {id: ItemID.dustGold, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.ingotCopper}, {id: ItemID.dustCopper, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.ingotTin}, {id: ItemID.dustTin, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.ingotBronze}, {id: ItemID.dustBronze, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.ingotSteel}, {id: ItemID.dustSteel, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.ingotLead}, {id: ItemID.dustLead, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.ingotSilver}, {id: ItemID.dustSilver, count: 1}, 200);

	// plates
	dictionary.addRecipe({id: ItemID.plateIron}, {id: ItemID.dustIron, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.plateGold}, {id: ItemID.dustGold, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.plateCopper}, {id: ItemID.dustCopper, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.plateTin}, {id: ItemID.dustTin, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.plateBronze}, {id: ItemID.dustBronze, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.plateSteel}, {id: ItemID.dustSteel, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.plateLead}, {id: ItemID.dustLead, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.plateSilver}, {id: ItemID.dustSilver, count: 1}, 200);
	dictionary.addRecipe({id: ItemID.plateLapis}, {id: ItemID.dustLapis, count: 1}, 200);

	// dense plates
	dictionary.addRecipe({id: ItemID.densePlateIron}, {id: ItemID.dustIron, count: 9}, 400);
	dictionary.addRecipe({id: ItemID.densePlateGold}, {id: ItemID.dustGold, count: 9}, 400);
	dictionary.addRecipe({id: ItemID.densePlateCopper}, {id: ItemID.dustCopper, count: 9}, 400);
	dictionary.addRecipe({id: ItemID.densePlateTin}, {id: ItemID.dustTin, count: 9}, 400);
	dictionary.addRecipe({id: ItemID.densePlateBronze}, {id: ItemID.dustBronze, count: 9}, 400);
	dictionary.addRecipe({id: ItemID.densePlateSteel}, {id: ItemID.dustSteel, count: 9}, 400);
	dictionary.addRecipe({id: ItemID.densePlateLead}, {id: ItemID.dustLead, count: 9}, 400);
	dictionary.addRecipe({id: ItemID.densePlateSilver}, {id: ItemID.dustSilver, count: 9}, 400);

	// casings
	dictionary.addRecipe({id: ItemID.casingIron}, {id: ItemID.dustSmallIron, count: 4}, 100);
	dictionary.addRecipe({id: ItemID.casingGold}, {id: ItemID.dustSmallGold, count: 4}, 100);
	dictionary.addRecipe({id: ItemID.casingCopper}, {id: ItemID.dustSmallCopper, count: 4}, 100);
	dictionary.addRecipe({id: ItemID.casingTin}, {id: ItemID.dustSmallTin, count: 4}, 100);
	dictionary.addRecipe({id: ItemID.casingBronze}, {id: ItemID.dustSmallBronze, count: 4}, 100);
	dictionary.addRecipe({id: ItemID.casingSteel}, {id: ItemID.dustSmallSteel, count: 4}, 100);
	dictionary.addRecipe({id: ItemID.casingLead}, {id: ItemID.dustSmallLead, count: 4}, 100);
	dictionary.addRecipe({id: ItemID.casingSilver}, {id: ItemID.dustSmallSilver, count: 4}, 100);

	// nuggets
	dictionary.addRecipe({id: VanillaItemID.iron_nugget}, {id: ItemID.dustSmallIron, count: 1}, 25);
	dictionary.addRecipe({id: VanillaItemID.gold_nugget}, {id: ItemID.dustSmallGold, count: 1}, 25);

	// other resources
	dictionary.addRecipe({id: VanillaBlockID.lapis_block}, {id: ItemID.dustLapis, count: 9}, 400);
	dictionary.addRecipe({id: VanillaBlockID.coal_block}, {id: ItemID.dustCoal, count: 9}, 400);
	dictionary.addRecipe({id: VanillaItemID.coal, data: 0}, {id: ItemID.dustCoal, count: 1}, 200);
	dictionary.addRecipe({id: VanillaItemID.diamond}, {id: ItemID.dustDiamond, count: 1});
	dictionary.addRecipe({id: VanillaItemID.lapis_lazuli}, {id: ItemID.dustLapis, count: 1}, 200);
	dictionary.addRecipe({id: VanillaBlockID.hardened_clay}, {id: ItemID.dustClay, count: 4}, 300);
	dictionary.addRecipe({id: VanillaBlockID.stained_hardened_clay}, {id: ItemID.dustClay, count: 4}, 300);
	dictionary.addRecipe({id: VanillaBlockID.obsidian}, {id: ItemID.dustObsidian, count: 4}, 500);
	dictionary.addRecipe({id: VanillaItemID.spider_eye}, {id: ItemID.grinPowder, count: 2}, 200);
	dictionary.addRecipe({id: VanillaItemID.poisonous_potato}, {id: ItemID.grinPowder, count: 1}, 200);

	// other materials
	dictionary.addRecipe({id: VanillaBlockID.stone, data: 0}, {id: 4, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.cobblestone}, {id: 12, count: 1, data: 0});
	dictionary.addRecipe({id: VanillaBlockID.gravel}, {id: 318, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.wool}, {id: 287, count: 2});
	dictionary.addRecipe({id: VanillaBlockID.ice}, {id: 332, count: 4});
	dictionary.addRecipe({id: VanillaBlockID.glowstone}, {id: 348, count: 4});
	dictionary.addRecipe({id: VanillaBlockID.redstone_block}, {id: 331, count: 9});
	dictionary.addRecipe({id: VanillaBlockID.quartz_block}, {id: 406, count: 4});
	dictionary.addRecipe({id: VanillaBlockID.quartz_stairs}, {id: 406, count: 4});
	dictionary.addRecipe({id: VanillaBlockID.sandstone}, {id: 12, count: 2, data: 0});
	dictionary.addRecipe({id: VanillaBlockID.sandstone_stairs}, {id: 12, count: 2, data: 0});
	dictionary.addRecipe({id: VanillaBlockID.red_sandstone}, {id: 12, count: 2, data: 1});
	dictionary.addRecipe({id: VanillaBlockID.red_sandstone_stairs}, {id: 12, count: 2, data: 1});
	dictionary.addRecipe({id: VanillaItemID.bone}, {id: VanillaItemID.bone_meal, count: 5}, 200);
	dictionary.addRecipe({id: VanillaItemID.blaze_rod}, {id: 377, count: 5}, 200);

	// plants
	dictionary.addRecipe({id: VanillaBlockID.planks, count: 4}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.warped_planks, count: 4}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.crimson_planks, count: 4}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: BlockID.rubberTreeSapling, count: 4}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: BlockID.rubberTreeLeaves, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.leaves, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.leaves2, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.deadbush, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.cactus, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.pumpkin, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.wheat, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.reeds, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaItemID.melon_slice, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaItemID.carrot, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaItemID.potato, count: 8}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaItemID.pumpkin_seeds, count: 16}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: VanillaItemID.melon_seeds, count: 16}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: ItemID.weed, count: 32}, {id: ItemID.bioChaff, count: 1});
	dictionary.addRecipe({id: ItemID.bioChaff}, {id: 3, count: 1});
	dictionary.addRecipe({id: ItemID.coffeeBeans}, {id: ItemID.coffeePowder, count: 3, data: 0});
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

		getRecipeDictionary(): MachineRecipe.ProcessingRecipeDictionary {
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

	MachineRecipeRegistry.registerDictionary("macerator", new MachineRecipe.ProcessingRecipeDictionary(300));

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

