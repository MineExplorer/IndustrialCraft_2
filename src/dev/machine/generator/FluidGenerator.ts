BlockRegistry.createBlock("semifluidGenerator", [
	{name: "Semifluid Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.semifluidGenerator, "stone", 1);
ItemName.addProductionTooltip(BlockID.semifluidGenerator, "EU", 8, 16);

TileRenderer.setStandardModelWithRotation(BlockID.semifluidGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.semifluidGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 1], ["semifluid_generator_side", 1], ["semifluid_generator_side", 1]]);
TileRenderer.setRotationFunction(BlockID.semifluidGenerator);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.semifluidGenerator, count: 1, data: 0}, [
		"pcp",
		"cxc",
		"pcp"
	], ['x', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});

MachineRecipeRegistry.registerFluidRecipes("fluidFuel", {
	"biomass": {power: 8, amount: 20},
	"oil": {power: 8, amount: 10},
	"biogas": {power: 16, amount: 10},
	"ethanol": {power: 16, amount: 10},
});

const guiSemifluidGenerator = MachineRegistry.createInventoryWindow("Semifluid Generator", {
	drawing: [
		{type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE}
	],

	elements: {
		"scaleArrow": {type: "image", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE, clicker: {
			onClick: () => {
				RV?.RecipeTypeRegistry.openRecipePage("icpe_fluidFuel");
			}
		}},
		"energyScale": {type: "scale", x: 702 + 4*GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75},
		"slot2": {type: "slot", x: 440, y: 183},
		"slotEnergy": {type: "slot", x: 725, y: 165}
	}
});

namespace Machine {
	export class FluidGenerator extends Generator {
		liquidTank: BlockEngine.LiquidTank;
		defaultValues = {
			energy: 0,
			fuel: 0,
			liquid: null,
		}

		getScreenByName(): UI.IWindow {
			return guiSemifluidGenerator;
		}

		setupContainer(): void {
			const liquidFuel = MachineRecipeRegistry.requireFluidRecipes("fluidFuel");
			this.liquidTank = this.addLiquidTank("fluid", 10000, Object.keys(liquidFuel));

			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => {
				return ChargeItemRegistry.isValidItem(id, "Eu", 1);
			});

			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id, count, data, extra) => {
				const liquid = LiquidItemRegistry.getItemLiquid(id, data, extra);
				return liquid && MachineRecipeRegistry.hasRecipeFor("fluidFuel", liquid);
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

		getFuel(liquid: string): {power: number, amount: number} {
			return MachineRecipeRegistry.getFluidRecipe("fluidFuel", liquid);
		}

		onTick(): void {
			StorageInterface.checkHoppers(this);

			const slot1 = this.container.getSlot("slot1");
			const slot2 = this.container.getSlot("slot2");
			this.liquidTank.getLiquidFromItem(slot1, slot2);

			if (this.data.fuel <= 0) {
				const liquid = this.liquidTank.getLiquidStored();
				const fuel = this.getFuel(liquid);
				const freeCapacity = this.getEnergyStorage() - this.data.energy;
				if (fuel && this.liquidTank.getAmount() >= fuel.amount && fuel.power * fuel.amount <= freeCapacity) {
					this.liquidTank.getLiquid(fuel.amount);
					this.data.fuel = fuel.amount;
					this.data.liquid = liquid;
				}
			}
			if (this.data.fuel > 0) {
				const fuel = this.getFuel(this.data.liquid);
				this.data.energy += fuel.power;
				this.data.fuel -= fuel.amount / 20;
				this.setActive(true);
			}
			else {
				this.data.liquid = null;
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
			return 1000;
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
	}

	MachineRegistry.registerPrototype(BlockID.semifluidGenerator, new FluidGenerator());

	MachineRegistry.createFluidStorageInterface(BlockID.semifluidGenerator, {
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