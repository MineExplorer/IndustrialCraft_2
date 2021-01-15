IDRegistry.genBlockID("solarPanel");
Block.createBlock("solarPanel", [
	{name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel", 0], ["machine", 0], ["machine", 0], ["machine", 0], ["machine", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.solarPanel, "stone", 1, true);

MachineRegistry.setMachineDrop("solarPanel", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.solarPanel, count: 1, data: 0}, [
		"aaa",
		"xxx",
		"b#b"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustCoal, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, -1]);
});

let guiSolarPanel = InventoryWindow("Solar Panel", {
	elements: {
		"slotEnergy": {type: "slot", x: 600, y: 130},
		"sun": {type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_SCALE}
	}
});

namespace Machine {
	export class SolarGenerator
	extends Generator {
		defaultValues = {
			energy: 0,
			canSeeSky: false
		}

		getScreenByName() {
			return guiSolarPanel;
		}

		init(): void {
			super.init();
			this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
		}

		setupContainer() {
			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => ChargeItemRegistry.isValidItem(id, "Eu", 1));
		}

		tick(): void {
			if (World.getThreadTime() % 100 == 0) {
				this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
			}
			if (this.data.canSeeSky && this.region.getLightLevel(this.x, this.y + 1, this.z) == 15) {
				this.data.energy = 1;
				this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot("slotEnergy"), "Eu", 1, 1);
				this.container.sendEvent("setSolarElement", "on");
				this.container.sendChanges();
			} else {
				this.container.sendEvent("setSolarElement", "off")
			}
		}

		getEnergyStorage(): number {
			return 1;
		}

		@ContainerEvent(Side.Client)
		setSolarElement(container: any, window: any, content: any, data: string) {
			if (content) {
				content.elements["sun"].bitmap = "sun_" + data;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.solarPanel, new SolarGenerator());
}