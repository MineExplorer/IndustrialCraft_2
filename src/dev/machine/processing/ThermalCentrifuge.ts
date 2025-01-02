BlockRegistry.createBlock("thermalCentrifuge", [
	{name: "Thermal Centrifuge", texture: [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_back", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.thermalCentrifuge, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.thermalCentrifuge, 2, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.thermalCentrifuge, 2, [["machine_advanced", 0], ["thermal_centrifuge_top_active", 0], ["machine_side", 0], ["thermal_centrifuge_front_active", 0], ["thermal_centrifuge_side_active", 0], ["thermal_centrifuge_side_active", 0]]);
TileRenderer.setRotationFunction(BlockID.thermalCentrifuge);

ItemName.addTierTooltip("thermalCentrifuge", 2);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.thermalCentrifuge, count: 1, data: 0}, [
		"cmc",
		"a#a",
		"axa"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.electricMotor, 0, 'a', 265, 0, 'm', ItemID.miningLaser, -1, 'c', ItemID.coil, 0]);

	MachineRecipeRegistry.registerRecipesFor("thermalCentrifuge", {
		//"minecraft:cobblestone": {result: [ItemID.dustStone, 1], heat: 100},
		"ItemID.crushedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1, ItemID.dustStone, 1], heat: 500},
		"ItemID.crushedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1, ItemID.dustStone, 1], heat: 1000},
		"ItemID.crushedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1, ItemID.dustStone, 1], heat: 1500},
		"ItemID.crushedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedLead": {result: [ItemID.dustSmallSilver, 1, ItemID.dustLead, 1, ItemID.dustStone, 1], heat: 2000},
		"ItemID.crushedUranium": {result: [ItemID.smallUranium235, 1, ItemID.uranium238, 4, ItemID.dustStone, 1], heat: 3000},
		"ItemID.crushedPurifiedCopper": {result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1], heat: 500},
		"ItemID.crushedPurifiedTin": {result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1], heat: 1000},
		"ItemID.crushedPurifiedIron": {result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1], heat: 1500},
		"ItemID.crushedPurifiedSilver": {result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1], heat: 2000},
		"ItemID.crushedPurifiedGold": {result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1], heat: 2000},
		"ItemID.crushedPurifiedLead": {result: [ItemID.dustSmallSilver, 1, ItemID.dustLead, 1], heat: 2000},
		"ItemID.crushedPurifiedUranium": {result: [ItemID.smallUranium235, 2, ItemID.uranium238, 5], heat: 3000},
		"ItemID.slag": {result: [ItemID.dustSmallGold, 1, ItemID.dustCoal, 1], heat: 1500},
		"ItemID.fuelRodDepletedUranium": {result: [ItemID.smallPlutonium, 1, ItemID.uranium238, 4, ItemID.dustIron, 1], heat: 4000},
		"ItemID.fuelRodDepletedUranium2": {result: [ItemID.smallPlutonium, 2, ItemID.uranium238, 8, ItemID.dustIron, 3], heat: 4000},
		"ItemID.fuelRodDepletedUranium4": {result: [ItemID.smallPlutonium, 4, ItemID.uranium238, 16, ItemID.dustIron, 6], heat: 4000},
		"ItemID.fuelRodDepletedMOX": {result: [ItemID.smallPlutonium, 1, ItemID.plutonium, 3, ItemID.dustIron, 1], heat: 5000},
		"ItemID.fuelRodDepletedMOX2": {result: [ItemID.smallPlutonium, 2, ItemID.plutonium, 6, ItemID.dustIron, 3], heat: 5000},
		"ItemID.fuelRodDepletedMOX4": {result: [ItemID.smallPlutonium, 4, ItemID.plutonium, 12, ItemID.dustIron, 6], heat: 5000},
		"ItemID.rtgPellet": {result: [ItemID.plutonium, 3, ItemID.dustIron, 54], heat: 5000},
	}, true);
});

const guiCentrifuge = MachineRegistry.createInventoryWindow("Thermal Centrifuge", {
	drawing: [
		{type: "bitmap", x: 400 + 36*GUI_SCALE_NEW, y: 50 + 15*GUI_SCALE_NEW, bitmap: "thermal_centrifuge_background", scale: GUI_SCALE_NEW},
		{type: "bitmap", x: 400 + 8*GUI_SCALE_NEW, y: 50 + 38*GUI_SCALE_NEW, bitmap: "energy_small_background", scale: GUI_SCALE_NEW}
	],

	elements: {
		"progressScale": {type: "scale", x: 400 + 80*GUI_SCALE_NEW, y: 50 + 22*GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "thermal_centrifuge_scale", scale: GUI_SCALE_NEW, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("icpe_thermalCentrifuge");
			}
		}},
		"heatScale": {type: "scale", x: 400 + 64*GUI_SCALE_NEW, y: 50 + 63*GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE_NEW},
		"energyScale": {type: "scale", x: 400 + 8*GUI_SCALE_NEW, y: 50 + 38*GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW},
		"slotEnergy": {type: "slot", x: 400 + 6*GUI_SCALE_NEW, y: 50 + 56*GUI_SCALE_NEW, size: 54},
		"slotSource": {type: "slot", x: 400 + 6*GUI_SCALE_NEW, y: 50 + 16*GUI_SCALE_NEW, size: 54},
		"slotResult1": {type: "slot", x: 400 + 119*GUI_SCALE_NEW, y: 50 + 13*GUI_SCALE_NEW, size: 54},
		"slotResult2": {type: "slot", x: 400 + 119*GUI_SCALE_NEW, y: 50 + 31*GUI_SCALE_NEW, size: 54},
		"slotResult3": {type: "slot", x: 400 + 119*GUI_SCALE_NEW, y: 50 + 49*GUI_SCALE_NEW, size: 54},
		"slotUpgrade1": {type: "slot", x: 860, y: 50 + 3*GUI_SCALE_NEW, size: 54},
		"slotUpgrade2": {type: "slot", x: 860, y: 50 + 21*GUI_SCALE_NEW, size: 54},
		"slotUpgrade3": {type: "slot", x: 860, y: 50 + 39*GUI_SCALE_NEW, size: 54},
		"slotUpgrade4": {type: "slot", x: 860, y: 50 + 57*GUI_SCALE_NEW, size: 54},
		"indicator": {type: "image", x: 400 + 88*GUI_SCALE_NEW, y: 50 + 59*GUI_SCALE_NEW, bitmap: "indicator_red", scale: GUI_SCALE_NEW}
	}
});

