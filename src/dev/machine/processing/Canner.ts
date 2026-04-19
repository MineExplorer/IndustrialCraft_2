/// <reference path="./ProcessingMachine.ts" />

BlockRegistry.createBlock("canner", [
	{name: "Fluid/Solid Canning Machine", texture: [["ic_machine_bottom", 0], ["ic_machine_bottom", 0], ["ic_machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.canner, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.canner, 2, [["ic_machine_bottom", 0], ["ic_machine_top", 0], ["ic_machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.canner, 2, [["ic_machine_bottom", 0], ["ic_machine_top", 0], ["ic_machine_side", 0], ["canner_front_on", 0], ["canner_left_on", 0], ["canner_side", 0]]);
TileRenderer.setRotationFunction(BlockID.canner);

ItemName.addTierTooltip("canner", 1);
ItemName.addConsumptionTooltip("canner", "EU", 4);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.canner, count: 1, data: 0}, [
		"c#c",
		"cxc",
	], ['#', BlockID.solidCanner, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.cellEmpty, 0]);

	const dictionary: MachineRecipe.FluidEnrichRecipeDictionary = MachineRecipeRegistry.getDictionary("fluidCanner");
	dictionary.addRecipe({id: ItemID.bioChaff, count: 1}, {name: "water", amount: 1000}, {name: "biomass", amount: 1000});
	dictionary.addRecipe({id: ItemID.dustLapis, count: 1}, {name: "water", amount: 1000}, {name: "coolant", amount: 1000});
});

namespace Machine {
	const guiCanner = MachineRegistry.createInventoryWindow("Fluid/Solid Canning Machine", {
		drawing: [
			{type: "bitmap", x: 406, y: 50 + 58*GUI_SCALE_NEW, bitmap: "energy_small_background", scale: GUI_SCALE_NEW},
			{type: "bitmap", x: 400 + 67*GUI_SCALE_NEW, y: 50 + 18*GUI_SCALE_NEW, bitmap: "extractor_bar_background", scale: GUI_SCALE_NEW},
			{type: "bitmap", x: 496, y: 50 + 38*GUI_SCALE_NEW, bitmap: "liquid_bar", scale: GUI_SCALE_NEW},
			{type: "bitmap", x: 730, y: 50 + 38*GUI_SCALE_NEW, bitmap: "liquid_bar", scale: GUI_SCALE_NEW}
		],

		elements: {
			"background": {type: "image", x: 400 + 51*GUI_SCALE_NEW, y: 50 + 12*GUI_SCALE_NEW, bitmap: "canner_background_0", scale: GUI_SCALE_NEW},
			"liquidInputScale": {type: "scale", x: 496 + 4*GUI_SCALE_NEW, y: 50 + 42*GUI_SCALE_NEW, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW},
			"liquidOutputScale": {type: "scale", x: 730 + 4*GUI_SCALE_NEW, y: 50 + 42*GUI_SCALE_NEW, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW},
			"progressScale": {type: "scale", x: 400 + 67*GUI_SCALE_NEW, y: 50 + 18*GUI_SCALE_NEW, direction: 0, bitmap: "extractor_bar_scale", scale: GUI_SCALE_NEW, clicker: {
				onClick: () => {
					RV?.RecipeTypeRegistry.openRecipePage("icpe_canner");
				}
			}},
			"energyScale": {type: "scale", x: 406, y: 50 + 58*GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW},
			"slotEnergy": {type: "slot", x: 400, y: 50 + 75*GUI_SCALE_NEW, size: 54},
			"slotSource": {type: "slot", x: 400 + 72*GUI_SCALE_NEW, y: 50 + 39*GUI_SCALE_NEW, size: 54, visual: false, bitmap: "canner_slot_source_0"},
			"slotCan": {type: "slot", x: 400 + 33*GUI_SCALE_NEW, y: 50 + 12*GUI_SCALE_NEW, size: 54},
			"slotResult": {type: "slot", x: 400 + 111*GUI_SCALE_NEW, y: 50 + 12*GUI_SCALE_NEW, size: 54},
			"slotUpgrade1": {type: "slot", x: 850, y: 113, size: 54},
			"slotUpgrade2": {type: "slot", x: 850, y: 167, size: 54},
			"slotUpgrade3": {type: "slot", x: 850, y: 221, size: 54},
			"slotUpgrade4": {type: "slot", x: 850, y: 275, size: 54},
			"buttonSwitch": {type: "button", x: 400 + 70*GUI_SCALE_NEW, y: 50 + 60*GUI_SCALE_NEW, bitmap: "canner_switch_button", scale: GUI_SCALE_NEW, clicker: {
				onClick: function(_, container: ItemContainer) {
					container.sendEvent("switchTanks", {});
				}
			}},
			"buttonMode": {type: "button", x: 400 + 54*GUI_SCALE_NEW, y: 50 + 75*GUI_SCALE_NEW, bitmap: "canner_mode_0", scale: GUI_SCALE_NEW, clicker: {
				onClick: function(_, container: ItemContainer) {
					container.sendEvent("switchMode", {});
				}
			}}
		}
	});

