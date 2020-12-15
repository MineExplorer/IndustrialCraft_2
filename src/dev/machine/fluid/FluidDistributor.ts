IDRegistry.genBlockID("fluidDistributor");
Block.createBlock("fluidDistributor", [
	{name: "Fluid Distributor", texture: [["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.fluidDistributor, "stone", 1, true);

TileRenderer.setHandAndUiModel(BlockID.fluidDistributor, 0, [["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.fluidDistributor, 0, [["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1]], true);
TileRenderer.registerModelWithRotation(BlockID.fluidDistributor, 0, [["fluid_distributor", 0], ["fluid_distributor", 0], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 0]], true);
TileRenderer.setRotationFunction("fluidDistributor", true);

MachineRegistry.setMachineDrop("fluidDistributor", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.fluidDistributor, count: 1, data: 0}, [
		"a",
		"#",
		"c"
	], ['#', BlockID.machineBlockBasic, 0, 'a', ItemID.upgradeFluidPulling, 0, 'c', ItemID.cellEmpty, 0]);
});

let guiFluidDistributor = InventoryWindow("Fluid Distributor", {
	drawing: [
		{type: "bitmap", x: 400 + 3*GUI_SCALE, y: 146, bitmap: "fluid_distributor_background", scale: GUI_SCALE}
	],

	elements: {
		"liquidScale": {type: "scale", x: 480, y: 50 + 34*GUI_SCALE, direction: 1, bitmap: "fluid_dustributor_bar", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 47*GUI_SCALE},
		"slot2": {type: "slot", x: 400 + 3*GUI_SCALE, y: 50 + 66*GUI_SCALE},
		"button_switch": {type: "button", x: 400 + 112*GUI_SCALE, y: 50 + 53*GUI_SCALE, bitmap: "fluid_distributor_button", scale: GUI_SCALE, /*clicker: {
			onClick: function(container, tile) {
				tile.data.inverted = !tile.data.inverted;
				TileRenderer.mapAtCoords(tile.x, tile.y, tile.z, BlockID.fluidDistributor, tile.data.meta + 6*tile.data.inverted);
			}
		}*/},
		"text1": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 400 + 107*GUI_SCALE, y: 50+42*GUI_SCALE, width: 128, height: 48, text: Translation.translate("Mode:")},
		"text2": {type: "text", font: {size: 24, color: Color.parseColor("#57c4da")}, x: 400 + 92*GUI_SCALE, y: 50+66*GUI_SCALE, width: 256, height: 48, text: Translation.translate("Distribute")},
	}
});

Callback.addCallback("LevelLoaded", function() {
	MachineRegistry.updateGuiHeader(guiFluidDistributor, "Fluid Distributor");
});

namespace Machine {
	export class FluidDistributor
	extends MachineBase {
		defaultValues = {
			inverted: false
		}

		getScreenByName() {
			return guiFluidDistributor;
		}

		setupContainer(): void {
			this.liquidStorage.setLimit(null, 1);

			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id, amount, data) => {
				return !!LiquidLib.getFullItem(id, data, "water");
			});
			this.container.setSlotAddTransferPolicy("slotLiquid2", () => 0);
		}

		init(): void {
			this.region = new WorldRegion(this.blockSource);
			if (this.data.meta !== undefined) {
				Logger.Log(`Update tile with ID ${this.blockID}, data ${this.data.meta}`, "IC2");
				let facing = this.data.meta;
				this.setFacing(facing);
				delete this.data.meta;
			}
			this.setupContainer();
			this.sendPacket("renderModel", {isActive: this.data.inverted});
		}

		addLiquidToItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance): void {
			return MachineRegistry.addLiquidToItem.call(this, liquid, inputItem, outputItem);
		}

		tick(): void {
			if (this.data.inverted) {
				this.container.setText("text2", Translation.translate("Concentrate"));
			} else {
				this.container.setText("text2", Translation.translate("Distribute"));
			}

			let liquid = this.liquidStorage.getLiquidStored();
			let slot1 = this.container.getSlot("slot1");
			let slot2 = this.container.getSlot("slot2");
			this.addLiquidToItem(liquid, slot1, slot2);

			liquid = this.liquidStorage.getLiquidStored();
			if (liquid) {
				let facing = this.getFacing();
				for (let side = 0; side < 6; side++) {
					if (this.data.inverted == (side != facing)) continue;
					let storage = StorageInterface.getNeighbourLiquidStorage(this.blockSource, this, side);
					if (storage) {
						StorageInterface.transportLiquid(liquid, 0.25, this, storage, side);
					}
				}
			}

			this.liquidStorage.updateUiScale("liquidScale", liquid);
			this.container.sendChanges();
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (ICTool.isValidWrench(item)) {
				ICTool.rotateMachine(this, coords.side, item, player)
				return true;
			}
			return super.onItemUse(coords, item, player);
		}
	}

	MachineRegistry.registerPrototype(BlockID.fluidDistributor, new FluidDistributor());

	StorageInterface.createInterface(BlockID.fluidDistributor, {
		slots: {
			"slot1": {input: true},
			"slot2": {output: true}
		},
		isValidInput: (item: ItemInstance) => {
			return !!LiquidLib.getFullItem(item.id, item.data, "water")
		},
		canReceiveLiquid: function(liquid: string, side: number): boolean {
			let data = this.tileEntity.data;
			// @ts-ignore
			return (side == this.tileEntity.getFacing()) ^ data.inverted;
		},
		canTransportLiquid: () => true
	});
}