namespace Machine {
	export class ThermalCentrifuge extends ProcessingMachine {
		defaultValues = {
			energy: 0,
			progress: 0,
			heat: 0,
			maxHeat: 5000
		}

		defaultTier = 2;
		defaultEnergyStorage = 30000;
		defaultEnergyDemand = 48;
		defaultProcessTime = 500;
		defaultDrop = BlockID.machineBlockAdvanced;
		upgrades = ["overclocker", "transformer", "energyStorage", "redstone", "itemEjector", "itemPulling"];

		isHeating: boolean = false;
		isPowered: boolean;

		getScreenByName(): UI.IWindow {
			return guiCentrifuge;
		}

		useUpgrades(): UpgradeAPI.UpgradeSet {
			const upgrades = super.useUpgrades();
			this.isHeating = upgrades.getRedstoneInput(this.isPowered);
			return upgrades;
		}

		getRecipeResult(id: number): {result: number[], heat: number} {
			return MachineRecipeRegistry.getRecipeResult("thermalCentrifuge", id);
		}

		checkResult(result: number[]): boolean {
			for (let i = 1; i < 4; i++) {
				const id = result[(i-1) * 2];
				const count = result[(i-1) * 2 + 1];
				const resultSlot = this.container.getSlot("slotResult" + i);
				if ((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0) {
					return false;
				}
			}
			return true;
		}

		putResult(result: number[]): void {
			for (let i = 1; i < 4; i++) {
				const id = result[(i-1) * 2];
				const count = result[(i-1) * 2 + 1];
				const resultSlot = this.container.getSlot("slotResult" + i);
				if (id) {
					resultSlot.setSlot(id, resultSlot.count + count, 0);
				}
			}
		}

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);

			if (this.isHeating) {
				this.data.maxHeat = 5000;
			}

			let newActive = false;
			const sourceSlot = this.container.getSlot("slotSource");
			const recipe = this.getRecipeResult(sourceSlot.id);
			if (recipe && this.checkResult(recipe.result) && this.data.energy > 0) {
				this.data.maxHeat = recipe.heat;
				if (this.data.heat < recipe.heat) {
					this.data.energy--;
					this.data.heat++;
				}
				else if (this.data.energy >= this.energyDemand) {
					this.data.energy -= this.energyDemand;
					this.data.progress += 1 / this.processTime;
					newActive = true;
				}
				if (+this.data.progress.toFixed(3) >= 1) {
					this.decreaseSlot(sourceSlot, 1);
					this.putResult(recipe.result);
					this.data.progress = 0;
				}
			}
			else {
				this.data.maxHeat = 5000;
				this.data.progress = 0;
				if (this.isHeating && this.data.energy > 1) {
					if (this.data.heat < 5000) {this.data.heat++;}
					this.data.energy -= 2;
				}
				else if (this.data.heat > 0) {
					this.data.heat--;
				}
			}
			this.setActive(newActive);

			this.dischargeSlot("slotEnergy");

			if (this.data.heat >= this.data.maxHeat) {
				this.container.sendEvent("setIndicator", "green");
			} else {
				this.container.sendEvent("setIndicator", "red");
			}
			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		onRedstoneUpdate(signal: number): void {
			this.isPowered = signal > 0;
		}

		/** @deprecated Container event, shouldn't be called */
		@ContainerEvent(Side.Client)
		setIndicator(container: ItemContainer, window: any, content: any, data: string): void {
			if (content) {
				content.elements["indicator"].bitmap = "indicator_" + data;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.thermalCentrifuge, new ThermalCentrifuge());

	StorageInterface.createInterface(BlockID.thermalCentrifuge, {
		slots: {
			"slotSource": {input: true},
			"slotResult1": {output: true},
			"slotResult2": {output: true},
			"slotResult3": {output: true}
		},
		isValidInput: (item: ItemInstance) => {
			return MachineRecipeRegistry.hasRecipeFor("thermalCentrifuge", item.id);
		}
	});
}