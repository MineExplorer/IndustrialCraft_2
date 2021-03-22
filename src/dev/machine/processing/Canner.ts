IDRegistry.genBlockID("canner");
Block.createBlock("canner", [
	{name: "Fluid/Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.canner, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.canner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.canner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 1], ["canner_side", 1], ["canner_side", 0]]);
TileRenderer.setRotationFunction(BlockID.canner);

ItemName.addTierTooltip("canner", 1);

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


const guiCanner = InventoryWindow("Fluid/Solid Canning Machine", {
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
		"progressScale": {type: "scale", x: 400 + 67*GUI_SCALE_NEW, y: 50 + 18*GUI_SCALE_NEW, direction: 0, bitmap: "extractor_bar_scale", scale: GUI_SCALE_NEW},
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

namespace Machine {
	export class Canner extends ElectricMachine {
		inputTank: LiquidTank;
		outputTank: LiquidTank;

		defaultValues = {
			energy: 0,
			tier: 1,
			energy_storage: 1600,
			energy_consume: 1,
			work_time: 200,
			progress: 0,
			mode: 0
		};

		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector", "fluidPulling"];

		defaultDrop = BlockID.machineBlockBasic;

		getScreenByName() {
			return guiCanner;
		}

		getTier(): number {
			return this.data.tier;
		}

		resetValues(): void {
			this.data.tier = this.defaultValues.tier;
			this.data.energy_storage = this.defaultValues.energy_storage;
			this.data.energy_consume = this.defaultValues.energy_consume;
			this.data.work_time = this.defaultValues.work_time;
			if (this.data.mode%3 > 0) this.data.work_time /= 5;
		}

		isValidSourceItem(id: number, data: number): boolean {
			if (this.data.mode == 0 && MachineRecipeRegistry.hasRecipeFor("solidCanner", id)) {
				return true;
			}
			if (this.data.mode == 3) {
				let recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
				for (let i in recipes) {
					if (recipes[i].input[1].id == id) return true;
				}
			}
			return false;
		}

		isValidCan(id: number, data: number): boolean {
			switch (this.data.mode) {
			case 0: {
				let recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
				for (let i in recipes) {
					if (recipes[i].can == id) return true;
				}
				return false;
			}
			case 1:
			case 3:
				return !!LiquidItemRegistry.getEmptyItem(id, data);
			case 2:
				return !!LiquidRegistry.getFullItem(id, data, "water");
			}
		}

		setupContainer(): void {
			this.inputTank = new BlockEngine.LiquidTank(this, "input", 8);
			this.outputTank = new BlockEngine.LiquidTank(this, "output", 8);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotSource") return this.isValidSourceItem(id, data);
				if (name == "slotCan") return this.isValidCan(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		onTick(): void {
			this.container.sendEvent("updateUI", {mode: this.data.mode});
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);

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
						if (this.data.energy >= this.data.energy_consume) {
							this.data.energy -= this.data.energy_consume;
							this.data.progress += 1/this.data.work_time;
							newActive = true;
						}
						if (+this.data.progress.toFixed(3) >= 1) {
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
				let empty = LiquidItemRegistry.getEmptyItem(canSlot.id, canSlot.data);
				if (empty && (!liquid || empty.liquid == liquid) && this.outputTank.getAmount() <= 8 - empty.amount) {
					if (this.data.energy >= this.data.energy_consume && (resultSlot.id == empty.id && resultSlot.data == empty.data && resultSlot.count < Item.getMaxStack(empty.id) || resultSlot.id == 0)) {
						this.data.energy -= this.data.energy_consume;
						this.data.progress += 1/this.data.work_time;
						newActive = true;
					}
					if (+this.data.progress.toFixed(3) >= 1) {
						this.outputTank.addLiquid(empty.liquid, empty.amount);
						this.decreaseSlot(canSlot, 1);
						resultSlot.setSlot(empty.id, resultSlot.count + 1, empty.data);
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
					let full = LiquidItemRegistry.getFullItem(canSlot.id, canSlot.data, liquid);
					if (full && this.inputTank.getAmount() >= full.storage) {
						resetProgress = false;
						if (this.data.energy >= this.data.energy_consume && (resultSlot.id == full.id && resultSlot.data == full.data && resultSlot.count < Item.getMaxStack(full.id) || resultSlot.id == 0)) {
							this.data.energy -= this.data.energy_consume;
							this.data.progress += 1/this.data.work_time;
							newActive = true;
						}
						if (+this.data.progress.toFixed(3) >= 1) {
							this.inputTank.getLiquid(liquid, full.storage);
							this.decreaseSlot(canSlot, 1);
							resultSlot.setSlot(full.id, resultSlot.count + 1, full.data);
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
					if (this.inputTank.getAmount(liquid) >= 1 && sourceSlot.id == source.id && sourceSlot.count >= source.count) {
						resetProgress = false;
						let outputLiquid = this.outputTank.getLiquidStored()
						if ((!outputLiquid || recipe.output == outputLiquid && this.outputTank.getAmount() <= 7) && this.data.energy >= this.data.energy_consume) {
							this.data.energy -= this.data.energy_consume;
							this.data.progress += 1/this.data.work_time;
							newActive = true;
						}
						if (+this.data.progress.toFixed(3) >= 1) {
							this.inputTank.getLiquid(1);
							this.decreaseSlot(sourceSlot, source.count);
							this.outputTank.addLiquid(recipe.output, 1);
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

			const energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.dischargeSlot("slotEnergy");

			this.inputTank.updateUiScale("liquidInputScale");
			this.outputTank.updateUiScale("liquidOutputScale");
			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.sendChanges();
		}

		getEnergyStorage(): number {
			return this.data.energy_storage;
		}

		@ContainerEvent(Side.Server)
		switchMode(): void {
			if (this.data.progress == 0) {
				this.data.mode = (this.data.mode + 1) % 4;
				this.container.sendEvent("updateUI", {mode: this.data.mode});
			}
		}

		@ContainerEvent(Side.Server)
		switchTanks(): void {
			if (this.data.progress == 0) {
				let liquidData = this.inputTank.data;
				this.inputTank.data = this.outputTank.data;
				this.outputTank.data = liquidData;
			}
		}

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

	StorageInterface.createInterface(BlockID.canner, {
		slots: {
			"slotSource": {input: true,
				isValid: (item: ItemInstance, side: number, tileEntity: Machine.Canner) => {
					return tileEntity.isValidSourceItem(item.id, item.data);
				}
			},
			"slotCan": {input: true,
				isValid: (item: ItemInstance, side: number, tileEntity: Machine.Canner) => {
					return tileEntity.isValidCan(item.id, item.data);
				}
			},
			"slotResult": {output: true}
		},
		canReceiveLiquid: () => true,
		canTransportLiquid: () => true,
		getLiquidStorage: function(name: string) {
			if (name == "input") return this.tileEntity.inputTank;
			return this.tileEntity.outputTank;
		}
	});
}