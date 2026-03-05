/// <reference path="./MultiResultProcessingMachine.ts" />

BlockRegistry.createBlock("oreWasher", [
	{name: "Ore Washing Plant", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.oreWasher, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.oreWasher, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.oreWasher, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 1], ["ore_washer_side", 1], ["ore_washer_side", 1]]);
TileRenderer.setRotationFunction(BlockID.oreWasher);

ItemName.addTierTooltip("oreWasher", 1);
ItemName.addConsumptionTooltip("oreWasher", "EU", 16);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.oreWasher, count: 1, data: 0}, [
		"aaa",
		"b#b",
		"xcx"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 325, 0, 'c', ItemID.circuitBasic, 0]);

	const oreWasherDictionary = new ProcessingRecipeDictionary<Machine.OreWashingRecipe>(200);
	oreWasherDictionary.registerList([
		{ source: {id: ItemID.crushedCopper}, result: [{id: ItemID.crushedPurifiedCopper, count: 1}, {id: ItemID.dustSmallCopper, count: 2}, {id: ItemID.dustStone, count: 1}] },
		{ source: {id: ItemID.crushedTin}, result: [{id: ItemID.crushedPurifiedTin, count: 1}, {id: ItemID.dustSmallTin, count: 2}, {id: ItemID.dustStone, count: 1}] },
		{ source: {id: ItemID.crushedIron}, result: [{id: ItemID.crushedPurifiedIron, count: 1}, {id: ItemID.dustSmallIron, count: 2}, {id: ItemID.dustStone, count: 1}] },
		{ source: {id: ItemID.crushedGold}, result: [{id: ItemID.crushedPurifiedGold, count: 1}, {id: ItemID.dustSmallGold, count: 2}, {id: ItemID.dustStone, count: 1}] },
		{ source: {id: ItemID.crushedSilver}, result: [{id: ItemID.crushedPurifiedSilver, count: 1}, {id: ItemID.dustSmallSilver, count: 2}, {id: ItemID.dustStone, count: 1}] },
		{ source: {id: ItemID.crushedLead}, result: [{id: ItemID.crushedPurifiedLead, count: 1}, {id: ItemID.dustSmallSulfur, count: 3}, {id: ItemID.dustStone, count: 1}] },
		{ source: {id: ItemID.crushedUranium}, result: [{id: ItemID.crushedPurifiedUranium, count: 1}, {id: ItemID.dustSmallLead, count: 2}, {id: ItemID.dustStone, count: 1}] },
		{ source: {id: VanillaBlockID.gravel}, result: [{id: 318, count: 1}, {id: ItemID.dustStone, count: 1}] }
	]);
	MachineRecipeRegistry.registerDictionary("oreWasher", oreWasherDictionary);
});

namespace Machine {
	export type OreWashingRecipe = MultiResultProcessingRecipe;

