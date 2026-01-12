BlockRegistry.createBlock("recycler", [
	{name: "Recycler", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.recycler, "stone", 1);

TileRenderer.setStandardModelWithRotation(BlockID.recycler, 2, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.recycler, 2, [["machine_bottom", 0], ["macerator_top_active", 0], ["machine_side", 0], ["recycler_front_active", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.recycler);

ItemName.addTierTooltip("recycler", 1);
ItemName.addConsumptionTooltip("recycler", "EU", 1);

Callback.addCallback("PreLoaded", function() {
	const metalIngot = IC2Config.hardRecipes ? ItemID.ingotSteel : VanillaItemID.iron_ingot;
	Recipes.addShaped({id: BlockID.recycler, count: 1, data: 0}, [
		" a ",
		"x#x",
		"bxb"
	], ['#', BlockID.compressor, -1, 'x', 3, -1, 'a', 348, 0, 'b', metalIngot, 0]);
});

const recyclerBlacklist = [102, 280, 78, 80, 332];

const guiRecycler = MachineRegistry.createInventoryWindow("Recycler", {
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "recycler_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "recycler_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79},
		"slotEnergy": {type: "slot", x: 441, y: 218},
		"slotResult": {type: "slot", x: 625, y: 148},
		"slotUpgrade1": {type: "slot", x: 820, y: 60},
		"slotUpgrade2": {type: "slot", x: 820, y: 119},
		"slotUpgrade3": {type: "slot", x: 820, y: 178},
		"slotUpgrade4": {type: "slot", x: 820, y: 237},
	}
});

namespace Machine {
	export class Recycler extends ProcessingMachine {
		defaultEnergyStorage = 800;
		defaultEnergyDemand = 1;
		defaultProcessTime = 45;
		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName(): UI.IWindow {
			return guiRecycler;
		}

		setupContainer(): void {
			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => {
				return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
			});
			this.container.setSlotAddTransferPolicy("slotResult", () => 0);
		}

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);

			let newActive = false;
			const sourceSlot = this.container.getSlot("slotSource");
			const resultSlot = this.container.getSlot("slotResult");
			if (sourceSlot.id != 0 && (resultSlot.id == ItemID.scrap && resultSlot.count < 64 || resultSlot.id == 0)) {
				if (this.data.energy >= this.energyDemand) {
					this.data.energy -= this.energyDemand;
					this.updateProgress();
					newActive = true;
				}
				if (this.isCompletedProgress()) {
					this.decreaseSlot(sourceSlot, 1);
					if (Math.random() < 0.125 && recyclerBlacklist.indexOf(sourceSlot.id) == -1) {
						resultSlot.setSlot(ItemID.scrap, resultSlot.count + 1, 0);
					}
					this.data.progress = 0;
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

		getOperationSound(): string {
			return "RecyclerOp.ogg";
		}

		getInterruptSound(): string {
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