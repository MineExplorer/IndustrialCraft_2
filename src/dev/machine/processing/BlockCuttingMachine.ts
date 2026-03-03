BlockRegistry.createBlock("blockCuttingMachine", [
	{name: "Block Cutting Machine", texture: [["block_cutter_bottomtop", 0], ["block_cutter_bottomtop", 0], ["block_cutter_side", 0], ["block_cutter_back", 0], ["block_cutter_side", 0], ["block_cutter_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.blockCuttingMachine, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.blockCuttingMachine, 2, [["block_cutter_bottomtop", 0], ["block_cutter_bottomtop", 0], ["block_cutter_back", 0], ["block_cutter_side", 0], ["block_cutter_side", 0], ["block_cutter_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.blockCuttingMachine, 2, [["block_cutter_bottomtop", 0], ["block_cutter_bottomtop", 0], ["block_cutter_back", 0], ["block_cutter_side_active", 0], ["block_cutter_side_active", 0], ["block_cutter_side_active", 0]]);
TileRenderer.setRotationFunction(BlockID.blockCuttingMachine);

ItemName.addTierTooltip("blockCuttingMachine", 2);
ItemName.addConsumptionTooltip("blockCuttingMachine", "EU", 8);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.blockCuttingMachine, count: 1, data: 0}, [
		"a",
        "#",
        "b"
	], ['#', BlockID.machineBlockAdvanced, 0, 'a', ItemID.circuitAdvanced, 0, 'b', ItemID.electricMotor, 0]);
	
	MachineRecipeRegistry.registerRecipesFor<DataMap<Machine.CuttingRecipe>>("cuttingMachine", {
		// Iron blade or higher
		"minecraft:log:0": {result: {id: VanillaBlockID.planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:log:1": {result: {id: VanillaBlockID.planks, data: 1, count: 6}, hardnessLevel: 1},
		"minecraft:log:2": {result: {id: VanillaBlockID.planks, data: 2, count: 6}, hardnessLevel: 1},
		"minecraft:log:3": {result: {id: VanillaBlockID.planks, data: 3, count: 6}, hardnessLevel: 1},
		"minecraft:log2:0": {result: {id: VanillaBlockID.planks, data: 4, count: 6}, hardnessLevel: 1},
		"minecraft:log2:1": {result: {id: VanillaBlockID.planks, data: 5, count: 6}, hardnessLevel: 1},
		"minecraft:crimson_stem": {result: {id: VanillaBlockID.crimson_planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:warped_stem": {result: {id: VanillaBlockID.warped_planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_oak_log": {result: {id: VanillaBlockID.planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_spruce_log": {result: {id: VanillaBlockID.planks, data: 1, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_birch_log": {result: {id: VanillaBlockID.planks, data: 2, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_jungle_log": {result: {id: VanillaBlockID.planks, data: 3, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_acacia_log": {result: {id: VanillaBlockID.planks, data: 4, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_dark_oak_log": {result: {id: VanillaBlockID.planks, data: 5, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_crimson_stem": {result: {id: VanillaBlockID.crimson_planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_warped_stem": {result: {id: VanillaBlockID.warped_planks, data: 0, count: 6}, hardnessLevel: 1},
		// Wood
		"minecraft:wood:0": {result: {id: VanillaBlockID.planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:wood:1": {result: {id: VanillaBlockID.planks, data: 1, count: 6}, hardnessLevel: 1},
		"minecraft:wood:2": {result: {id: VanillaBlockID.planks, data: 2, count: 6}, hardnessLevel: 1},
		"minecraft:wood:3": {result: {id: VanillaBlockID.planks, data: 3, count: 6}, hardnessLevel: 1},
		"minecraft:wood:4": {result: {id: VanillaBlockID.planks, data: 4, count: 6}, hardnessLevel: 1},
		"minecraft:wood:5": {result: {id: VanillaBlockID.planks, data: 5, count: 6}, hardnessLevel: 1},
		// Stripped wood
		"minecraft:wood:8": {result: {id: VanillaBlockID.planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:wood:9": {result: {id: VanillaBlockID.planks, data: 1, count: 6}, hardnessLevel: 1},
		"minecraft:wood:10": {result: {id: VanillaBlockID.planks, data: 2, count: 6}, hardnessLevel: 1},
		"minecraft:wood:11": {result: {id: VanillaBlockID.planks, data: 3, count: 6}, hardnessLevel: 1},
		"minecraft:wood:12": {result: {id: VanillaBlockID.planks, data: 4, count: 6}, hardnessLevel: 1},
		"minecraft:wood:13": {result: {id: VanillaBlockID.planks, data: 5, count: 6}, hardnessLevel: 1},
		"minecraft:crimson_hyphae": {result: {id: VanillaBlockID.crimson_planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:warped_hyphae": {result: {id: VanillaBlockID.warped_planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_crimson_hyphae": {result: {id: VanillaBlockID.crimson_planks, data: 0, count: 6}, hardnessLevel: 1},
		"minecraft:stripped_warped_hyphae": {result: {id: VanillaBlockID.warped_planks, data: 0, count: 6}, hardnessLevel: 1},
		"block:rubberTreeLog": {result: {id: VanillaBlockID.planks, data: 3, count: 6}, hardnessLevel: 1},
		
		"minecraft:planks": {result: {id: VanillaItemID.stick, count: 6}, sourceCount: 2, hardnessLevel: 1},
		"minecraft:crimson_planks": {result: {id: VanillaItemID.stick, count: 6}, sourceCount: 2, hardnessLevel: 1},
		"minecraft:warped_planks": {result: {id: VanillaItemID.stick, count: 6}, sourceCount: 2, hardnessLevel: 1},
		
		"block:blockCopper": {result: {id: ItemID.plateCopper, count: 9}, hardnessLevel: 1},
		"block:blockTin": {result: {id: ItemID.plateTin, count: 9}, hardnessLevel: 1},
		"block:blockBronze": {result: {id: ItemID.plateBronze, count: 9}, hardnessLevel: 1},
		"block:blockLead": {result: {id: ItemID.plateLead, count: 9}, hardnessLevel: 1},
		"minecraft:gold_block": {result: {id: ItemID.plateGold, count: 9}, hardnessLevel: 1},
		"minecraft:lapis_block": {result: {id: ItemID.plateLapis, count: 9}, hardnessLevel: 1},
		// Steel blade or higher
		"minecraft:iron_block": {result: {id: ItemID.plateIron, count: 9}, hardnessLevel: 2},
		// Diamond blade
		"block:blockSteel": {result: {id: ItemID.plateSteel, count: 9}, hardnessLevel: 3},
	}, true);
});

namespace Machine {
	export type CuttingRecipe = {
		result: MachineRecipeRegistry.ItemResult,
		hardnessLevel: number,
		sourceCount?: number
	}

	const guiBlockCutter = MachineRegistry.createInventoryWindow("Block Cutting Machine", {
		drawing: [
			{type: "bitmap", x: 530, y: 148, bitmap: "icpe.cutting_machine_bar_background", scale: GUI_SCALE},
			{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
		],

		elements: {
			"progressScale": {type: "scale", x: 530, y: 148, direction: 0, bitmap: "icpe.cutting_machine_bar_scale", scale: GUI_SCALE, clicker: {
				onClick: (_, container, tileEntity, position: any) => {
					if (position.x < 14 / 46 || position.x > 32 / 46) {
						RV?.RecipeTypeRegistry.openRecipePage("icpe_cutting_machine");
					}
				}
			}},
			"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
			"slotSource": {type: "slot", x: 441, y: 79},
			"slotBlade": {type: "slot", x: 573, y: 148, z: 100, bitmap: "transparent_slot"},
			"slotEnergy": {type: "slot", x: 441, y: 218},
			"slotResult": {type: "slot", x: 707, y: 148},
			"slotUpgrade1": {type: "slot", x: 820, y: 60},
			"slotUpgrade2": {type: "slot", x: 820, y: 119},
			"slotUpgrade3": {type: "slot", x: 820, y: 178},
			"slotUpgrade4": {type: "slot", x: 820, y: 237},
		}
	});

	export class BlockCutter extends ProcessingMachine {
		defaultTier = 2;
		defaultEnergyDemand = 8;
		defaultEnergyStorage = 3600;
		defaultProcessTime = 450;
		speedModifier = 1;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiBlockCutter;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name.startsWith("slotSource")) return !!this.getRecipe(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				if (name == "slotBlade") return this.getBladeLevel(id) > 0;
				return false;
			});
		}

		getBladeLevel(bladeId: number): number {
			switch (bladeId) {
				case ItemID.cuttingBladeIron:
					return 1;
				case ItemID.cuttingBladeSteel:
					return 2;
				case ItemID.cuttingBladeDiamond:
					return 3;
				default:
					return 0;
			}
		}

		getRecipe(id: number, data: number): CuttingRecipe {
			return MachineRecipeRegistry.getRecipeResult("cuttingMachine", id, data);
		}

		onTick() {
			const bladeSlot = this.container.getSlot("slotBlade");
			this.container.sendEvent("showWarning", { show: bladeSlot.id == 0 });

			super.onTick();
		}

		performRecipe(): boolean {
			let newActive = false;

			const sourceSlot = this.container.getSlot("slotSource");
			const recipe = this.getRecipe(sourceSlot.id, sourceSlot.data);

			const bladeSlot = this.container.getSlot("slotBlade");
			const bladeLevel = this.getBladeLevel(bladeSlot.id);

			if (recipe && bladeLevel >= recipe.hardnessLevel && (!recipe.sourceCount || sourceSlot.count >= recipe.sourceCount)) {
				const resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == 0 || (resultSlot.id == recipe.result.id && (!recipe.result.data || resultSlot.data == recipe.result.data) && resultSlot.count <= 64 - recipe.result.count)) {
					if (this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						// apply 50% speed increase for each hardness level exceeding required
						const processTime = this.defaultProcessTime / (1 + (bladeLevel - recipe.hardnessLevel) * 0.5);
						this.updateProgress(processTime);
						newActive = true;
					}
					if (this.isCompletedProgress()) {
						this.decreaseSlot(sourceSlot, recipe.sourceCount || 1);
						resultSlot.setSlot(recipe.result.id, resultSlot.count + recipe.result.count, recipe.result.data || 0);
						this.data.progress = 0;
					}
				}
				if (!newActive && this.networkData.getBoolean(NetworkDataKeys.isActive)) {
					this.onInterrupt(); // interrupt if machine stopped working while processing item
				}
			}
			else if (this.data.progress > 0) {
				this.data.progress = 0;
				this.onInterrupt(); // interrupt when the source item is extracted
			}

			return newActive;
		}

		getInterruptSound(): string {
			return "InterruptOne.ogg";
		}

		@ContainerEvent(Side.Client, "showWarning")
		onShowWarning(container: ItemContainer, window: any, content: any, data: { show: boolean }): void {
			if (content) {
				if (!data.show) {
					content.elements["warningImage"] = null;
				}
				else if (!content.elements["warningImage"]) {
					content.elements["warningImage"] = {type: "image", x: 576, y: 223, bitmap: "icpe.warning", scale: GUI_SCALE};
				}
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.blockCuttingMachine, new BlockCutter());

	StorageInterface.createInterface(BlockID.blockCuttingMachine, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance) => {
			return MachineRecipeRegistry.hasRecipeFor("cuttingMachine", item.id, item.data);
		}
	});
}

