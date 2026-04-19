/// <reference path="./ProcessingMachine.ts" />

BlockRegistry.createBlock("blockCuttingMachine", [
	{name: "Block Cutting Machine", texture: [["block_cutter_bottomtop", 0], ["block_cutter_bottomtop", 0], ["block_cutter_side", 0], ["block_cutter_back", 0], ["block_cutter_side", 0], ["block_cutter_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.blockCuttingMachine, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.blockCuttingMachine, 2, [["block_cutter_bottomtop", 0], ["block_cutter_bottomtop", 0], ["block_cutter_back", 0], ["block_cutter_side", 0], ["block_cutter_side", 0], ["block_cutter_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.blockCuttingMachine, 2, [["block_cutter_bottomtop", 0], ["block_cutter_bottomtop", 0], ["block_cutter_back", 0], ["block_cutter_side_on", 0], ["block_cutter_side_on", 0], ["block_cutter_side_on", 0]]);
TileRenderer.setRotationFunction(BlockID.blockCuttingMachine);

ItemName.addTierTooltip("blockCuttingMachine", 2);
ItemName.addConsumptionTooltip("blockCuttingMachine", "EU", 12);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.blockCuttingMachine, count: 1, data: 0}, [
		"a",
        "#",
        "b"
	], ['#', BlockID.machineBlockAdvanced, 0, 'a', ItemID.circuitAdvanced, 0, 'b', ItemID.electricMotor, 0]);
	
	const dictionary: MachineRecipe.BlockCutterRecipeDictionary = MachineRecipeRegistry.getDictionary("cuttingMachine");
	// -- Iron blade or higher --
	// Logs
	dictionary.addRecipe({id: VanillaBlockID.log, data: 0}, {id: VanillaBlockID.planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.log, data: 1}, {id: VanillaBlockID.planks, count: 6, data: 1}, 1);
	dictionary.addRecipe({id: VanillaBlockID.log, data: 2}, {id: VanillaBlockID.planks, count: 6, data: 2}, 1);
	dictionary.addRecipe({id: VanillaBlockID.log, data: 3}, {id: VanillaBlockID.planks, count: 6, data: 3}, 1);
	dictionary.addRecipe({id: VanillaBlockID.log2, data: 0}, {id: VanillaBlockID.planks, count: 6, data: 4}, 1);
	dictionary.addRecipe({id: VanillaBlockID.log2, data: 1}, {id: VanillaBlockID.planks, count: 6, data: 5}, 1);
	dictionary.addRecipe({id: VanillaBlockID.crimson_stem}, {id: VanillaBlockID.crimson_planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.warped_stem}, {id: VanillaBlockID.warped_planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_oak_log}, {id: VanillaBlockID.planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_spruce_log}, {id: VanillaBlockID.planks, count: 6, data: 1}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_birch_log}, {id: VanillaBlockID.planks, count: 6, data: 2}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_jungle_log}, {id: VanillaBlockID.planks, count: 6, data: 3}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_acacia_log}, {id: VanillaBlockID.planks, count: 6, data: 4}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_dark_oak_log}, {id: VanillaBlockID.planks, count: 6, data: 5}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_crimson_stem}, {id: VanillaBlockID.crimson_planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_warped_stem}, {id: VanillaBlockID.warped_planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: BlockID.rubberTreeLog}, {id: VanillaBlockID.planks, count: 6, data: 3}, 1);
	// Wood
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 0}, {id: VanillaBlockID.planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 1}, {id: VanillaBlockID.planks, count: 6, data: 1}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 2}, {id: VanillaBlockID.planks, count: 6, data: 2}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 3}, {id: VanillaBlockID.planks, count: 6, data: 3}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 4}, {id: VanillaBlockID.planks, count: 6, data: 4}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 5}, {id: VanillaBlockID.planks, count: 6, data: 5}, 1);
	// Stripped wood
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 8}, {id: VanillaBlockID.planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 9}, {id: VanillaBlockID.planks, count: 6, data: 1}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 10}, {id: VanillaBlockID.planks, count: 6, data: 2}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 11}, {id: VanillaBlockID.planks, count: 6, data: 3}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 12}, {id: VanillaBlockID.planks, count: 6, data: 4}, 1);
	dictionary.addRecipe({id: VanillaBlockID.wood, data: 13}, {id: VanillaBlockID.planks, count: 6, data: 5}, 1);
	// Other wood
	dictionary.addRecipe({id: VanillaBlockID.crimson_hyphae}, {id: VanillaBlockID.crimson_planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.warped_hyphae}, {id: VanillaBlockID.warped_planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_crimson_hyphae}, {id: VanillaBlockID.crimson_planks, count: 6, data: 0}, 1);
	dictionary.addRecipe({id: VanillaBlockID.stripped_warped_hyphae}, {id: VanillaBlockID.warped_planks, count: 6, data: 0}, 1);
	// Planks
	dictionary.addRecipe({id: VanillaBlockID.planks, count: 2}, {id: VanillaItemID.stick, count: 6 }, 1);
	dictionary.addRecipe({id: VanillaBlockID.crimson_planks, count: 2}, {id: VanillaItemID.stick, count: 6 }, 1);
	dictionary.addRecipe({id: VanillaBlockID.warped_planks, count: 2}, {id: VanillaItemID.stick, count: 6 }, 1);
	// Resource blocks
	dictionary.addRecipe({id: BlockID.blockCopper}, {id: ItemID.plateCopper, count: 9}, 2);
	dictionary.addRecipe({id: BlockID.blockTin}, {id: ItemID.plateTin, count: 9}, 2);
	dictionary.addRecipe({id: BlockID.blockBronze}, {id: ItemID.plateBronze, count: 9}, 2);
	dictionary.addRecipe({id: BlockID.blockLead}, {id: ItemID.plateLead, count: 9}, 2);
	dictionary.addRecipe({id: VanillaBlockID.gold_block}, {id: ItemID.plateGold, count: 9}, 2);
	dictionary.addRecipe({id: VanillaBlockID.lapis_block}, {id: ItemID.plateLapis, count: 9}, 2);
	// -- Steel blade or higher --
	dictionary.addRecipe({id: VanillaBlockID.iron_block}, {id: ItemID.plateIron, count: 9}, 3);
	// -- Diamond blade --
	dictionary.addRecipe({id: BlockID.blockSteel}, {id: ItemID.plateSteel, count: 9}, 4);
});

