BlockRegistry.createBlock("fluidHeatGenerator", [
	{name: "Liquid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.fluidHeatGenerator, "stone", 1);

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

const guiFluidHeatGenerator = MachineRegistry.createInventoryWindow("Liquid Fuel Firebox", {
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
			heat: 0,
			fuel: 0,
			liquid: null
		}

		getScreenByName(): UI.IWindow {
			return guiFluidHeatGenerator;
		}

		setupContainer(): void {
			const liquidFuel = MachineRecipeRegistry.requireFluidRecipes("fluidFuel");
			this.liquidTank = this.addLiquidTank("fluid", 10000, Object.keys(liquidFuel));

			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id, count, data, extra) => {
				const liquid = LiquidItemRegistry.getItemLiquid(id, data, extra);
				return liquid && MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid);
			});

			this.container.setSlotAddTransferPolicy("slot2", () => 0);
		}

		canRotate(): boolean {
			return true;
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

		getFuel(liquid: string): {power: number, amount: number} {
			return MachineRecipeRegistry.getFluidRecipe("fluidFuel", liquid);
		}

		onTick(): void {
			StorageInterface.checkHoppers(this);

			const slot1 = this.container.getSlot("slot1");
			const slot2 = this.container.getSlot("slot2");
			this.liquidTank.getLiquidFromItem(slot1, slot2);

			if (this.data.fuel <= 0 && this.data.heat == 0) {
				const liquid = this.liquidTank.getLiquidStored();
				const fuel = this.getFuel(liquid);
				if (fuel && this.liquidTank.getAmount() >= fuel.amount) {
					this.liquidTank.getLiquid(fuel.amount);
					this.data.fuel = fuel.amount;
					this.data.liquid = liquid;
				}
			}
			if (this.data.fuel > 0) {
				const fuel = this.getFuel(this.data.liquid);
				this.data.heat = fuel.power * 2;
				this.data.fuel -= fuel.amount / 20;
				this.setActive(true);
				this.container.setText("textInfo2", "Max Emit: " + fuel.power * 2);
			}
			else {
				this.data.liquid = null;
				this.setActive(false);
				this.container.setText("textInfo2", "Max Emit: 0");
			}

			if (this.data.heat > 0) {
				const output = this.spreadHeat(this.data.heat);
				this.container.setText("textInfo1", "Emit: " + output);
				if (output > 0) this.data.heat = 0;
			} else {
				this.container.setText("textInfo1", "Emit: 0");
			}

			this.liquidTank.updateUiScale("liquidScale");
			this.container.sendChanges();
		}

		getOperationSound(): string {
			return "GeothermalLoop.ogg";
		}

		spreadHeat(heat: number): number {
			const side = this.getFacing();
			const coords = StorageInterface.getRelativeCoords(this, side);
			const tile = this.region.getTileEntity(coords) as IHeatConsumer;
			if (tile && tile.canReceiveHeat && tile.canReceiveHeat(side ^ 1)) {
				return tile.receiveHeat(heat);
			}
			return 0;
		}
	}

	MachineRegistry.registerPrototype(BlockID.fluidHeatGenerator, new FluidHeatGenerator());

	MachineRegistry.createFluidStorageInterface(BlockID.fluidHeatGenerator, {
		slots: {
			"slot1": {input: true},
			"slot2": {output: true}
		},
		isValidInput: function(item: ItemInstance) {
			const liquid = LiquidItemRegistry.getItemLiquid(item.id, item.data, item.extra);
			return liquid && MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid);
		},
		canTransportLiquid: () => false
	});
}