	const enum CannerMode {
		SolidCanning,
		EmptyItem,
		FillItem,
		FluidCanning
	}

	export class Canner extends ProcessingMachine {
		inputTank: BlockEngine.LiquidTank;
		outputTank: BlockEngine.LiquidTank;

		defaultValues = {
			energy: 0,
			progress: 0,
			mode: CannerMode.SolidCanning
		};

		defaultEnergyStorage = 1600;
		defaultEnergyDemand = 4;
		defaultProcessTime = 200;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector", "fluidPulling"];

		getScreenByName(): UI.IWindow {
			return guiCanner;
		}

		getSolidRecipeDictionary(): SolidCannerRecipeDictionary {
			return MachineRecipeRegistry.getDictionary("solidCanner");
		}

		getFluidRecipeDictionary(): MachineRecipe.FluidEnrichRecipeDictionary {
			return MachineRecipeRegistry.getDictionary("fluidCanner");
		}

		isValidSource(id: number, data: number): boolean {
			if (this.data.mode == CannerMode.SolidCanning) {
				return !!this.getSolidRecipeDictionary().getRecipe(id, data);
			}
			if (this.data.mode == CannerMode.FluidCanning) {
				return !!this.getFluidRecipeDictionary().findRecipe(recipe => recipe.source.id == id && (recipe.source.data == -1 || recipe.source.data == data));
			}
			return false;
		}

		isValidCan(id: number, data: number, extra: ItemExtraData): boolean {
			switch (this.data.mode) {
				case CannerMode.SolidCanning: {
					const dictionary = this.getSolidRecipeDictionary();
					return !!dictionary.findRecipe(recipe => recipe.can == id);
				}
				case CannerMode.EmptyItem:
				case CannerMode.FluidCanning:
					return !!LiquidItemRegistry.getItemLiquid(id, data, extra);
				case CannerMode.FillItem:
					return LiquidItemRegistry.canBeFilledWithLiquid(id, data, extra, this.inputTank.getLiquidStored() || "water");
			}
		}

