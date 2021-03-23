IDRegistry.genBlockID("fluidHeatGenerator");
Block.createBlock("fluidHeatGenerator", [
	{name: "Liquid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.fluidHeatGenerator, "stone", 1, true);

TileRenderer.setHandAndUiModel(BlockID.fluidHeatGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.setStandardModel(BlockID.fluidHeatGenerator, 0, [["heat_pipe", 0], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.setStandardModel(BlockID.fluidHeatGenerator, 1, [["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.setStandardModelWithRotation(BlockID.fluidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 0, [["heat_pipe", 1], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 1, [["fluid_heat_generator_back", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerModelWithRotation(BlockID.fluidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 1], ["heat_pipe", 1], ["fluid_heat_generator_side", 1], ["fluid_heat_generator_side", 1]]);
TileRenderer.setRotationFunction(BlockID.fluidHeatGenerator, true);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.fluidHeatGenerator, count: 1, data: 0}, [
		"pcp",
		"cxc",
		"pcp"
	], ['x', ItemID.heatConductor, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});

const guiFluidHeatGenerator = InventoryWindow("Liquid Fuel Firebox", {
	drawing: [
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE},
		{type: "bitmap", x: 660, y: 102, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE},
		{type: "bitmap", x: 660, y: 176, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE}
	],

	elements: {
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75},
		"slot2": {type: "slot", x: 440, y: 183},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 670, y: 112, width: 300, height: 30, text: "Emit: 0"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 670, y: 186, width: 300, height: 30, text: "Max Emit: 0"}
	}
});

namespace Machine {
	export class FluidHeatGenerator extends MachineBase {
		liquidTank: BlockEngine.LiquidTank;

		defaultValues = {
			output: 0,
			fuel: 0,
			liquid: null
		}

		getScreenByName() {
			return guiFluidHeatGenerator;
		}

		setupContainer(): void {
			let liquidFuel = MachineRecipeRegistry.requireRecipesFor("fluidFuel");
			this.liquidTank = this.addLiquidTank("fluid", 10, Object.keys(liquidFuel));

			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id, count, data) => {
				let empty = LiquidItemRegistry.getEmptyItem(id, data);
				if (!empty) return false;
				return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
			});

			this.container.setSlotAddTransferPolicy("slot2", () => 0);
		}

		isWrenchable(): boolean {
			return true;
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
			StorageInterface.checkHoppers(this);

			let slot1 = this.container.getSlot("slot1");
			let slot2 = this.container.getSlot("slot2");
			this.liquidTank.getLiquidFromItem(slot1, slot2);

			let liquid = this.liquidTank.getLiquidStored();
			let fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", this.data.liquid || liquid);
			if (fuel && this.data.fuel <= 0 && +this.liquidTank.getAmount().toFixed(3) >= fuel.amount/1000 && this.spreadHeat(fuel.power*2)) {
				this.liquidTank.getLiquid(fuel.amount/1000);
				this.data.fuel = fuel.amount;
				this.data.liquid = liquid;
			}
			if (fuel && this.data.fuel > 0) {
				if (this.data.fuel < fuel.amount) {
					this.spreadHeat(fuel.power*2);
				}
				this.data.fuel -= fuel.amount/20;
				this.setActive(true);
				this.container.setText("textInfo2", "Max Emit: " + fuel.power * 2);
			}
			else {
				this.data.liquid = null;
				this.setActive(false);
				this.container.setText("textInfo1", "Emit: 0");
				this.container.setText("textInfo2", "Max Emit: 0");
			}

			this.container.setText("textInfo1", "Emit: " + this.data.output);
			this.liquidTank.updateUiScale("liquidScale");
			this.container.sendChanges();
		}

		getOperationSound(): string {
			return "GeothermalLoop.ogg";
		}

		getEnergyStorage(): number {
			return 10000;
		}

		spreadHeat(heat: number): number {
			let side = this.getFacing();
			let coords = StorageInterface.getRelativeCoords(this, side);
			let TE = this.region.getTileEntity(coords);
			if (TE && TE.canReceiveHeat && TE.canReceiveHeat(side ^ 1)) {
				this.data.output = TE.heatReceive(heat);
			} else {
				this.data.output = 0;
			}
			return this.data.output;
		}
	}

	MachineRegistry.registerPrototype(BlockID.fluidHeatGenerator, new FluidHeatGenerator());

	StorageInterface.createInterface(BlockID.fluidHeatGenerator, {
		slots: {
			"slot1": {input: true},
			"slot2": {output: true}
		},

		isValidInput: function(item: ItemInstance) {
			let empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);
			if (!empty) return false;
			return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
		},

		getLiquidStorage: function() {
			return this.tileEntity.liquidTank;
		},

		canReceiveLiquid: function(liquid: string) {
			return this.getLiquidStorage().isValidLiquid(liquid);
		},

		canTransportLiquid: () => false
	});
}