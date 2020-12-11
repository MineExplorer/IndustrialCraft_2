IDRegistry.genBlockID("ironFurnace");
Block.createBlock("ironFurnace", [
	{name: "Iron Furnace", texture: [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.ironFurnace, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.ironFurnace, 2, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.ironFurnace, 2, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 1], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.setRotationFunction(BlockID.ironFurnace);

MachineRegistry.setMachineDrop("ironFurnace");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.ironFurnace, count: 1, data: 0}, [
		" x ",
		"x x",
		"x#x"
	], ['#', 61, -1, 'x', ItemID.plateIron, 0]);
});

var guiIronFurnace = InventoryWindow("Iron Furnace", {
	drawing: [
		{type: "bitmap", x: 530, y: 155, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "fire_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
		"burningScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79},
		"slotFuel": {type: "slot", x: 441, y: 218},
		"slotResult": {type: "slot", x: 625, y: 148},
	}
});

namespace Machine {
	export class IronFurnace
	extends MachineBase {
		defaultValues = {
			meta: 0,
			progress: 0,
			burn: 0,
			burnMax: 0,
			isActive: false
		}

		getScreenByName() {
			return guiIronFurnace;
		}

		setupContainer() {
			StorageInterface.setSlotValidatePolicy(this.container, "slotSource", (name, id, count, data) => {
				return this.getRecipeResult(id, data)? true : false;
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", (name, id, count, data) => {
				return Recipes.getFuelBurnDuration(id, data) > 0;
			});
			this.container.setSlotAddTransferPolicy("slotResult", () => 0);
		}

		consumeFuel() {
			var fuelSlot = this.container.getSlot("slotFuel");
			if (fuelSlot.id > 0) {
				var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
				if (burn > 0) {
					if (LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
						var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
						fuelSlot.setSlot(empty.id, 1, empty.data);
					} else {
						this.decreaseSlot(fuelSlot, 1);
					}
					return burn;
				}
			}
			return 0;
		}

		getRecipeResult(id: number, data: number): ItemInstance {
			return Recipes.getFurnaceRecipeResult(id, data, "iron");
		}

		tick() {
			StorageInterface.checkHoppers(this);

			var sourceSlot = this.container.getSlot("slotSource");
			var result = this.getRecipeResult(sourceSlot.id, sourceSlot.data);

			if (this.data.burn == 0 && result) {
				this.data.burn = this.data.burnMax = this.consumeFuel();
			}

			if (this.data.burn > 0 && result) {
				var resultSlot = this.container.getSlot("slotResult");
				if ((resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0) && this.data.progress++ >= 160) {
					this.decreaseSlot(sourceSlot, 1);
					resultSlot.setSlot(result.id, resultSlot.count + 1, result.data);
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}

			if (this.data.burn > 0) {
				this.data.burn--;
				this.setActive(true);
				//this.startPlaySound();
			} else {
				//this.stopPlaySound();
				this.setActive(false);
			}

			this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
			this.container.setScale("progressScale", this.data.progress / 160);
			this.container.sendChanges();
		}

		getOperationSound() {
			return "IronFurnaceOp.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.ironFurnace, new IronFurnace());

	StorageInterface.createInterface(BlockID.ironFurnace, {
		slots: {
			"slotSource": {input: true, side: "up", isValid: (item: ItemInstance) => {
				return Recipes.getFurnaceRecipeResult(item.id, item.data, "iron")? true : false;
			}},
			"slotFuel": {input: true, side: "horizontal", isValid: (item: ItemInstance) => {
				return Recipes.getFuelBurnDuration(item.id, item.data) > 0;
			}},
			"slotResult": {output: true}
		}
	});
}