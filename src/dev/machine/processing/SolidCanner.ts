BlockRegistry.createBlock("solidCanner", [
	{name: "Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.solidCanner, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.solidCanner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.solidCanner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.solidCanner);

ItemName.addVoltageTooltip("solidCanner", 32);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.solidCanner, count: 1, data: 0}, [
		"c#c",
		"cxc",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingTin, 0]);

	MachineRecipeRegistry.registerRecipesFor("solidCanner", {
		"ItemID.uranium": {can: ItemID.fuelRod, result: {id: ItemID.fuelRodUranium, count: 1, data: 0}},
		"ItemID.mox": {can: ItemID.fuelRod, result: {id: ItemID.fuelRodMOX, count: 1, data: 0}},
		"minecraft:cake": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 14, data: 0}},
		"minecraft:rabbit_stew": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 10, data: 0}},
		"minecraft:cooked_porkchop": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 8, data: 0}},
		"minecraft:cooked_beef": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 8, data: 0}},
		"minecraft:pumpkin_pie": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 8, data: 0}},
		"minecraft:mushroom_stew": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		"minecraft:cooked_chicken": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		"minecraft:golden_carrot": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		"minecraft:muttoncooked": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		"minecraft:beetroot_soup": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		"minecraft:cooked_salmon": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		"minecraft:bread": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0}},
		"minecraft:cooked_cod": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0}},
		"minecraft:baked_potato": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0}},
		"minecraft:cooked_rabbit": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0}},
		"minecraft:rotten_flesh": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 4, data: 1}},
		"minecraft:apple": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 4, data: 0}},
		"minecraft:porkchop": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0}},
		"minecraft:beef": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0}},
		"minecraft:carrot": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0}},
		"minecraft:rabbit": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0}},
		"minecraft:cookie": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		"minecraft:melon_slice": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		"minecraft:chicken": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 1}},
		"minecraft:spider_eye": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 2}},
		"minecraft:cod": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		"minecraft:poisonous_potato": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 2}},
		"minecraft:muttonraw": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		"minecraft:salmon": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		"minecraft:potato": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 1, data: 0}},
		"minecraft:beetroot": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 1, data: 0}},
		"minecraft:tropical_fish": {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 1, data: 0}},
	}, true);
});


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

namespace Machine {
	export class SolidCanner extends ProcessingMachine {
		defaultEnergyStorage = 800;
		defaultEnergyDemand = 1;
		defaultProcessTime = 200;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiSolidCanner;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotSource") return !!this.getRecipeResult(id);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name == "slotCan") {
					const recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
					for (let i in recipes) {
						if (recipes[i].can == id) return true;
					}
					return false;
				}
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		getRecipeResult(id: number): {can: number, result: ItemInstance} {
			return MachineRecipeRegistry.getRecipeResult("solidCanner", id);
		}

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);

			const sourceSlot = this.container.getSlot("slotSource");
			const resultSlot = this.container.getSlot("slotResult");
			const canSlot = this.container.getSlot("slotCan");

			let newActive = false;
			const recipe = this.getRecipeResult(sourceSlot.id);
			if (recipe) {
				const result = recipe.result;
				if (canSlot.id == recipe.can && canSlot.count >= result.count && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0)) {
					if (this.data.energy >= this.energyDemand) {
						this.data.energy -= this.energyDemand;
						this.updateProgress();
						newActive = true;
					}
					if (this.isCompletedProgress()) {
						sourceSlot.setSlot(sourceSlot.id, sourceSlot.count - 1, 0);
						canSlot.setSlot(canSlot.id, canSlot.count - result.count, 0);
						resultSlot.setSlot(result.id, resultSlot.count + result.count, result.data);
						this.container.validateAll();
						this.data.progress = 0;
					}
				}
			}
			else {
				this.data.progress = 0;
			}
			this.setActive(newActive);

			this.dischargeSlot("slotEnergy");

			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}
	}

	MachineRegistry.registerPrototype(BlockID.solidCanner, new SolidCanner());

	StorageInterface.createInterface(BlockID.solidCanner, {
		slots: {
			"slotSource": {input: true, isValid: (item: ItemInstance) => {
				return MachineRecipeRegistry.hasRecipeFor("solidCanner", item.id);
			}},
			"slotCan": {input: true, isValid: (item: ItemInstance) => {
				const recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
				for (let i in recipes) {
					if (recipes[i].can == item.id) return true;
				}
				return false;
			}},
			"slotResult": {output: true}
		}
	});
}