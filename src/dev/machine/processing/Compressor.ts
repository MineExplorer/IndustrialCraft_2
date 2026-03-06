/// <reference path="BasicProcessingMachine.ts" />

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

	MachineRecipeRegistry.registerRecipes<ItemProcessingRecipe>("compressor", [
		// Blocks
		{ source: {id: VanillaBlockID.sand, count: 4, data: 0}, result: [{id: 24, count: 1, data: 0}] },
		{ source: {id: VanillaBlockID.sand, count: 4, data: 1}, result: [{id: VanillaBlockID.red_sandstone, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.clay_ball, count: 4}, result: [{id: VanillaBlockID.clay, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.brick, count: 4}, result: [{id: 45, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.netherbrick, count: 4}, result: [{id: 112, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.glowstone_dust, count: 4}, result: [{id: 89, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.quartz, count: 4}, result: [{id: 155, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.snowball}, result: [{id: VanillaBlockID.snow, count: 1, data: 0}] },
		{ source: {id: VanillaBlockID.snow}, result: [{id: 79, count: 1, data: 0}] },
		{ source: {id: VanillaBlockID.ice, count: 9}, result: [{id: VanillaBlockID.packed_ice, count: 1, data: 0}] },
		{ source: {id: VanillaBlockID.packed_ice, count: 9}, result: [{id: VanillaBlockID.blue_ice, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.bone_meal, count: 9}, result: [{id: VanillaBlockID.bone_block, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.dried_kelp, count: 9}, result: [{id: VanillaBlockID.dried_kelp_block, count: 1, data: 0}] },
		
		// Items
		{ source: {id: ItemID.dustEnergium, count: 9}, result: [{id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal)}] },
		{ source: {id: ItemID.ingotAlloy}, result: [{id: ItemID.plateAlloy, count: 1, data: 0}] },
		{ source: {id: ItemID.carbonMesh}, result: [{id: ItemID.carbonPlate, count: 1, data: 0}] },
		{ source: {id: ItemID.coalBall}, result: [{id: ItemID.coalBlock, count: 1, data: 0}] },
		{ source: {id: ItemID.coalChunk}, result: [{id: 264, count: 1, data: 0}] },
		{ source: {id: ItemID.cellEmpty}, result: [{id: ItemID.cellAir, count: 1, data: 0}] },
		{ source: {id: ItemID.dustLapis}, result: [{id: ItemID.plateLapis, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.blaze_powder, count: 5}, result: [{id: VanillaItemID.blaze_rod, count: 1, data: 0}] },

		// Dense Plates
		{ source: {id: ItemID.plateIron, count: 9}, result: [{id: ItemID.densePlateIron, count: 1, data: 0}] },
		{ source: {id: ItemID.plateGold, count: 9}, result: [{id: ItemID.densePlateGold, count: 1, data: 0}] },
		{ source: {id: ItemID.plateTin, count: 9}, result: [{id: ItemID.densePlateTin, count: 1, data: 0}] },
		{ source: {id: ItemID.plateCopper, count: 9}, result: [{id: ItemID.densePlateCopper, count: 1, data: 0}] },
		{ source: {id: ItemID.plateBronze, count: 9}, result: [{id: ItemID.densePlateBronze, count: 1, data: 0}] },
		{ source: {id: ItemID.plateSteel, count: 9}, result: [{id: ItemID.densePlateSteel, count: 1, data: 0}] },
		{ source: {id: ItemID.plateLead, count: 9}, result: [{id: ItemID.densePlateLead, count: 1, data: 0}] },
		{ source: {id: ItemID.plateSilver, count: 9}, result: [{id: ItemID.densePlateSilver, count: 1, data: 0}] },

		// Compact
		{ source: {id: VanillaItemID.redstone, count: 9}, result: [{id: 152, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.lapis_lazuli, count: 9}, result: [{id: 22, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.coal, count: 9}, result: [{id: VanillaBlockID.coal_block, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.diamond, count: 9}, result: [{id: 57, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.emerald, count: 9}, result: [{id: 133, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.iron_ingot, count: 9}, result: [{id: 42, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.gold_ingot, count: 9}, result: [{id: 41, count: 1, data: 0}] },
		{ source: {id: VanillaItemID.netherite_ingot, count: 9}, result: [{id: VanillaBlockID.netherite_block, count: 1, data: 0}] },
		{ source: {id: ItemID.ingotCopper, count: 9}, result: [{id: BlockID.blockCopper, count: 1, data: 0}] },
		{ source: {id: ItemID.ingotTin, count: 9}, result: [{id: BlockID.blockTin, count: 1, data: 0}] },
		{ source: {id: ItemID.ingotLead, count: 9}, result: [{id: BlockID.blockLead, count: 1, data: 0}] },
		{ source: {id: ItemID.ingotSteel, count: 9}, result: [{id: BlockID.blockSteel, count: 1, data: 0}] },
		{ source: {id: ItemID.ingotBronze, count: 9}, result: [{id: BlockID.blockBronze, count: 1, data: 0}] },
		{ source: {id: ItemID.ingotSilver, count: 9}, result: [{id: BlockID.blockSilver, count: 1, data: 0}] },
		{ source: {id: ItemID.uranium238, count: 9}, result: [{id: BlockID.blockUranium, count: 1, data: 0}] },
		{ source: {id: ItemID.dustSmallCopper, count: 9}, result: [{id: ItemID.dustCopper, count: 1, data: 0}] },
		{ source: {id: ItemID.dustSmallTin, count: 9}, result: [{id: ItemID.dustTin, count: 1, data: 0}] },
		{ source: {id: ItemID.dustSmallBronze, count: 9}, result: [{id: ItemID.dustBronze, count: 1, data: 0}] },
		{ source: {id: ItemID.dustSmallIron, count: 9}, result: [{id: ItemID.dustIron, count: 1, data: 0}] },
		{ source: {id: ItemID.dustSmallGold, count: 9}, result: [{id: ItemID.dustGold, count: 1, data: 0}] },
		{ source: {id: ItemID.dustSmallLead, count: 9}, result: [{id: ItemID.dustLead, count: 1, data: 0}] },
		{ source: {id: ItemID.dustSmallSilver, count: 9}, result: [{id: ItemID.dustSilver, count: 1, data: 0}] },
		{ source: {id: ItemID.dustSmallSulfur, count: 9}, result: [{id: ItemID.dustSulfur, count: 1, data: 0}] },
		{ source: {id: ItemID.smallUranium235, count: 9}, result: [{id: ItemID.uranium235, count: 1, data: 0}] },
		{ source: {id: ItemID.smallPlutonium, count: 9}, result: [{id: ItemID.plutonium, count: 1, data: 0}] }
	]);
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

		getRecipeDictionary(): ProcessingRecipeDictionary<ItemProcessingRecipe> {
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

	MachineRecipeRegistry.registerDictionary<ItemProcessingRecipe>("compressor", new ProcessingRecipeDictionary(400));

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