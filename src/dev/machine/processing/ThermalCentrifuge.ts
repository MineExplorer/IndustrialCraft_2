/// <reference path="./BasicProcessingMachine.ts" />

BlockRegistry.createBlock("thermalCentrifuge", [
	{name: "Thermal Centrifuge", texture: [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_back", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.thermalCentrifuge, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.thermalCentrifuge, 2, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.thermalCentrifuge, 2, [["machine_advanced", 0], ["thermal_centrifuge_top_active", 0], ["machine_side", 0], ["thermal_centrifuge_front_active", 0], ["thermal_centrifuge_side_active", 0], ["thermal_centrifuge_side_active", 0]]);
TileRenderer.setRotationFunction(BlockID.thermalCentrifuge);

ItemName.addTierTooltip("thermalCentrifuge", 2);
ItemName.addConsumptionTooltip("thermalCentrifuge", "EU", 48);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.thermalCentrifuge, count: 1, data: 0}, [
		"cmc",
		"a#a",
		"axa"
	], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.electricMotor, 0, 'a', 265, 0, 'm', ItemID.miningLaser, -1, 'c', ItemID.coil, 0]);

	const dictionary: MachineRecipe.ThermalCentrifugeRecipeDictionary = MachineRecipeRegistry.getDictionary("thermalCentrifuge");
	dictionary.addRecipe({id: VanillaBlockID.cobblestone}, [{id: ItemID.dustStone, count: 1}], 100);
	dictionary.addRecipe({id: ItemID.crushedCopper}, [{id: ItemID.dustSmallTin, count: 1}, {id: ItemID.dustCopper, count: 1}, {id: ItemID.dustStone, count: 1}], 500);
	dictionary.addRecipe({id: ItemID.crushedTin}, [{id: ItemID.dustSmallIron, count: 1}, {id: ItemID.dustTin, count: 1}, {id: ItemID.dustStone, count: 1}], 1000);
	dictionary.addRecipe({id: ItemID.crushedIron}, [{id: ItemID.dustSmallGold, count: 1}, {id: ItemID.dustIron, count: 1}, {id: ItemID.dustStone, count: 1}], 1500);
	dictionary.addRecipe({id: ItemID.crushedSilver}, [{id: ItemID.dustSmallLead, count: 1}, {id: ItemID.dustSilver, count: 1}, {id: ItemID.dustStone, count: 1}], 2000);
	dictionary.addRecipe({id: ItemID.crushedGold}, [{id: ItemID.dustSmallSilver, count: 1}, {id: ItemID.dustGold, count: 1}, {id: ItemID.dustStone, count: 1}], 2000);
	dictionary.addRecipe({id: ItemID.crushedLead}, [{id: ItemID.dustSmallSilver, count: 1}, {id: ItemID.dustLead, count: 1}, {id: ItemID.dustStone, count: 1}], 2000);
	dictionary.addRecipe({id: ItemID.crushedUranium}, [{id: ItemID.smallUranium235, count: 1}, {id: ItemID.uranium238, count: 4}, {id: ItemID.dustStone, count: 1}], 3000);
	dictionary.addRecipe({id: ItemID.crushedPurifiedCopper}, [{id: ItemID.dustSmallTin, count: 1}, {id: ItemID.dustCopper, count: 1}], 500);
	dictionary.addRecipe({id: ItemID.crushedPurifiedTin}, [{id: ItemID.dustSmallIron, count: 1}, {id: ItemID.dustTin, count: 1}], 1000);
	dictionary.addRecipe({id: ItemID.crushedPurifiedIron}, [{id: ItemID.dustSmallGold, count: 1}, {id: ItemID.dustIron, count: 1}], 1500);
	dictionary.addRecipe({id: ItemID.crushedPurifiedSilver}, [{id: ItemID.dustSmallLead, count: 1}, {id: ItemID.dustSilver, count: 1}], 2000);
	dictionary.addRecipe({id: ItemID.crushedPurifiedGold}, [{id: ItemID.dustSmallSilver, count: 1}, {id: ItemID.dustGold, count: 1}], 2000);
	dictionary.addRecipe({id: ItemID.crushedPurifiedLead}, [{id: ItemID.dustSmallSilver, count: 1}, {id: ItemID.dustLead, count: 1}], 2000);
	dictionary.addRecipe({id: ItemID.crushedPurifiedUranium}, [{id: ItemID.smallUranium235, count: 2}, {id: ItemID.uranium238, count: 5}], 3000);
	dictionary.addRecipe({id: ItemID.slag}, [{id: ItemID.dustSmallGold, count: 1}, {id: ItemID.dustCoal, count: 1}], 1500);
	dictionary.addRecipe({id: ItemID.fuelRodDepletedUranium}, [{id: ItemID.smallPlutonium, count: 1}, {id: ItemID.uranium238, count: 4}, {id: ItemID.dustIron, count: 1}], 4000);
	dictionary.addRecipe({id: ItemID.fuelRodDepletedUranium2}, [{id: ItemID.smallPlutonium, count: 2}, {id: ItemID.uranium238, count: 8}, {id: ItemID.dustIron, count: 3}], 4000);
	dictionary.addRecipe({id: ItemID.fuelRodDepletedUranium4}, [{id: ItemID.smallPlutonium, count: 4}, {id: ItemID.uranium238, count: 16}, {id: ItemID.dustIron, count: 6}], 4000);
	dictionary.addRecipe({id: ItemID.fuelRodDepletedMOX}, [{id: ItemID.smallPlutonium, count: 1}, {id: ItemID.plutonium, count: 3}, {id: ItemID.dustIron, count: 1}], 5000);
	dictionary.addRecipe({id: ItemID.fuelRodDepletedMOX2}, [{id: ItemID.smallPlutonium, count: 2}, {id: ItemID.plutonium, count: 6}, {id: ItemID.dustIron, count: 3}], 5000);
	dictionary.addRecipe({id: ItemID.fuelRodDepletedMOX4}, [{id: ItemID.smallPlutonium, count: 4}, {id: ItemID.plutonium, count: 12}, {id: ItemID.dustIron, count: 6}], 5000);
	dictionary.addRecipe({id: ItemID.rtgPellet}, [{id: ItemID.plutonium, count: 3}, {id: ItemID.dustIron, count: 54}], 5000);
	dictionary.addRecipe({id: ItemID.dustClay, count: 4}, [{id: ItemID.dustSiliconDioxide, count: 1}], 250);
});

