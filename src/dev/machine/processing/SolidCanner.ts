/// <reference path="./ProcessingMachine.ts" />

BlockRegistry.createBlock("solidCanner", [
	{name: "Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.solidCanner, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.solidCanner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.solidCanner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.solidCanner);

ItemName.addTierTooltip("solidCanner", 1);
ItemName.addConsumptionTooltip("solidCanner", "EU", 2);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.solidCanner, count: 1, data: 0}, [
		"c#c",
		"cxc",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingTin, 0]);

	MachineRecipeRegistry.registerRecipes<Machine.SolidCannerRecipe>("solidCanner", [
		{ source: {id: ItemID.uranium}, can: ItemID.fuelRod, result: {id: ItemID.fuelRodUranium, count: 1, data: 0} },
		{ source: {id: ItemID.mox}, can: ItemID.fuelRod, result: {id: ItemID.fuelRodMOX, count: 1, data: 0} },
		{ source: {id: VanillaBlockID.cake}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 14, data: 0} },
		{ source: {id: VanillaItemID.rabbit_stew}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 10, data: 0} },
		{ source: {id: VanillaItemID.cooked_porkchop}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 8, data: 0} },
		{ source: {id: VanillaItemID.cooked_beef}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 8, data: 0} },
		{ source: {id: VanillaItemID.pumpkin_pie}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 8, data: 0} },
		{ source: {id: VanillaItemID.mushroom_stew}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0} },
		{ source: {id: VanillaItemID.cooked_chicken}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0} },
		{ source: {id: VanillaItemID.golden_carrot}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0} },
		{ source: {id: VanillaItemID.muttoncooked}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0} },
		{ source: {id: VanillaItemID.beetroot_soup}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0} },
		{ source: {id: VanillaItemID.cooked_salmon}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0} },
		{ source: {id: VanillaItemID.bread}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0} },
		{ source: {id: VanillaItemID.cooked_cod}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0} },
		{ source: {id: VanillaItemID.baked_potato}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0} },
		{ source: {id: VanillaItemID.cooked_rabbit}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0} },
		{ source: {id: VanillaItemID.rotten_flesh}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 4, data: 1} },
		{ source: {id: VanillaItemID.apple}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 4, data: 0} },
		{ source: {id: VanillaItemID.porkchop}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0} },
		{ source: {id: VanillaItemID.beef}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0} },
		{ source: {id: VanillaItemID.carrot}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0} },
		{ source: {id: VanillaItemID.rabbit}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0} },
		{ source: {id: VanillaItemID.cookie}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0} },
		{ source: {id: VanillaItemID.melon_slice}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0} },
		{ source: {id: VanillaItemID.chicken}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 1} },
		{ source: {id: VanillaItemID.spider_eye}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 2} },
		{ source: {id: VanillaItemID.cod}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0} },
		{ source: {id: VanillaItemID.poisonous_potato}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 2} },
		{ source: {id: VanillaItemID.muttonraw}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0} },
		{ source: {id: VanillaItemID.salmon}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0} },
		{ source: {id: VanillaItemID.potato}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 1, data: 0} },
		{ source: {id: VanillaBlockID.beetroot}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 1, data: 0} },
		{ source: {id: VanillaItemID.tropical_fish}, can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 1, data: 0 } }
	]);
});

namespace Machine {
	export type SolidCannerRecipe = {
		source: {id: number, data?: number}
		can: number,
		result: ItemInstance
	}

	export class SolidCannerRecipeDictionary extends MachineRecipe.SourceRecipeDictionary<SolidCannerRecipe> {

	}

	const guiSolidCanner = MachineRegistry.createInventoryWindow("Solid Canning Machine", {
		drawing: [
			{type: "bitmap", x: 400 + 52*GUI_SCALE, y: 50 + 33*GUI_SCALE, bitmap: "solid_canner_arrow", scale: GUI_SCALE},
			{type: "bitmap", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, bitmap: "arrow_bar_background", scale: GUI_SCALE},
			{type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_SCALE}
		],

		elements: {
			"progressScale": {type: "scale", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
				onClick: () => {
					RV?.RecipeTypeRegistry.openRecipePage("icpe_solidCanner");
				}
			}},
			"energyScale": {type: "scale", x: 416, y: 178, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
			"slotEnergy": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 58*GUI_SCALE},
			"slotSource": {type: "slot", x: 400 + 32*GUI_SCALE, y: 50 + 32*GUI_SCALE},
			"slotCan": {type: "slot", x: 400 + 63*GUI_SCALE, y: 50 + 32*GUI_SCALE},
			"slotResult": {type: "slot", x: 400 + 111*GUI_SCALE, y: 50 + 32*GUI_SCALE},
			"slotUpgrade1": {type: "slot", x: 870, y: 50 + 4*GUI_SCALE},
			"slotUpgrade2": {type: "slot", x: 870, y: 50 + 22*GUI_SCALE},
			"slotUpgrade3": {type: "slot", x: 870, y: 50 + 40*GUI_SCALE},
			"slotUpgrade4": {type: "slot", x: 870, y: 50 + 58*GUI_SCALE},
		}
	});

	export class SolidCanner extends ProcessingMachine {
		defaultEnergyStorage = 800;
		defaultEnergyDemand = 2;
		defaultProcessTime = 200;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiSolidCanner;
		}

		getRecipeDictionary(): SolidCannerRecipeDictionary {
			return MachineRecipeRegistry.getDictionary("solidCanner");
		}

		isValidSource(id: number, data: number): boolean {
			return this.getRecipeDictionary().getRecipe(id, data) != null;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotSource") return this.isValidSource(id, data);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name == "slotCan") {
					const dictionary = this.getRecipeDictionary();
					return !!dictionary.findRecipe(recipe => recipe.can == id);
				}
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		performRecipe(): boolean {
			const sourceSlot = this.container.getSlot("slotSource");
			const canSlot = this.container.getSlot("slotCan");

			const dictionary = this.getRecipeDictionary();
			const recipe = dictionary.getRecipe(sourceSlot.id, sourceSlot.data);
			if (recipe && canSlot.id == recipe.can && canSlot.count >= recipe.result.count) {
				const resultSlot = this.container.getSlot("slotResult");
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
	}

	MachineRegistry.registerPrototype(BlockID.solidCanner, new SolidCanner());

	MachineRecipeRegistry.registerDictionary("solidCanner", new SolidCannerRecipeDictionary());

	StorageInterface.createInterface(BlockID.solidCanner, {
		slots: {
			"slotSource": {input: true, isValid: (item: ItemInstance, side: number, tileEntity: SolidCanner) => {
				return tileEntity.isValidSource(item.id, item.data);
			}},
			"slotCan": {input: true, isValid: (item: ItemInstance, side: number, tileEntity: SolidCanner) => {
				const dictionary = tileEntity.getRecipeDictionary();
				return !!dictionary.findRecipe(recipe => recipe.can == item.id);
			}},
			"slotResult": {output: true}
		}
	});
}