	const guiOreWasher = MachineRegistry.createInventoryWindow("Ore Washing Plant", {
		drawing: [
			{type: "bitmap", x: 400, y: 50, bitmap: "ore_washer_background", scale: GUI_SCALE_NEW},
			{type: "bitmap", x: 415, y: 170, bitmap: "energy_small_background", scale: GUI_SCALE_NEW}
		],

		elements: {
			"progressScale": {type: "scale", x: 400 + 98*GUI_SCALE_NEW, y: 50 + 35*GUI_SCALE_NEW, direction: 0, bitmap: "ore_washer_bar_scale", scale: GUI_SCALE_NEW, clicker: {
				onClick: () => {
					RV?.RecipeTypeRegistry.openRecipePage("icpe_oreWasher");
				}
			}},
			"energyScale": {type: "scale", x: 415, y: 170, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW},
			"liquidScale": {type: "scale", x: 400 + 60*GUI_SCALE_NEW, y: 50 + 21*GUI_SCALE_NEW, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW},
			"slotEnergy": {type: "slot", x: 400 + 3*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
			"slotLiquid1": {type: "slot", x: 400 + 33*GUI_SCALE_NEW, y: 50 + 13*GUI_SCALE_NEW, size: 54},
			"slotLiquid2": {type: "slot", x: 400 + 33*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
			"slotSource": {type: "slot", x: 400 + 99*GUI_SCALE_NEW, y: 50 + 13*GUI_SCALE_NEW, size: 54},
			"slotResult1": {type: "slot", x: 400 + 81*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
			"slotResult2": {type: "slot", x: 400 + 99*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
			"slotResult3": {type: "slot", x: 400 + 117*GUI_SCALE_NEW, y: 50 + 58*GUI_SCALE_NEW, size: 54},
			"slotUpgrade1": {type: "slot", x: 860, y: 50 + 3*GUI_SCALE_NEW, size: 54},
			"slotUpgrade2": {type: "slot", x: 860, y: 50 + 21*GUI_SCALE_NEW, size: 54},
			"slotUpgrade3": {type: "slot", x: 860, y: 50 + 39*GUI_SCALE_NEW, size: 54},
			"slotUpgrade4": {type: "slot", x: 860, y: 50 + 57*GUI_SCALE_NEW, size: 54},
		}
	});

	export class OreWasher extends MultiResultProcessingMachine {
		liquidTank: BlockEngine.LiquidTank;

		defaultEnergyStorage = 10000;
		defaultEnergyDemand = 16;
		defaultProcessTime = 500;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidPulling"];

		getScreenByName(): UI.IWindow {
			return guiOreWasher;
		}

		getRecipeDictionary(): ProcessingRecipeDictionary<OreWashingRecipe> {
			return MachineRecipeRegistry.getDictionary("oreWasher");
		}

		getResultSlotsCount(): number {
			return 3;
		}

		isValidSource(id: number, data: number): boolean {
			return !!this.getRecipeDictionary().getRecipe(id, data);
		}

		setupContainer(): void {
			this.liquidTank = this.addLiquidTank("fluid", 8000, ["water"]);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data, extra) => {
				if (name == "slotSource") return this.isValidSource(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name == "slotLiquid1") return LiquidItemRegistry.getItemLiquid(id, data, extra) == "water";
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		onTick(): void {
			this.useUpgrades(false);
			StorageInterface.checkHoppers(this);

			const slot1 = this.container.getSlot("slotLiquid1");
			const slot2 = this.container.getSlot("slotLiquid2");
			this.liquidTank.getLiquidFromItem(slot1, slot2);

			const isActive = this.performRecipe();
			this.setActive(isActive);

			this.dischargeSlot("slotEnergy");

			this.liquidTank.updateUiScale("liquidScale");
			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		performRecipe(): boolean {
			const sourceSlot = this.container.getSlot("slotSource");
			const dictionary = this.getRecipeDictionary();
			const recipe = dictionary.getRecipe(sourceSlot.id, sourceSlot.data);
			const resultSize = this.getResultSlotsCount();
			if (recipe && this.data.energy >= this.energyDemand && this.liquidTank.getAmount("water") >= 1000 && this.canPutResult(recipe.result, resultSize)) {
				this.data.energy -= this.energyDemand;
				this.updateProgress(recipe.processTime);
				if (this.isCompletedProgress()) {
					this.decreaseSlot(sourceSlot, 1);
					this.liquidTank.getLiquid(1000);
					const result = this.modifyResult(recipe, resultSize);
					this.putResult(result, resultSize);
					this.data.progress = 0;
				}
				return true;
			}

			this.data.progress = 0;
			
			return false;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
			if (Entity.getSneaking(player)) {
				if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
					this.preventClick();
					return true;
				}
			}
			return super.onItemUse(coords, item, player);
		}
	}

	MachineRegistry.registerPrototype(BlockID.oreWasher, new OreWasher());

	MachineRegistry.createFluidStorageInterface(BlockID.oreWasher, {
		slots: {
			"slotSource": {input: true, isValid: (item: ItemInstance, side: number, tileEntity: OreWasher) => {
				return tileEntity.isValidSource(item.id, item.data);
			}},
			"slotLiquid1": {input: true, isValid: (item: ItemInstance) => {
				return LiquidItemRegistry.getItemLiquid(item.id, item.data, item.extra) == "water";
			}},
			"slotLiquid2": {output: true},
			"slotResult1": {output: true},
			"slotResult2": {output: true},
			"slotResult3": {output: true}
		},
		canTransportLiquid: () => false
	});
}
