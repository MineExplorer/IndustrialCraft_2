BlockRegistry.createBlock("solarDistiller", [
	{name: "Solar Distiller", texture: [["ic_machine_bottom", 0], ["solar_distiller", 0], ["solar_distiller", 0], ["solar_distiller", 0], ["solar_distiller", 0], ["solar_distiller", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.solarDistiller, "stone", 1);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.solarDistiller, count: 1, data: 0}, [
		"aaa",
		"a a",
		"c#c"
	], ['#', BlockID.machineBlockBasic, 0, 'a', 20, -1, 'c', ItemID.cellEmpty, 0]);
});

namespace Machine {
	const guiSolarDistiller = MachineRegistry.createInventoryWindow("Solar Distiller", {
		drawing: [
			{type: "bitmap", x: 360 + 34*GUI_SCALE_NEW, y: 50 + 26*GUI_SCALE_NEW, bitmap: "icpe.solar_distiller_background", scale: GUI_SCALE_NEW}
		],
		elements: {
			"progressScale": {type: "scale", x: 360 + 36*GUI_SCALE_NEW, y: 50 + 26*GUI_SCALE_NEW, direction: 0, bitmap: "icpe.solar_distiller_progress_bar", scale: GUI_SCALE_NEW},
			"liquidInputScale": {type: "scale", x: 360 + 37*GUI_SCALE_NEW, y: 50 + 43*GUI_SCALE_NEW, direction: 1, bitmap: "icpe.solar_distiller_input_scale", scale: GUI_SCALE_NEW},
			"liquidOutputScale": {type: "scale", x: 360 + 115*GUI_SCALE_NEW, y: 50 + 55*GUI_SCALE_NEW, direction: 1, bitmap: "icpe.solar_distiller_output_scale", scale: GUI_SCALE_NEW},
			"slotInput1": {type: "slot", x: 360 + 16*GUI_SCALE_NEW, y: 50 + 26*GUI_SCALE_NEW, size: 54},
			"slotOutput1": {type: "slot", x: 360 + 16*GUI_SCALE_NEW, y: 50 + 44*GUI_SCALE_NEW, size: 54},
			"slotInput2": {type: "slot", x: 360 + 135*GUI_SCALE_NEW, y: 50 + 63*GUI_SCALE_NEW, size: 54},
			"slotOutput2": {type: "slot", x: 360 + 135*GUI_SCALE_NEW, y: 50 + 81*GUI_SCALE_NEW, size: 54},
			"slotUpgrade1": {type: "slot", x: 360 + 151*GUI_SCALE_NEW, y: 50 + 7*GUI_SCALE_NEW, size: 54},
			"slotUpgrade2": {type: "slot", x: 360 + 151*GUI_SCALE_NEW, y: 50 + 25*GUI_SCALE_NEW, size: 54},
		}
	});

	export class SolarDistiller extends MachineBase {
		inputTank: BlockEngine.LiquidTank;
		outputTank: BlockEngine.LiquidTank;

		defaultValues = {
			canSeeSky: false
		}

		defaultDrop = BlockID.machineBlockBasic;
		upgrades = ["itemEjector", "itemPulling", "fluidPulling", "fluidEjector"];

		upgradeSet?: UpgradeAPI.UpgradeSet;

		getScreenByName(): UI.IWindow {
			return guiSolarDistiller;
		}

		onInit(): void {
			super.onInit();
			this.upgradeSet = UpgradeAPI.getUpgradeSet(this);
			this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
		}

		setupContainer(): void {
			this.inputTank = this.addLiquidTank("inputTank", 10000);
			this.outputTank = this.addLiquidTank("outputTank", 10000);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data, extra) => {
				if (name == "slotInput1") return LiquidItemRegistry.getItemLiquid(id, data, extra) == "water";
				if (name == "slotInput2") return LiquidItemRegistry.canBeFilledWithLiquid(id, data, extra, "distilled_water");
				if (name.startsWith("slotUpgrade")) return UpgradeAPI.isValidUpgrade(id, this);
				return false;
			});
		}

		onTick(): void {
			UpgradeAPI.performUpgrades(this.upgradeSet);
			StorageInterface.checkHoppers(this);
			
			if (World.getThreadTime() % 100 == 0) {
				this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
			}
			if (this.data.canSeeSky && this.region.getLightLevel(this.x, this.y + 1, this.z) == 15) {
				// TODO
			}

			const slotInput1 = this.container.getSlot("slotInput1");
			const slotOutput1 = this.container.getSlot("slotOutput1");
			this.inputTank.getLiquidFromItem(slotInput1, slotOutput1);

			const slotInput2 = this.container.getSlot("slotInput2");
			const slotOutput2 = this.container.getSlot("slotOutput2");
			this.outputTank.addLiquidToItem(slotInput2, slotOutput2);

			this.inputTank.updateUiScale("liquidInputScale");
			this.outputTank.updateUiScale("liquidOutputScale");
			this.container.sendChanges();
		}
	}

	MachineRegistry.registerPrototype(BlockID.solarDistiller, new SolarDistiller());

	MachineRegistry.createFluidStorageInterface(BlockID.solarDistiller, {
		slots: {
			"slotInput1": {input: true, isValid: (item) => LiquidItemRegistry.getItemLiquid(item.id, item.data, item.extra) == "water"},
			"slotInput2": {input: true, isValid: (item) => LiquidItemRegistry.canBeFilledWithLiquid(item.id, item.data, item.extra, "distilled_water")},
			"slotOutput1": {output: true},
			"slotOutput2": {output: true}
		},
		getInputTank(side, tileEntity: SolarDistiller = this.tileEntity) {
			return tileEntity.inputTank
		},
		getOutputTank(side, tileEntity: SolarDistiller = this.tileEntity) {
			return tileEntity.outputTank;
		},
		canReceiveLiquid(liquid) {
			return liquid == "water";
		}
	});
}