/// <reference path="BasicProcessingMachine.ts" />

BlockRegistry.createBlock("compressor", [
	{name: "Compressor", texture: [["ic_machine_bottom", 0], ["ic_machine_top", 0], ["ic_machine_side", 0], ["compressor_front", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.compressor, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.compressor, 2, [["ic_machine_bottom", 0], ["ic_machine_top", 0], ["ic_machine_side", 0], ["compressor_front", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.compressor, 2, [["ic_machine_bottom", 0], ["ic_machine_top", 0], ["ic_machine_side", 0], ["compressor_front_on", 0], ["ic_machine_side", 0], ["ic_machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.compressor);

ItemName.addTierTooltip("compressor", 1);
ItemName.addConsumptionTooltip("compressor", "EU", 2);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.compressor, count: 1, data: 0}, [
		"p#p",
		"mcm"
	], ['#', BlockID.machineBlockBasic, -1, 'c', ItemID.circuitBasic, -1, 'm', ItemID.electricMotor, -1, 'p', VanillaBlockID.piston, -1]);

	const dictionary: MachineRecipe.ProcessingRecipeDictionary = MachineRecipeRegistry.getDictionary("compressor");
	// Blocks
	dictionary.addRecipe({id: VanillaBlockID.sand, count: 4, data: 0}, {id: 24, count: 1, data: 0});
	dictionary.addRecipe({id: VanillaBlockID.sand, count: 4, data: 1}, {id: VanillaBlockID.red_sandstone, count: 1, data: 0});
	dictionary.addRecipe({id: VanillaItemID.clay_ball, count: 4}, {id: VanillaBlockID.clay, count: 1});
	dictionary.addRecipe({id: VanillaItemID.brick, count: 4}, {id: 45, count: 1});
	dictionary.addRecipe({id: VanillaItemID.netherbrick, count: 4}, {id: 112, count: 1});
	dictionary.addRecipe({id: VanillaItemID.glowstone_dust, count: 4}, {id: 89, count: 1});
	dictionary.addRecipe({id: VanillaItemID.quartz, count: 4}, {id: 155, count: 1, data: 0});
	dictionary.addRecipe({id: VanillaItemID.snowball}, {id: VanillaBlockID.snow, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.snow}, {id: 79, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.ice, count: 9}, {id: VanillaBlockID.packed_ice, count: 1});
	dictionary.addRecipe({id: VanillaBlockID.packed_ice, count: 9}, {id: VanillaBlockID.blue_ice, count: 1});
	dictionary.addRecipe({id: VanillaItemID.bone_meal, count: 9}, {id: VanillaBlockID.bone_block, count: 1});
	dictionary.addRecipe({id: VanillaItemID.dried_kelp, count: 9}, {id: VanillaBlockID.dried_kelp_block, count: 1});
	
	// Items
	dictionary.addRecipe({id: ItemID.dustEnergium, count: 9}, {id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal)});
	dictionary.addRecipe({id: ItemID.ingotAlloy}, {id: ItemID.plateAlloy, count: 1});
	dictionary.addRecipe({id: ItemID.carbonMesh}, {id: ItemID.carbonPlate, count: 1});
	dictionary.addRecipe({id: ItemID.coalBall}, {id: ItemID.coalBlock, count: 1});
	dictionary.addRecipe({id: ItemID.coalChunk}, {id: 264, count: 1});
	dictionary.addRecipe({id: ItemID.cellEmpty}, {id: ItemID.cellAir, count: 1});
	dictionary.addRecipe({id: ItemID.dustLapis}, {id: ItemID.plateLapis, count: 1});
	dictionary.addRecipe({id: VanillaItemID.blaze_powder, count: 5}, {id: VanillaItemID.blaze_rod, count: 1});

	// Dense Plates
	dictionary.addRecipe({id: ItemID.plateIron, count: 9}, {id: ItemID.densePlateIron, count: 1});
	dictionary.addRecipe({id: ItemID.plateGold, count: 9}, {id: ItemID.densePlateGold, count: 1});
	dictionary.addRecipe({id: ItemID.plateTin, count: 9}, {id: ItemID.densePlateTin, count: 1});
	dictionary.addRecipe({id: ItemID.plateCopper, count: 9}, {id: ItemID.densePlateCopper, count: 1});
	dictionary.addRecipe({id: ItemID.plateBronze, count: 9}, {id: ItemID.densePlateBronze, count: 1});
	dictionary.addRecipe({id: ItemID.plateSteel, count: 9}, {id: ItemID.densePlateSteel, count: 1});
	dictionary.addRecipe({id: ItemID.plateLead, count: 9}, {id: ItemID.densePlateLead, count: 1});
	dictionary.addRecipe({id: ItemID.plateSilver, count: 9}, {id: ItemID.densePlateSilver, count: 1});

	// Compact
	dictionary.addRecipe({id: VanillaItemID.redstone, count: 9}, {id: 152, count: 1});
	dictionary.addRecipe({id: VanillaItemID.lapis_lazuli, count: 9}, {id: 22, count: 1});
	dictionary.addRecipe({id: VanillaItemID.coal, count: 9}, {id: VanillaBlockID.coal_block, count: 1});
	dictionary.addRecipe({id: VanillaItemID.diamond, count: 9}, {id: 57, count: 1});
	dictionary.addRecipe({id: VanillaItemID.emerald, count: 9}, {id: 133, count: 1});
	dictionary.addRecipe({id: VanillaItemID.iron_ingot, count: 9}, {id: 42, count: 1});
	dictionary.addRecipe({id: VanillaItemID.gold_ingot, count: 9}, {id: 41, count: 1});
	dictionary.addRecipe({id: VanillaItemID.netherite_ingot, count: 9}, {id: VanillaBlockID.netherite_block, count: 1});
	dictionary.addRecipe({id: ItemID.ingotCopper, count: 9}, {id: BlockID.blockCopper, count: 1});
	dictionary.addRecipe({id: ItemID.ingotTin, count: 9}, {id: BlockID.blockTin, count: 1});
	dictionary.addRecipe({id: ItemID.ingotLead, count: 9}, {id: BlockID.blockLead, count: 1});
	dictionary.addRecipe({id: ItemID.ingotSteel, count: 9}, {id: BlockID.blockSteel, count: 1});
	dictionary.addRecipe({id: ItemID.ingotBronze, count: 9}, {id: BlockID.blockBronze, count: 1});
	dictionary.addRecipe({id: ItemID.ingotSilver, count: 9}, {id: BlockID.blockSilver, count: 1});
	dictionary.addRecipe({id: ItemID.uranium238, count: 9}, {id: BlockID.blockUranium, count: 1});
	dictionary.addRecipe({id: ItemID.dustSmallCopper, count: 9}, {id: ItemID.dustCopper, count: 1}, 50);
	dictionary.addRecipe({id: ItemID.dustSmallTin, count: 9}, {id: ItemID.dustTin, count: 1}, 50);
	dictionary.addRecipe({id: ItemID.dustSmallBronze, count: 9}, {id: ItemID.dustBronze, count: 1}, 50);
	dictionary.addRecipe({id: ItemID.dustSmallIron, count: 9}, {id: ItemID.dustIron, count: 1}, 50);
	dictionary.addRecipe({id: ItemID.dustSmallGold, count: 9}, {id: ItemID.dustGold, count: 1}, 50);
	dictionary.addRecipe({id: ItemID.dustSmallLead, count: 9}, {id: ItemID.dustLead, count: 1}, 50);
	dictionary.addRecipe({id: ItemID.dustSmallSilver, count: 9}, {id: ItemID.dustSilver, count: 1}, 50);
	dictionary.addRecipe({id: ItemID.dustSmallSulfur, count: 9}, {id: ItemID.dustSulfur, count: 1}, 50);
	dictionary.addRecipe({id: ItemID.smallUranium235, count: 9}, {id: ItemID.uranium235, count: 1}, 50);
	dictionary.addRecipe({id: ItemID.smallPlutonium, count: 9}, {id: ItemID.plutonium, count: 1}, 50);
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

	export class Compressor extends BasicProcessingMachine {
		defaultEnergyDemand = 2;
		defaultProcessTime = 400;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiCompressor;
		}

		getRecipeDictionary(): MachineRecipe.ProcessingRecipeDictionary {
			return MachineRecipeRegistry.getDictionary("compressor");
		}

		getOperationSound(): string {
			return "CompressorOp.ogg";
		}

		getInterruptSound(): string {
			return "InterruptOne.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.compressor, new Compressor());

	MachineRecipeRegistry.registerDictionary("compressor", new MachineRecipe.ProcessingRecipeDictionary(400));

	StorageInterface.createInterface(BlockID.compressor, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance, side: number, tileEntity: Compressor) => {
			return tileEntity.isValidSource(item.id, item.data);
		}
	});
}
