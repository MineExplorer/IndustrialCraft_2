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
		"ItemID.uranium": {storage: [ItemID.fuelRod, 1], result: [ItemID.fuelRodUranium, 1, 0]},
		"ItemID.mox": {storage: [ItemID.fuelRod, 1], result: [ItemID.fuelRodMOX, 1, 0]},
		354: {storage: [ItemID.tinCanEmpty, 14], result: [ItemID.tinCanFull, 14, 0]},
		413: {storage: [ItemID.tinCanEmpty, 10], result: [ItemID.tinCanFull, 10, 0]},
		320: {storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0]},
		364: {storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0]},
		400: {storage: [ItemID.tinCanEmpty, 8], result: [ItemID.tinCanFull, 8, 0]},
		282: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		366: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		396: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		424: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		459: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		463: {storage: [ItemID.tinCanEmpty, 6], result: [ItemID.tinCanFull, 6, 0]},
		297: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
		350: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
		393: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
		412: {storage: [ItemID.tinCanEmpty, 5], result: [ItemID.tinCanFull, 5, 0]},
		367: {storage: [ItemID.tinCanEmpty, 4], result: [ItemID.tinCanFull, 4, 1]},
		260: {storage: [ItemID.tinCanEmpty, 4], result: [ItemID.tinCanFull, 4, 0]},
		319: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
		363: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
		391: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
		411: {storage: [ItemID.tinCanEmpty, 3], result: [ItemID.tinCanFull, 3, 0]},
		357: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		360: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		365: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 1]},
		375: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 2]},
		349: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		394: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 2]},
		423: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		460: {storage: [ItemID.tinCanEmpty, 2], result: [ItemID.tinCanFull, 2, 0]},
		392: {storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0]},
		457: {storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0]},
		461: {storage: [ItemID.tinCanEmpty, 1], result: [ItemID.tinCanFull, 1, 0]},
	}, true);
});

var guiSolidCanner = InventoryWindow("Solid Canning Machine", {
	drawing: [
		{type: "bitmap", x: 400 + 52*GUI_SCALE, y: 50 + 33*GUI_SCALE, bitmap: "solid_canner_arrow", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 400 + 86*GUI_SCALE, y: 50 + 34*GUI_SCALE, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
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
			progress: 0,
			isActive: false
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
					var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
					for (var i in recipes) {
						if (recipes[i].storage[0] == id) return true;
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

			var sourceSlot = this.container.getSlot("slotSource");
			var resultSlot = this.container.getSlot("slotResult");
			var canSlot = this.container.getSlot("slotCan");

			var newActive = false;
			var recipe = MachineRecipeRegistry.getRecipeResult("solidCanner", sourceSlot.id);
			if (recipe && canSlot.id == recipe.storage[0] && canSlot.count >= recipe.storage[1] && (resultSlot.id == recipe.result[0] && resultSlot.data == recipe.result[2] && resultSlot.count <= 64 - recipe.result[1] || resultSlot.id == 0)) {
				if (this.data.energy >= this.data.energy_consume) {
					this.data.energy -= this.data.energy_consume;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
				}
				if (this.data.progress.toFixed(3) >= 1) {
					sourceSlot.setSlot(sourceSlot.id, sourceSlot.count - 1, 0);
					canSlot.setSlot(canSlot.id, canSlot.count - recipe.storage[1], 0);
					resultSlot.setSlot(recipe.result[0], recipe.result[1], recipe.result[2]);
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
			this.setActive(newActive);

			var energyStorage = this.getEnergyStorage();
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
				var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
				for (var i in recipes) {
					if (recipes[i].storage[0] == item.id) return true;
				}
				return false;
			}},
			"slotResult": {output: true}
		}
	});
}