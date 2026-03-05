/// <reference path="./MultiResultProcessingMachine.ts" />

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

	const thermalCentrifugeDictionary = new ProcessingRecipeDictionary<Machine.ThermalCentrifugeRecipe>(500);
	thermalCentrifugeDictionary.registerList([
		{ source: {id: VanillaBlockID.cobblestone}, result: [{id: ItemID.dustStone, count: 1}], heat: 100 },
		{ source: {id: ItemID.crushedCopper}, result: [{id: ItemID.dustSmallTin, count: 1}, {id: ItemID.dustCopper, count: 1}, {id: ItemID.dustStone, count: 1}], heat: 500 },
		{ source: {id: ItemID.crushedTin}, result: [{id: ItemID.dustSmallIron, count: 1}, {id: ItemID.dustTin, count: 1}, {id: ItemID.dustStone, count: 1}], heat: 1000 },
		{ source: {id: ItemID.crushedIron}, result: [{id: ItemID.dustSmallGold, count: 1}, {id: ItemID.dustIron, count: 1}, {id: ItemID.dustStone, count: 1}], heat: 1500 },
		{ source: {id: ItemID.crushedSilver}, result: [{id: ItemID.dustSmallLead, count: 1}, {id: ItemID.dustSilver, count: 1}, {id: ItemID.dustStone, count: 1}], heat: 2000 },
		{ source: {id: ItemID.crushedGold}, result: [{id: ItemID.dustSmallSilver, count: 1}, {id: ItemID.dustGold, count: 1}, {id: ItemID.dustStone, count: 1}], heat: 2000 },
		{ source: {id: ItemID.crushedLead}, result: [{id: ItemID.dustSmallSilver, count: 1}, {id: ItemID.dustLead, count: 1}, {id: ItemID.dustStone, count: 1}], heat: 2000 },
		{ source: {id: ItemID.crushedUranium}, result: [{id: ItemID.smallUranium235, count: 1}, {id: ItemID.uranium238, count: 4}, {id: ItemID.dustStone, count: 1}], heat: 3000 },
		{ source: {id: ItemID.crushedPurifiedCopper}, result: [{id: ItemID.dustSmallTin, count: 1}, {id: ItemID.dustCopper, count: 1}], heat: 500 },
		{ source: {id: ItemID.crushedPurifiedTin}, result: [{id: ItemID.dustSmallIron, count: 1}, {id: ItemID.dustTin, count: 1}], heat: 1000 },
		{ source: {id: ItemID.crushedPurifiedIron}, result: [{id: ItemID.dustSmallGold, count: 1}, {id: ItemID.dustIron, count: 1}], heat: 1500 },
		{ source: {id: ItemID.crushedPurifiedSilver}, result: [{id: ItemID.dustSmallLead, count: 1}, {id: ItemID.dustSilver, count: 1}], heat: 2000 },
		{ source: {id: ItemID.crushedPurifiedGold}, result: [{id: ItemID.dustSmallSilver, count: 1}, {id: ItemID.dustGold, count: 1}], heat: 2000 },
		{ source: {id: ItemID.crushedPurifiedLead}, result: [{id: ItemID.dustSmallSilver, count: 1}, {id: ItemID.dustLead, count: 1}], heat: 2000 },
		{ source: {id: ItemID.crushedPurifiedUranium}, result: [{id: ItemID.smallUranium235, count: 2}, {id: ItemID.uranium238, count: 5}], heat: 3000 },
		{ source: {id: ItemID.slag}, result: [{id: ItemID.dustSmallGold, count: 1}, {id: ItemID.dustCoal, count: 1}], heat: 1500 },
		{ source: {id: ItemID.fuelRodDepletedUranium}, result: [{id: ItemID.smallPlutonium, count: 1}, {id: ItemID.uranium238, count: 4}, {id: ItemID.dustIron, count: 1}], heat: 4000 },
		{ source: {id: ItemID.fuelRodDepletedUranium2}, result: [{id: ItemID.smallPlutonium, count: 2}, {id: ItemID.uranium238, count: 8}, {id: ItemID.dustIron, count: 3}], heat: 4000 },
		{ source: {id: ItemID.fuelRodDepletedUranium4}, result: [{id: ItemID.smallPlutonium, count: 4}, {id: ItemID.uranium238, count: 16}, {id: ItemID.dustIron, count: 6}], heat: 4000 },
		{ source: {id: ItemID.fuelRodDepletedMOX}, result: [{id: ItemID.smallPlutonium, count: 1}, {id: ItemID.plutonium, count: 3}, {id: ItemID.dustIron, count: 1}], heat: 5000 },
		{ source: {id: ItemID.fuelRodDepletedMOX2}, result: [{id: ItemID.smallPlutonium, count: 2}, {id: ItemID.plutonium, count: 6}, {id: ItemID.dustIron, count: 3}], heat: 5000 },
		{ source: {id: ItemID.fuelRodDepletedMOX4}, result: [{id: ItemID.smallPlutonium, count: 4}, {id: ItemID.plutonium, count: 12}, {id: ItemID.dustIron, count: 6}], heat: 5000 },
		{ source: {id: ItemID.rtgPellet}, result: [{id: ItemID.plutonium, count: 3}, {id: ItemID.dustIron, count: 54}], heat: 5000 }
	]);
	MachineRecipeRegistry.registerDictionary("thermalCentrifuge", thermalCentrifugeDictionary);
});

namespace Machine {
	export type ThermalCentrifugeRecipe = MultiResultProcessingRecipe & {
		heat: number
	}

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

	export class ThermalCentrifuge extends MultiResultProcessingMachine {
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

		getRecipeDictionary(): ProcessingRecipeDictionary<ThermalCentrifugeRecipe> {
			return MachineRecipeRegistry.getDictionary("thermalCentrifuge");
		}

		getResultSlotsCount(): number {
			return 3;
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

			const resultSize = this.getResultSlotsCount();
			if (this.data.energy >= this.heatingEnergyDemand && this.canPutResult(recipe.result, resultSize)) {
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
						const result = this.modifyResult(recipe, resultSize);
						this.putResult(result, resultSize);
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
		isValidInput: (item: ItemInstance, side: number, tileEntity: ThermalCentrifuge) => {
			return tileEntity.isValidSource(item.id, item.data);
		}
	});
}
