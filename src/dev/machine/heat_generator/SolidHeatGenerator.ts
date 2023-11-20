BlockRegistry.createBlock("solidHeatGenerator", [
	{name: "Solid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.solidHeatGenerator, "stone", 1);

TileRenderer.setHandAndUiModel(BlockID.solidHeatGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.setStandardModel(BlockID.solidHeatGenerator, 0, [["heat_pipe", 0], ["generator", 0], ["machine_bottom", 0], ["machine_top", 0], ["heat_generator_side", 2], ["heat_generator_side", 2]]);
TileRenderer.setStandardModel(BlockID.solidHeatGenerator, 1, [["generator", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["heat_generator_side", 2], ["heat_generator_side", 2]]);
TileRenderer.setStandardModelWithRotation(BlockID.solidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 0, [["heat_pipe", 1], ["generator", 0], ["machine_bottom", 0], ["machine_top", 0], ["heat_generator_side", 3], ["heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 1, [["generator", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["heat_generator_side", 3], ["heat_generator_side", 3]]);
TileRenderer.registerModelWithRotation(BlockID.solidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["generator", 1], ["heat_pipe", 1], ["heat_generator_side", 1], ["heat_generator_side", 1]]);
TileRenderer.setRotationFunction(BlockID.solidHeatGenerator, true);

Callback.addCallback("PreLoaded", function() {
	Item.addCreativeGroup("IC2HeatGenerators", Translation.translate("Heat Generators"), [
		BlockID.solidHeatGenerator,
		BlockID.electricHeatGenerator,
		BlockID.fluidHeatGenerator,
		BlockID.rtHeatGenerator
	]);

	Recipes.addShaped({id: BlockID.solidHeatGenerator, count: 1, data: 0}, [
		"a",
		"x",
		"f"
	], ['a', ItemID.heatConductor, 0, 'x', BlockID.machineBlockBasic, 0, 'f', 61, -1]);

	Recipes.addShaped({id: BlockID.solidHeatGenerator, count: 1, data: 0}, [
		" a ",
		"ppp",
		" f "
	], ['a', ItemID.heatConductor, 0, 'p', ItemID.plateIron, 0, 'f', BlockID.ironFurnace, 0]);
});


const guiSolidHeatGenerator = MachineRegistry.createInventoryWindow("Solid Fuel Firebox", {
	drawing: [
		{type: "bitmap", x: 450, y: 160, bitmap: "fire_background", scale: GUI_SCALE},
		{type: "bitmap", x: 521, y: 212, bitmap: "shovel_image", scale: GUI_SCALE+1},
		{type: "bitmap", x: 441, y: 330, bitmap: "heat_generator_info", scale: GUI_SCALE}
	],

	elements: {
		"slotFuel": {type: "slot", x: 441, y: 212},
		"slotAshes": {type: "slot", x: 591, y: 212},
		"burningScale": {type: "scale", x: 450, y: 160, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 500, y: 344, width: 300, height: 30, text: "0    /"},
		"textInfo2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 600, y: 344, width: 300, height: 30, text: "20"}
	}
});

namespace Machine {
	export class SolidHeatGenerator extends MachineBase {
		defaultValues ={
			burn: 0,
			burnMax: 0,
			output: 0
		}

		getScreenByName(): UI.IWindow {
			return guiSolidHeatGenerator;
		}

		setupContainer(): void {
			StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", (name, id, count, data) => {
				return Recipes.getFuelBurnDuration(id, data) > 0;
			});
			this.container.setSlotAddTransferPolicy("slotAshes", () => 0);
		}

		getFuel(fuelSlot: ItemInstance): number {
			if (fuelSlot.id > 0) {
				const burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
				if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
					return burn;
				}
			}
			return 0;
		}

		spreadHeat(): number {
			const side = this.getFacing();
			const coords = StorageInterface.getRelativeCoords(this, side);
			const tile = this.region.getTileEntity(coords) as IHeatConsumer;
			if (tile && tile.canReceiveHeat && tile.canReceiveHeat(side ^ 1)) {
				return this.data.output = tile.receiveHeat(20);
			}
			return 0;
		}

		onTick(): void {
			StorageInterface.checkHoppers(this);

			this.data.output = 0;
			const slot = this.container.getSlot("slotAshes");
			if (this.data.burn <= 0) {
				const fuelSlot = this.container.getSlot("slotFuel");
				const burn = this.getFuel(fuelSlot) / 4;
				if (burn && ((slot.id == ItemID.ashes && slot.count < 64) || slot.id == 0) && this.spreadHeat()) {
					this.setActive(true);
					this.data.burnMax = burn;
					this.data.burn = burn - 1;
					this.decreaseSlot(fuelSlot, 1);
				} else {
					this.setActive(false);
				}
			}
			else {
				this.data.burn--;
				if (this.data.burn == 0 && Math.random() < 0.5) {
					slot.setSlot(ItemID.ashes, slot.count + 1, 0);
				}
				this.spreadHeat();
			}

			let outputText = this.data.output.toString();
			for (let i = outputText.length; i < 6; i++) {
				outputText += " ";
			}
			this.container.setText("textInfo1", outputText + "/");
			this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
			this.container.sendChanges();
		}

		canRotate(): boolean {
			return true;
		}
	}

	MachineRegistry.registerPrototype(BlockID.solidHeatGenerator, new SolidHeatGenerator());

	StorageInterface.createInterface(BlockID.solidHeatGenerator, {
		slots: {
			"slotFuel": {input: true},
			"slotAshes": {output: true}
		},
		isValidInput: (item: ItemInstance) => Recipes.getFuelBurnDuration(item.id, item.data) > 0
	});
}