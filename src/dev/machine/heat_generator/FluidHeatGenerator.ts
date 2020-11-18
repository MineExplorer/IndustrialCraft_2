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

var guiFluidHeatGenerator = InventoryWindow("Liquid Fuel Firebox", {
	drawing: [
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE},
		{type: "bitmap", x: 660, y: 102, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE},
		{type: "bitmap", x: 660, y: 176, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE}
	],
	
	elements: {
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75},
		"slot2": {type: "slot", x: 440, y: 183},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 670, y: 112, width: 300, height: 30, text: "Emit: 0"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 670, y: 186, width: 300, height: 30, text: "Max Emit: 0"}
	}
});

namespace Machine {
	export class FluidHeatGenerator
	extends MachineBase {
		hasVerticalRotation: boolean = true;

		defaultValues = {
			output: 0,
			fuel: 0,
			liquid: null,
			isActive: false
		}
		
		getScreenByName() {
			return guiFluidHeatGenerator;
		}

		setupContainer() {
			this.liquidStorage.setLimit(null, 10);

			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (id, count, data) => {
				var empty = LiquidLib.getEmptyItem(id, data);
				if (!empty) return false;
				return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
			});
			this.container.setSlotAddTransferPolicy("slot2", () => 0);
		}
		
		getLiquidFromItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance, byHand?: boolean) {
			return MachineRegistry.getLiquidFromItem.call(this, liquid, inputItem, outputItem, byHand);
		}
		
		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
			if (Entity.getSneaking(player)) {
				let liquid = this.liquidStorage.getLiquidStored();
				return this.getLiquidFromItem(liquid, item, new ItemStack(0, 0, 0), true);
			}
			if (ICTool.isValidWrench(item)) {
				ICTool.rotateMachine(this, coords.side, item, player)
				return true;
			}
			return super.onItemUse(coords, item, player);
		}
		
		tick(): void {
			StorageInterface.checkHoppers(this);
			var liquid = this.liquidStorage.getLiquidStored();
			var slot1 = this.container.getSlot("slot1");
			var slot2 = this.container.getSlot("slot2");
			this.getLiquidFromItem(liquid, slot1, slot2);
			
			var fuel = MachineRecipeRegistry.getRecipeResult("fluidFuel", this.data.liquid || liquid);
			if (fuel && this.data.fuel <= 0 && this.liquidStorage.getAmount(liquid).toFixed(3) >= fuel.amount/1000 && this.spreadHeat(fuel.power*2)) {
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
				//this.startPlaySound();
			}
			else {
				this.data.liquid = null;
				//this.stopPlaySound();
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
			var side = this.getFacing();
			var coords = StorageInterface.getRelativeCoords(this, side);
			var TE = World.getTileEntity(coords.x, coords.y, coords.z, this.blockSource);
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
			var empty = LiquidLib.getEmptyItem(item.id, item.data);
			if (!empty) return false;
			return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
		},
		canReceiveLiquid: (liquid: string) => MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid),
		canTransportLiquid: (liquid: string) => false
	});
}