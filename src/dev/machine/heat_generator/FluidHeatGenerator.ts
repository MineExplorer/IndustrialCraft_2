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

MachineRegistry.setMachineDrop("fluidHeatGenerator");

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
	export class FluidHeatGenerator
	extends MachineBase {
		readonly hasVerticalRotation: boolean = true;

		defaultValues = {
			output: 0,
			fuel: 0,
			liquid: null
		}

		getScreenByName() {
			return guiFluidHeatGenerator;
		}

		setupContainer(): void {
			this.liquidStorage.setLimit(null, 10);

			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id, count, data) => {
				let empty = LiquidLib.getEmptyItem(id, data);
				if (!empty) return false;
				return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
			});
			this.container.setSlotAddTransferPolicy("slot2", () => 0);
		}

		getLiquidFromItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance, byHand?: boolean): boolean {
			return MachineRegistry.getLiquidFromItem.call(this, liquid, inputItem, outputItem, byHand);
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				let liquid = this.liquidStorage.getLiquidStored();
				return this.getLiquidFromItem(liquid, item, new ItemStack(), true);
			}
			if (ICTool.isValidWrench(item)) {
				ICTool.rotateMachine(this, coords.side, item, player)
				return true;
			}
			return super.onItemUse(coords, item, player);
		}

		tick(): void {
			StorageInterface.checkHoppers(this);
			let liquid = this.liquidStorage.getLiquidStored();
			let slot1 = this.container.getSlot("slot1");
			let slot2 = this.container.getSlot("slot2");
			this.getLiquidFromItem(liquid, slot1, slot2);

			let fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", this.data.liquid || liquid);
			if (fuel && this.data.fuel <= 0 && this.liquidStorage.getAmount(liquid).toFixed(3) as any >= fuel.amount/1000 && this.spreadHeat(fuel.power*2)) {
				this.liquidStorage.getLiquid(liquid, fuel.amount/1000);
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
			this.liquidStorage.updateUiScale("liquidScale", liquid);
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
			let empty = LiquidLib.getEmptyItem(item.id, item.data);
			if (!empty) return false;
			return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
		},
		canReceiveLiquid: (liquid: string) => MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid),
		canTransportLiquid: (liquid: string) => false
	});
}