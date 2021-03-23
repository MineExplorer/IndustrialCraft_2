IDRegistry.genBlockID("tank");
Block.createBlock("tank", [
	{name: "Tank", texture: [["machine_bottom", 0], ["machine_top", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.tank, "stone", 1, true);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.tank, count: 1, data: 0}, [
		" c ",
		"c#c",
		" c "
	], ['#', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0]);
});

const guiTank = InventoryWindow("Tank", {
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
	export class FluidTank extends MachineBase {
		liquidTank: BlockEngine.LiquidTank;
		upgrades = ["fluidEjector", "fluidPulling"];

		getScreenByName() {
			return guiTank;
		}

		setupContainer(): void {
			this.liquidTank = this.addLiquidTank("fluid", 16000);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotLiquid1") {
					return !!(LiquidRegistry.getFullItem(id, data, "water") || LiquidItemRegistry.getEmptyItem(id, data));
				}
				if (name == "slotLiquid2") return false;
				return UpgradeAPI.isValidUpgrade(id, this);
			});
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
					return true;
				}
			}
			return super.onItemUse(coords, item, player);
		}

		onTick(): void {
			UpgradeAPI.executeUpgrades(this);

			let slot1 = this.container.getSlot("slotLiquid1");
			let slot2 = this.container.getSlot("slotLiquid2");
			this.liquidTank.getLiquidFromItem(slot1, slot2) || this.liquidTank.addLiquidToItem(slot1, slot2);
			this.liquidTank.updateUiScale("liquidScale");
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

	isValidInput: (item: ItemInstance) => {
		return !!(LiquidRegistry.getFullItem(item.id, item.data, "water") || LiquidItemRegistry.getEmptyItem(item.id, item.data));
	},

	getLiquidStorage: function() {
		return this.tileEntity.liquidTank;
	},

	canReceiveLiquid: () => true,
	canTransportLiquid: () => true
});