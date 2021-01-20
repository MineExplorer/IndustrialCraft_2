IDRegistry.genBlockID("solidCanner");
Block.createBlock("solidCanner", [
	{name: "Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.solidCanner, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.solidCanner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.solidCanner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.solidCanner);

ItemName.addTierTooltip("solidCanner", 1);

MachineRegistry.setMachineDrop("solidCanner", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.solidCanner, count: 1, data: 0}, [
		"c#c",
		"cxc",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingTin, 0]);

	MachineRecipeRegistry.registerRecipesFor("solidCanner", {
		"ItemID.uranium": {can: ItemID.fuelRod, result: {id: ItemID.fuelRodUranium, count: 1, data: 0}},
		"ItemID.mox": {can: ItemID.fuelRod, result: {id: ItemID.fuelRodMOX, count: 1, data: 0}},
		354: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 14, data: 0}},
		413: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 10, data: 0}},
		320: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 8, data: 0}},
		364: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 8, data: 0}},
		400: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 8, data: 0}},
		282: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		366: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		396: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		424: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		459: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		463: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 6, data: 0}},
		297: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0}},
		350: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0}},
		393: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0}},
		412: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 5, data: 0}},
		367: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 4, data: 1}},
		260: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 4, data: 0}},
		319: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0}},
		363: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0}},
		391: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0}},
		411: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 3, data: 0}},
		357: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		360: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		365: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 1}},
		375: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 2}},
		349: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		394: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 2}},
		423: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		460: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 2, data: 0}},
		392: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 1, data: 0}},
		457: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 1, data: 0}},
		461: {can: ItemID.tinCanEmpty, result: {id: ItemID.tinCanFull, count: 1, data: 0}},
	}, true);
});

const guiSolidCanner = InventoryWindow("Solid Canning Machine", {
	drawing: [
		{type: "bitmap", x: 400 + 52*GUI_SCALE, y: 50 + 33*GUI_SCALE, bitmap: "solid_canner_arrow", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
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
	export class SolidCanner
	extends ElectricMachine {
		defaultValues = {
			energy: 0,
			tier: 1,
			energy_storage: 800,
			energy_consume: 1,
			work_time: 200,
			progress: 0
		}

		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName() {
			return guiSolidCanner;
		}

		getTier(): number {
			return this.data.tier;
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotSource") return !this.getRecipeResult(id);
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name == "slotCan") {
					let recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
					for (let i in recipes) {
						if (recipes[i].can == id) return true;
					}
					return false;
				}
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		resetValues(): void {
			this.data.tier = this.defaultValues.tier;
			this.data.energy_storage = this.defaultValues.energy_storage;
			this.data.energy_consume = this.defaultValues.energy_consume;
			this.data.work_time = this.defaultValues.work_time;
		}

		getRecipeResult(id: number) {
			return MachineRecipeRegistry.getRecipeResult("solidCanner", id);
		}

		tick(): void {
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);

			let sourceSlot = this.container.getSlot("slotSource");
			let resultSlot = this.container.getSlot("slotResult");
			let canSlot = this.container.getSlot("slotCan");

			let newActive = false;
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

			let energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.sendChanges();
		}

		getEnergyStorage(): number {
			return this.data.energy_storage;
		}
	}

	MachineRegistry.registerPrototype(BlockID.solidCanner, new SolidCanner());

	StorageInterface.createInterface(BlockID.solidCanner, {
		slots: {
			"slotSource": {input: true, isValid: (item: ItemInstance) => {
				return MachineRecipeRegistry.hasRecipeFor("solidCanner", item.id);
			}},
			"slotCan": {input: true, isValid: (item: ItemInstance) => {
				let recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
				for (let i in recipes) {
					if (recipes[i].can == item.id) return true;
				}
				return false;
			}},
			"slotResult": {output: true}
		}
	});
}