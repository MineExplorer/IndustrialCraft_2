BlockRegistry.createBlock("tank", [
	{name: "Tank", texture: [["machine_bottom", 0], ["machine_top", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.tank, "stone", 1);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.tank, count: 1, data: 0}, [
		" c ",
		"c#c",
		" c "
	], ['#', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0]);
});

const guiTank = MachineRegistry.createInventoryWindow("Tank", {
	drawing: [
		{type: "bitmap", x: 400 + 46*GUI_SCALE, y: 50 + 12*GUI_SCALE, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 400 + 80*GUI_SCALE, y: 159, bitmap: "liquid_bar_arrow", scale: GUI_SCALE}
	],

	elements: {
		"liquidScale": {type: "scale", x: 400 + 50*GUI_SCALE, y: 50 + 16*GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slotLiquid1": {type: "slot", x: 400 + 74*GUI_SCALE, y: 95},
		"slotLiquid2": {type: "slot", x: 400 + 74*GUI_SCALE, y: 203},
		"slotOutput": {type: "slot", x: 400 + 106*GUI_SCALE, y: 149},
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

		getScreenByName(): UI.IWindow {
			return guiTank;
		}

		setupContainer(): void {
			this.liquidTank = this.addLiquidTank("fluid", 16000);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data, extra) => {
				if (name == "slotLiquid1") return !!LiquidItemRegistry.getItemLiquid(id, data, extra);
				if (name == "slotLiquid2") return LiquidItemRegistry.canBeFilledWithLiquid(id, data, extra, this.liquidTank.getLiquidStored() || "water");
				if (name == "slotOutput") return false;
				return UpgradeAPI.isValidUpgrade(id, this);
			});
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				if (MachineRegistry.emptyTankOnClick(this.liquidTank, item, player) || 
				  MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
					this.preventClick();
					return true;
				}
			}
			return super.onItemUse(coords, item, player);
		}

		onTick(): void {
			UpgradeAPI.useUpgrades(this);
			StorageInterface.checkHoppers(this);

			const slot1 = this.container.getSlot("slotLiquid1");
			const slot2 = this.container.getSlot("slotLiquid2");
			const slotOutput = this.container.getSlot("slotOutput");
			this.liquidTank.getLiquidFromItem(slot1, slotOutput);
			this.liquidTank.addLiquidToItem(slot2, slotOutput);

			this.liquidTank.updateUiScale("liquidScale");
			this.container.sendChanges();
		}
	}

	MachineRegistry.registerPrototype(BlockID.tank, new FluidTank());
}

MachineRegistry.createFluidStorageInterface(BlockID.tank, {
	slots: {
		"slotLiquid1": {input: true, isValid: (item) => {
			return !!LiquidItemRegistry.getItemLiquid(item.id, item.data, item.extra);
		}},
		"slotLiquid2": {input: true, isValid: (item, side, tileEntity) => {
			return LiquidItemRegistry.canBeFilledWithLiquid(item.id, item.data, item.extra, tileEntity.liquidTank.getLiquidStored() || "water");
		}},
		"slotOutput": {output: true}
	},
	canReceiveLiquid: () => true
});