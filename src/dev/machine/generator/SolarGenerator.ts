BlockRegistry.createBlock("solarPanel", [
	{name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel", 0], ["machine", 0], ["machine", 0], ["machine", 0], ["machine", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.solarPanel, "stone", 1);
ItemName.addProductionTooltip(BlockID.solarPanel, "EU", EnergyProductionModifiers.SolarPanel);

Callback.addCallback("PreLoaded", function() {
	if (IC2Config.hardRecipes) {
		Recipes.addShaped({id: BlockID.solarPanel, count: 1, data: 0}, [
			"aaa",
			"xxx",
			"b#b"
		], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustLapis, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, -1]);
	}
	else {
		Recipes.addShaped({id: BlockID.solarPanel, count: 1, data: 0}, [
			"aaa",
			"xxx",
			"b#b"
		], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustCoal, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, -1]);
	}
});

const guiSolarPanel = MachineRegistry.createInventoryWindow("Solar Panel", {
	elements: {
		"slotEnergy": {type: "slot", x: 600, y: 130},
		"sun": {type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_SCALE}
	}
});

namespace Machine {
	export class SolarGenerator extends Generator {
		defaultValues = {
			energy: 0,
			canSeeSky: false
		}

		defaultDrop = BlockID.machineBlockBasic;

		getScreenByName(): UI.IWindow {
			return guiSolarPanel;
		}

		onInit(): void {
			super.onInit();
			this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
		}

		setupContainer(): void {
			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => ChargeItemRegistry.isValidItem(id, "Eu", 1));
		}

		onTick(): void {
			if (World.getThreadTime() % 100 == 0) {
				this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
			}
			if (this.data.canSeeSky && this.region.getLightLevel(this.x, this.y + 1, this.z) == 15) {
				this.data.energy = EnergyProductionModifiers.SolarPanel;
				this.chargeSlot("slotEnergy");
				this.container.sendEvent("setSolarElement", "on");
				this.container.sendChanges();
			} else {
				this.data.energy = 0;
				this.container.sendEvent("setSolarElement", "off")
			}
		}

		getEnergyStorage(): number {
			return 32;
		}

		/** @deprecated Container event, shouldn't be called */
		@ContainerEvent(Side.Client)
		setSolarElement(container: ItemContainer, window: any, content: any, data: string): void {
			if (content) {
				content.elements["sun"].bitmap = "sun_" + data;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.solarPanel, new SolarGenerator());
}