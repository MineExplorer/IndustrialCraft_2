BlockRegistry.createBlock("canner", [
	{name: "Fluid/Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.canner, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.canner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.canner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 1], ["canner_side", 1], ["canner_side", 0]]);
TileRenderer.setRotationFunction(BlockID.canner);

ItemName.addTierTooltip("canner", 1);
ItemName.addConsumptionTooltip("canner", "EU", 4);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.canner, count: 1, data: 0}, [
		"c#c",
		"cxc",
	], ['#', BlockID.solidCanner, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.cellEmpty, 0]);

	MachineRecipeRegistry.registerRecipesFor("fluidCanner", [
		{input: ["water", {id: ItemID.bioChaff, count: 1}], output: "biomass"},
		{input: ["water", {id: ItemID.dustLapis, count: 1}], output: "coolant"}
	]);
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

	export class Canner extends ProcessingMachine {
		inputTank: BlockEngine.LiquidTank;
		outputTank: BlockEngine.LiquidTank;

		defaultValues = {
			energy: 0,
			progress: 0,
			mode: 0
		};

		defaultEnergyStorage = 1600;
		defaultEnergyDemand = 4;
		defaultProcessTime = 200;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector", "fluidPulling"];

		getScreenByName(): UI.IWindow {
			return guiCanner;
		}

		isValidSourceItem(id: number, data: number): boolean {
			if (this.data.mode == 0 && MachineRecipeRegistry.hasRecipeFor("solidCanner", id)) {
				return true;
			}
			if (this.data.mode == 3) {
				const recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
				for (let i in recipes) {
					if (recipes[i].input[1].id == id) return true;
				}
			}
			return false;
		}

		isValidCan(id: number, data: number, extra: ItemExtraData): boolean {
			switch (this.data.mode) {
			case 0: {
				const recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
				for (let i in recipes) {
					if (recipes[i].can == id) return true;
				}
				return false;
			}
			case 1:
			case 3:
				return !!LiquidItemRegistry.getItemLiquid(id, data, extra);
			case 2:
				return LiquidItemRegistry.canBeFilledWithLiquid(id, data, extra, this.inputTank.getLiquidStored() || "water");
			}
		}

		setupContainer(): void {
			this.inputTank = this.addLiquidTank("inputTank", 8000);
			this.outputTank = this.addLiquidTank("outputTank", 8000);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data, extra) => {
				if (name == "slotSource") return this.isValidSourceItem(id, data);
				if (name == "slotCan") return this.isValidCan(id, data, extra);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		onTick(): void {
			this.container.sendEvent("updateUI", {mode: this.data.mode});
			this.useUpgrades();
			StorageInterface.checkHoppers(this);

			let sourceSlot = this.container.getSlot("slotSource");
			let resultSlot = this.container.getSlot("slotResult");
			let canSlot = this.container.getSlot("slotCan");

			let newActive = false;
			switch (this.data.mode) {
			case 0:
				let recipe = MachineRecipeRegistry.getRecipeResult("solidCanner", sourceSlot.id);
				if (recipe) {
					let result = recipe.result;
					if (canSlot.id == recipe.can && canSlot.count >= result.count && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0)) {
						if (this.data.energy >= this.energyDemand) {
							this.data.energy -= this.energyDemand;
							this.updateProgress();
							newActive = true;
						}
						if (this.isCompletedProgress()) {
							this.decreaseSlot(sourceSlot, 1);
							this.decreaseSlot(canSlot, result.count);
							resultSlot.setSlot(result.id, resultSlot.count + result.count, result.data);
							this.data.progress = 0;
						}
					}
				}
				else {
					this.data.progress = 0;
				}
			break;
			case 1:
				let liquid = this.outputTank.getLiquidStored();
				const emptyStack = LiquidItemRegistry.getEmptyStack(canSlot);
				if (emptyStack && (!liquid || emptyStack.liquid == liquid) && !this.outputTank.isFull()) {
					if (this.data.energy >= this.energyDemand && this.canStackBeMerged(emptyStack, resultSlot)) {
						this.data.energy -= this.energyDemand;
						this.updateProgress();
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
			break;
			case 2:
				let resetProgress = true;
				liquid = this.inputTank.getLiquidStored();
				if (liquid) {
					const fullStack = LiquidItemRegistry.getFullStack(canSlot, liquid);
					if (fullStack) {
						resetProgress = false;
						if (this.data.energy >= this.energyDemand && this.canStackBeMerged(fullStack, resultSlot)) {
							this.data.energy -= this.energyDemand;
							this.updateProgress();
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
			break;
			case 3:
				let recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
				resetProgress = true;
				for (let i in recipes) {
					let recipe = recipes[i];
					let liquid = recipe.input[0];
					let source = recipe.input[1];
					if (this.inputTank.getAmount(liquid) >= 1000 && sourceSlot.id == source.id && sourceSlot.count >= source.count) {
						resetProgress = false;
						let outputLiquid = this.outputTank.getLiquidStored()
						if ((!outputLiquid || recipe.output == outputLiquid && this.outputTank.getAmount() <= 7000) && this.data.energy >= this.energyDemand) {
							this.data.energy -= this.energyDemand;
							this.updateProgress();
							newActive = true;
						}
						if (this.isCompletedProgress()) {
							this.inputTank.getLiquid(1000);
							this.decreaseSlot(sourceSlot, source.count);
							this.outputTank.addLiquid(recipe.output, 1000);
							this.data.progress = 0;
						}
						break;
					}
				}
				if (resetProgress) {
					this.data.progress = 0;
				}
			break;
			}
			this.setActive(newActive);

			this.dischargeSlot("slotEnergy");

			this.inputTank.updateUiScale("liquidInputScale");
			this.outputTank.updateUiScale("liquidOutputScale");
			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
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
				this.container.sendEvent("updateUI", {mode: this.data.mode});
			}
		}

		@ContainerEvent(Side.Server, "switchTanks")
		onSwitchTanks(): void {
			if (this.data.progress == 0) {
				let liquidData = this.inputTank.data;
				this.inputTank.data = this.outputTank.data;
				this.outputTank.data = liquidData;
			}
		}

		/** @deprecated Container event, shouldn't be called */
		@ContainerEvent(Side.Client)
		updateUI(container: ItemContainer, window: any, content: any, data: {mode: number}): void {
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

	MachineRegistry.createFluidStorageInterface(BlockID.canner, {
		slots: {
			"slotSource": {input: true,
				isValid: (item: ItemInstance, side: number, tileEntity: Canner) => {
					return tileEntity.isValidSourceItem(item.id, item.data);
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