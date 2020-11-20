IDRegistry.genBlockID("recycler");
Block.createBlock("recycler", [
	{name: "Recycler", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.recycler, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.recycler, 2, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.recycler, 2, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["recycler_front", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.recycler);

ItemName.addTierTooltip("recycler", 1);

MachineRegistry.setMachineDrop("recycler", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.recycler, count: 1, data: 0}, [
		" a ",
		"x#x",
		"bxb"
	], ['#', BlockID.compressor, -1, 'x', 3, -1, 'a', 348, 0, 'b', ItemID.ingotSteel, 0]);
});

var recyclerBlacklist = [102, 280, 78, 80, 332];

var guiRecycler = InventoryWindow("Recycler", {
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "recycler_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "recycler_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79},
		"slotEnergy": {type: "slot", x: 441, y: 218, isValid: MachineRegistry.isValidEUStorage},
		"slotResult": {type: "slot", x: 625, y: 148, isValid: function() {return false;}},
		"slotUpgrade1": {type: "slot", x: 820, y: 60},
		"slotUpgrade2": {type: "slot", x: 820, y: 119},
		"slotUpgrade3": {type: "slot", x: 820, y: 178},
		"slotUpgrade4": {type: "slot", x: 820, y: 237},
	}
});

namespace Machine {
	export class Recycler
	extends ElectricMachine {
		defaultValues = {
			energy: 0,
			power_tier: 1,
			energy_storage: 800,
			energy_consumption: 1,
			work_time: 45,
			progress: 0,
			isActive: false
		}

		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName() {
			return guiRecycler;
		}

		getTier() {
			return this.data.power_tier;
		}

		resetValues() {
			this.data.power_tier = this.defaultValues.power_tier;
			this.data.energy_storage = this.defaultValues.energy_storage;
			this.data.energy_consumption = this.defaultValues.energy_consumption;
			this.data.work_time = this.defaultValues.work_time;
		}

		tick() {
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);

			var newActive = false;
			var sourceSlot = this.container.getSlot("slotSource");
			var resultSlot = this.container.getSlot("slotResult");
			if (sourceSlot.id > 0 && (resultSlot.id == ItemID.scrap && resultSlot.count < 64 || resultSlot.id == 0)) {
				if (this.data.energy >= this.data.energy_consumption) {
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
					//this.startPlaySound();
				}
				if (this.data.progress.toFixed(3) >= 1) {
					sourceSlot.count--;
					if (Math.random() < 0.125 && recyclerBlacklist.indexOf(sourceSlot.id) == -1) {
						resultSlot.id = ItemID.scrap;
						resultSlot.count++;
					}
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
			if (!newActive)
				//this.stopPlaySound();
			this.setActive(newActive);

			var energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
		}

		getEnergyStorage() {
			return this.data.energy_storage;
		}

		getOperationSound() {
			return "RecyclerOp.ogg";
		}

		getInterruptSound() {
			return "InterruptOne.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.recycler, new Recycler());

	StorageInterface.createInterface(BlockID.recycler, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		}
	});
}