namespace Machine {
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
		defaultEnergyDemand = 12;
		defaultEnergyStorage = 10000;
		defaultProcessTime = 450;
		speedModifier = 1;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiBlockCutter;
		}

		getRecipeDictionary(): MachineRecipe.BlockCutterRecipeDictionary {
			return MachineRecipeRegistry.getDictionary("cuttingMachine");
		}

		isValidSource(id: number, data: number): boolean {
			return this.getRecipeDictionary().getRecipe(id, data) != null;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name.startsWith("slotSource")) return this.isValidSource(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				if (name == "slotBlade") return this.getBladeLevel(id) > 0;
				return false;
			});
		}

		getBladeLevel(bladeId: number): number {
			switch (bladeId) {
				case ItemID.cuttingBladeIron:
					return 2;
				case ItemID.cuttingBladeSteel:
					return 3;
				case ItemID.cuttingBladeDiamond:
					return 4;
				default:
					return 0;
			}
		}

		onTick() {
			const bladeSlot = this.container.getSlot("slotBlade");
			this.container.sendEvent("showWarning", { show: bladeSlot.id == 0 });

			super.onTick();
		}

		performRecipe(): boolean {
			const sourceSlot = this.container.getSlot("slotSource");
			const dictionary = this.getRecipeDictionary();
			const recipe = dictionary.getRecipe(sourceSlot.id, sourceSlot.data);

			const bladeSlot = this.container.getSlot("slotBlade");
			const bladeLevel = this.getBladeLevel(bladeSlot.id);

			if (recipe && sourceSlot.count >= recipe.source.count && bladeLevel >= recipe.hardnessLevel) {
				const resultSlot = this.container.getSlot("slotResult");
				if (this.data.energy >= this.energyDemand  && this.canStackBeMerged(recipe.result as ItemInstance, resultSlot, 64)) {
					this.data.energy -= this.energyDemand;
					// apply 50% speed increase for each hardness level exceeding required
					const processTime = this.defaultProcessTime / (1 + (bladeLevel - recipe.hardnessLevel) * 0.5);
					this.updateProgress(processTime);
					if (this.isCompletedProgress()) {
						this.decreaseSlot(sourceSlot, recipe.source.count);
						resultSlot.setSlot(recipe.result.id, resultSlot.count + recipe.result.count, recipe.result.data || 0);
						this.data.progress = 0;
					}
					return true;
				}
				if (this.data.progress > 0 && this.networkData.getBoolean(NetworkDataKeys.isActive)) {
					this.onInterrupt(); // interrupt if machine stopped working while processing item
				}
			}
			else if (this.data.progress > 0) {
				this.data.progress = 0;
				this.onInterrupt(); // interrupt when the source item is extracted
			}

			return false;
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

	MachineRecipeRegistry.registerDictionary("cuttingMachine", new MachineRecipe.BlockCutterRecipeDictionary());

	StorageInterface.createInterface(BlockID.blockCuttingMachine, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance, side: number, tileEntity: BlockCutter) => {
			return tileEntity.isValidSource(item.id, item.data);
		}
	});
}