		setupContainer(): void {
			this.inputTank = this.addLiquidTank("inputTank", 8000);
			this.outputTank = this.addLiquidTank("outputTank", 8000);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data, extra) => {
				if (name == "slotSource") return this.isValidSource(id, data);
				if (name == "slotCan") return this.isValidCan(id, data, extra);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		onTick(): void {
			this.container.sendEvent("updateUiMode", {mode: this.data.mode});
			this.useUpgrades(false);
			StorageInterface.checkHoppers(this);

			const isActive = this.performRecipe();
			this.setActive(isActive);

			this.dischargeSlot("slotEnergy");

			this.inputTank.updateUiScale("liquidInputScale");
			this.outputTank.updateUiScale("liquidOutputScale");
			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		performRecipe(): boolean {
			const sourceSlot = this.container.getSlot("slotSource");
			const resultSlot = this.container.getSlot("slotResult");
			const canSlot = this.container.getSlot("slotCan");

			switch (this.data.mode) {
				case CannerMode.SolidCanning:
					return this.performSolidRecipe(sourceSlot, canSlot, resultSlot);
				case CannerMode.EmptyItem:
					return this.emptyLiquidItem(canSlot, resultSlot);
				case CannerMode.FillItem:
					return this.fillLiquidItem(canSlot, resultSlot);
				case CannerMode.FluidCanning:
					return this.performFluidRecipe(sourceSlot);
				default:
					return false;
			}
		}

		performSolidRecipe(sourceSlot: ItemContainerSlot, canSlot: ItemContainerSlot, resultSlot: ItemContainerSlot): boolean {
			const dictionary = this.getSolidRecipeDictionary();
			const recipe = dictionary.getRecipe(sourceSlot.id, sourceSlot.data);
			if (recipe && canSlot.id == recipe.can && canSlot.count >= recipe.result.count) {
				if (this.data.energy >= this.energyDemand && this.canStackBeMerged(recipe.result, resultSlot, 64)) {
					this.data.energy -= this.energyDemand;
					this.updateProgress();
					if (this.isCompletedProgress()) {
						this.decreaseSlot(sourceSlot, 1);
						this.decreaseSlot(canSlot, recipe.result.count);
						resultSlot.setSlot(recipe.result.id, resultSlot.count + recipe.result.count, recipe.result.data);
						this.data.progress = 0;
					}
					return true;
				}
			}
			else {
				this.data.progress = 0;
			}
			return false;
		}

		emptyLiquidItem(canSlot: ItemContainerSlot, resultSlot: ItemContainerSlot): boolean {
			let newActive = false;
			const liquid = this.outputTank.getLiquidStored();
			const emptyStack = LiquidItemRegistry.getEmptyStack(canSlot);
			if (emptyStack && (!liquid || emptyStack.liquid == liquid) && !this.outputTank.isFull()) {
				if (this.data.energy >= this.energyDemand && this.canStackBeMerged(emptyStack, resultSlot)) {
					this.data.energy -= this.energyDemand;
					this.updateProgress(this.defaultProcessTime / 5);
					newActive = true;
				}
				if (this.isCompletedProgress()) {
					this.outputTank.getLiquidFromItem(canSlot, resultSlot);
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
			return newActive;
		}

		fillLiquidItem(canSlot: ItemContainerSlot, resultSlot: ItemContainerSlot): boolean {
			let newActive = false;
			let resetProgress = true;
			const liquid = this.inputTank.getLiquidStored();
			if (liquid) {
				const fullStack = LiquidItemRegistry.getFullStack(canSlot, liquid);
				if (fullStack) {
					resetProgress = false;
					if (this.data.energy >= this.energyDemand && this.canStackBeMerged(fullStack, resultSlot)) {
						this.data.energy -= this.energyDemand;
						this.updateProgress(this.defaultProcessTime / 5);
						newActive = true;
					}
					if (this.isCompletedProgress()) {
						this.inputTank.addLiquidToItem(canSlot, resultSlot);
						this.data.progress = 0;
					}
				}
			}
			if (resetProgress) {
				this.data.progress = 0;
			}
			return newActive;
		}

		performFluidRecipe(sourceSlot: ItemContainerSlot): boolean {
			let newActive = false;
			let resetProgress = true;

			const inputLiquid = this.inputTank.getLiquidStored();
			if (sourceSlot.id != 0 && inputLiquid) {
				const dictionary = this.getFluidRecipeDictionary();
				const recipe = dictionary.getRecipe(inputLiquid, sourceSlot);
				if (recipe && sourceSlot.count >= recipe.source.count && this.inputTank.getAmount() >= recipe.inputFluid.amount) {
					const outputLiquid = this.outputTank.getLiquidStored()
					if ((!outputLiquid || recipe.outputFluid.name == outputLiquid) && this.outputTank.getLimit() - this.outputTank.getAmount() >= recipe.outputFluid.amount && this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						this.updateProgress();
						newActive = true;
						resetProgress = false;
					}
					if (this.isCompletedProgress()) {
						this.inputTank.getLiquid(1000);
						this.decreaseSlot(sourceSlot, recipe.source.count);
						this.outputTank.addLiquid(recipe.outputFluid.name, recipe.outputFluid.amount);
						this.data.progress = 0;
					}
				}
			}
			if (resetProgress) {
				this.data.progress = 0;
			}
			return newActive;
		}

		canRotate(side: number): boolean {
			return side > 1;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				if (MachineRegistry.emptyTankOnClick(this.outputTank, item, player) || 
				  MachineRegistry.fillTankOnClick(this.inputTank, item, player)) {
					this.preventClick();
					return true;
				}
			}
			return super.onItemUse(coords, item, player);
		}
		
		@ContainerEvent(Side.Server, "switchMode")
		onSwitchMode(): void {
			if (this.data.progress == 0) {
				this.data.mode = (this.data.mode + 1) % 4;
				this.container.sendEvent("updateUiMode", {mode: this.data.mode});
			}
		}

		@ContainerEvent(Side.Server, "switchTanks")
		onSwitchTanks(): void {
			if (this.data.progress == 0) {
				let liquidData = this.inputTank.data;
				this.inputTank.data = this.outputTank.data;
				this.outputTank.data = liquidData;
				this.data[this.inputTank.name] = this.inputTank.data;
				this.data[this.outputTank.name] = this.outputTank.data;
			}
		}

		@ContainerEvent(Side.Client, "updateUiMode")
		onUpdateUiMode(container: ItemContainer, window: any, content: any, data: {mode: number}): void {
			if (content) {
				let element = content.elements["slotSource"];
				let texture = "canner_slot_source_" + data.mode;
				if (element.bitmap != texture) {
					content.elements["buttonMode"].bitmap = "canner_mode_" + data.mode;
					content.elements["background"].bitmap = "canner_background_" + data.mode;
					element.bitmap = texture;
					element.visual = data.mode % 3 > 0;
				}
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.canner, new Canner());

	MachineRecipeRegistry.registerDictionary("fluidCanner", new MachineRecipe.FluidEnrichRecipeDictionary());

	MachineRegistry.createFluidStorageInterface(BlockID.canner, {
		slots: {
			"slotSource": {input: true,
				isValid: (item: ItemInstance, side: number, tileEntity: Canner) => {
					return tileEntity.isValidSource(item.id, item.data);
				}
			},
			"slotCan": {input: true,
				isValid: (item: ItemInstance, side: number, tileEntity: Canner) => {
					return tileEntity.isValidCan(item.id, item.data, item.extra);
				}
			},
			"slotResult": {output: true}
		},
		canReceiveLiquid: () => true,
		getInputTank: function() {
			return this.tileEntity.inputTank
		},
		getOutputTank: function() {
			return this.tileEntity.outputTank;
		}
	});
}