namespace Machine {
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

	export class ThermalCentrifuge extends BasicProcessingMachine {
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

		heatingEnergyDemand = 2;
		isHeating: boolean = false;
		isPowered: boolean;

		getScreenByName(): UI.IWindow {
			return guiCentrifuge;
		}

		getRecipeDictionary(): MachineRecipe.ThermalCentrifugeRecipeDictionary {
			return MachineRecipeRegistry.getDictionary("thermalCentrifuge");
		}

		getOutputSlots(): string[] {
			return ["slotResult1", "slotResult2", "slotResult3"];
		}

		useUpgrades(isInit: boolean): UpgradeAPI.UpgradeSet {
			const upgrades = super.useUpgrades(isInit);
			this.isHeating = upgrades.getRedstoneInput(this.isPowered);
			return upgrades;
		}

		onTick(): void {
			this.useUpgrades(false);
			StorageInterface.checkHoppers(this);

			if (this.isHeating) {
				this.data.maxHeat = 5000;
			}

			const isActive = this.performRecipe();
			if (!isActive) {
				this.data.progress = 0;
				this.data.maxHeat = 5000;
				if (this.isHeating && this.data.energy >= this.heatingEnergyDemand) {
					if (this.data.heat < 5000) {
						this.data.heat++;
					}
					this.data.energy -= this.heatingEnergyDemand;
				}
				else if (this.data.heat > 0) {
					this.data.heat--;
				}
			}
			this.setActive(isActive);

			this.dischargeSlot("slotEnergy");

			this.container.sendEvent("setIndicator", this.data.heat >= this.data.maxHeat ? "green" : "red");
			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		performRecipe(): boolean {
			const sourceSlot = this.container.getSlot("slotSource");
			const dictionary = this.getRecipeDictionary();
			const recipe = dictionary.getRecipe(sourceSlot.id, sourceSlot.data);
			if (!recipe) return false;

			this.data.maxHeat = recipe.heat;

			if (this.data.energy >= this.heatingEnergyDemand && this.canPutResult(recipe.result)) {
				if (this.data.heat < recipe.heat) {
					this.data.energy -= this.heatingEnergyDemand;
					this.data.heat++;
					return true;
				}
				if (this.data.energy >= this.energyDemand) {
					this.data.energy -= this.energyDemand;
					this.updateProgress(recipe.processTime);
					if (this.isCompletedProgress()) {
						this.decreaseSlot(sourceSlot, 1);
						this.putResult(recipe.result);
						this.data.progress = 0;
					}
					return true;
				}
			}

			return false;
		}

		onRedstoneUpdate(signal: number): void {
			this.isPowered = signal > 0;
		}

		@ContainerEvent(Side.Client, "setIndicator")
		onSetIndicator(container: ItemContainer, window: any, content: any, data: string): void {
			if (content) {
				content.elements["indicator"].bitmap = "indicator_" + data;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.thermalCentrifuge, new ThermalCentrifuge());
	
	MachineRecipeRegistry.registerDictionary("thermalCentrifuge", new MachineRecipe.ThermalCentrifugeRecipeDictionary());

	StorageInterface.createInterface(BlockID.thermalCentrifuge, {
		slots: {
			"slotSource": {input: true},
			"slotResult1": {output: true},
			"slotResult2": {output: true},
			"slotResult3": {output: true}
		},
		isValidInput: (item: ItemInstance, side: number, tileEntity: ThermalCentrifuge) => {
			return tileEntity.isValidSource(item.id, item.data);
		}
	});
}

