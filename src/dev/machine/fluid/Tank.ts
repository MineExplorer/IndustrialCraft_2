IDRegistry.genBlockID("tank");
Block.createBlock("tank", [
	{name: "Tank", texture: [["machine_bottom", 0], ["machine_top", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.tank, "stone", 1, true);

MachineRegistry.setMachineDrop("tank");

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.tank, count: 1, data: 0}, [
		" c ",
		"c#c",
		" c "
	], ['#', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0]);
});


var guiTank = InventoryWindow("Tank", {
	drawing: [
		{type: "bitmap", x: 611, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE},
	],

	elements: {
		"liquidScale": {type: "scale", x: 400 + 70*GUI_SCALE, y: 50 + 16*GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slotLiquid1": {type: "slot", x: 400 + 94*GUI_SCALE, y: 50 + 16*GUI_SCALE},
		"slotLiquid2": {type: "slot", x: 400 + 94*GUI_SCALE, y: 50 + 40*GUI_SCALE},
		"slotUpgrade1": {type: "slot", x: 870, y: 50 + 4*GUI_SCALE},
		"slotUpgrade2": {type: "slot", x: 870, y: 50 + 22*GUI_SCALE},
		"slotUpgrade3": {type: "slot", x: 870, y: 50 + 40*GUI_SCALE},
		"slotUpgrade4": {type: "slot", x: 870, y: 50 + 58*GUI_SCALE},
	}
});

namespace Machine {
	export class FluidTank
	extends MachineBase {
		upgrades = ["fluidEjector", "fluidPulling"];

		getScreenByName() {
			return guiTank;
		}

		setupContainer() {
			this.liquidStorage.setLimit(null, 16);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotLiquid1") {
					return (LiquidRegistry.getFullItem(id, data, "water") || LiquidLib.getEmptyItem(id, data))? true : false;
				}
				if (name == "slotLiquid2") return false;
				return UpgradeAPI.isValidUpgrade(id, this);
			});
		}

		getLiquidFromItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance, byHand?: boolean) {
			return MachineRegistry.getLiquidFromItem.call(this, liquid, inputItem, outputItem, byHand);
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
			if (Entity.getSneaking(player)) {
				let liquid = this.liquidStorage.getLiquidStored();
				return this.getLiquidFromItem(liquid, item, new ItemStack());
			}
			return false;
		}

		tick() {
			UpgradeAPI.executeUpgrades(this);

			var storage = this.liquidStorage;
			var liquid = storage.getLiquidStored();
			var slot1 = this.container.getSlot("slotLiquid1");
			var slot2 = this.container.getSlot("slotLiquid2");
			this.getLiquidFromItem(liquid, slot1, slot2);
			// TODO: rewrite
			if (liquid) {
				var full = LiquidLib.getFullItem(slot1.id, slot1.data, liquid);
				if (full && storage.getAmount(liquid) >= full.storage && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id) || slot2.id == 0)) {
					storage.getLiquid(liquid, full.storage);
					slot1.count--;
					slot2.id = full.id;
					slot2.data = full.data;
					slot2.count++;
					this.container.validateAll();
				}
			}
			storage.updateUiScale("liquidScale", storage.getLiquidStored());
			this.container.sendChanges();
		}
	}

	MachineRegistry.registerPrototype(BlockID.tank, new FluidTank());
}

StorageInterface.createInterface(BlockID.tank, {
	slots: {
		"slotLiquid1": {input: true},
		"slotLiquid2": {output: true}
	},
	isValidInput: function(item: ItemInstance) {
		return LiquidRegistry.getFullItem(item.id, item.data, "water") || LiquidLib.getEmptyItem(item.id, item.data);
	},
	canReceiveLiquid: () => true,
	canTransportLiquid: () => true
});