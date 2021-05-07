IDRegistry.genBlockID("geothermalGenerator");
Block.createBlock("geothermalGenerator", [
	{name: "Geothermal Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.geothermalGenerator, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.geothermalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.geothermalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.geothermalGenerator);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.geothermalGenerator, count: 1, data: 0}, [
		"xax",
		"xax",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'a', ItemID.cellEmpty, 0, 'b', ItemID.casingIron, 0, 'x', 20, -1]);
});


const guiGeothermalGenerator = InventoryWindow("Geothermal Generator", {
	drawing: [
		{type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE}
	],

	elements: {
		"energyScale": {type: "scale", x: 702 + 4*GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75},
		"slot2": {type: "slot", x: 440, y: 183},
		"slotEnergy": {type: "slot", x: 725, y: 165}
	}
});

namespace Machine {
	export class GeothermalGenerator extends Generator {
		liquidTank: BlockEngine.LiquidTank;

		getScreenByName() {
			return guiGeothermalGenerator;
		}

		setupContainer(): void {
			this.liquidTank = this.addLiquidTank("fluid", 8000, ["lava"]);

			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => {
				return ChargeItemRegistry.isValidItem(id, "Eu", 1);
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id, count, data) => {
				return LiquidItemRegistry.getItemLiquid(id, data) == "lava";
			});
			this.container.setSlotAddTransferPolicy("slot2", () => 0);
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
					this.preventClick();
					return true;
				}
			}
			return super.onItemUse(coords, item, player);
		}

		onTick(): void {
			StorageInterface.checkHoppers(this);

			let slot1 = this.container.getSlot("slot1");
			let slot2 = this.container.getSlot("slot2");
			this.liquidTank.getLiquidFromItem(slot1, slot2);

			if (this.liquidTank.getAmount("lava") >= 1 && this.data.energy + 20 <= this.getEnergyStorage()) {
				this.data.energy += 20;
				this.liquidTank.getLiquid(1);
				this.setActive(true);
			}
			else {
				this.setActive(false);
			}

			this.chargeSlot("slotEnergy");
			this.liquidTank.updateUiScale("liquidScale");
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		getOperationSound(): string {
			return "GeothermalLoop.ogg";
		}

		getEnergyStorage(): number {
			return 10000;
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
	}

	MachineRegistry.registerPrototype(BlockID.geothermalGenerator, new GeothermalGenerator());

	MachineRegistry.createStorageInterface(BlockID.geothermalGenerator, {
		slots: {
			"slot1": {input: true},
			"slot2": {output: true}
		},
		isValidInput: (item: ItemInstance) => (
			LiquidItemRegistry.getItemLiquid(item.id, item.data) == "lava"
		),
		canTransportLiquid: (liquid: string) => false
	});
}