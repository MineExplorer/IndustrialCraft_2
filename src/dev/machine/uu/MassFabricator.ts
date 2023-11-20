BlockRegistry.createBlock("massFabricator", [
	{name: "Mass Fabricator", texture: [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]], inCreative: true}
], "machine");

TileRenderer.setStandardModelWithRotation(BlockID.massFabricator, 2, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.massFabricator, 2, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 1], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);
TileRenderer.setRotationFunction(BlockID.massFabricator);

ItemRegistry.setRarity(BlockID.massFabricator, EnumRarity.RARE);
ItemName.addTierTooltip("massFabricator", 4);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.massFabricator, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['b', BlockID.machineBlockAdvanced, 0, 'x', 348, 0, 'a', ItemID.circuitAdvanced, 0, '#', ItemID.storageLapotronCrystal, -1]);
});

let ENERGY_PER_MATTER = 1000000;

const guiMassFabricator = MachineRegistry.createInventoryWindow("Mass Fabricator", {
	drawing: [
		{type: "bitmap", x: 850, y: 190, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"energyScale": {type: "scale", x: 850, y: 190, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"matterSlot": {type: "slot", x: 821, y: 75, size: 100},
		"catalyserSlot": {type: "slot", x: 841, y: 252},
		"textInfo1": {type: "text", x: 542, y: 142, width: 200, height: 30, text: "Progress:"},
		"textInfo2": {type: "text", x: 542, y: 177, width: 200, height: 30, text: "0%"},
		"textInfo3": {type: "text", x: 542, y: 212, width: 200, height: 30, text: " "},
		"textInfo4": {type: "text", x: 542, y: 239, width: 200, height: 30, text: " "},
	}
});

namespace Machine {
	export class MassFabricator extends ElectricMachine {
		defaultValues = {
			energy: 0,
			progress: 0,
			catalyser: 0,
			isEnabled: true
		}

		defaultDrop = BlockID.machineBlockAdvanced;

		getTier(): number {
			return 4;
		}

		getScreenByName(): UI.IWindow {
			return guiMassFabricator;
		}

		setupContainer(): void {
			StorageInterface.setSlotValidatePolicy(this.container, "catalyserSlot", (name, id) => {
				return MachineRecipeRegistry.hasRecipeFor("catalyser", id);
			});
			this.container.setSlotAddTransferPolicy("matterSlot", () => 0);
		}

		onTick(): void {
			StorageInterface.checkHoppers(this);

			if (this.data.isEnabled && this.data.energy > 0) {
				this.setActive(true);
				if (this.data.catalyser < Math.max(1000, this.data.energy)) {
					const catalyserSlot = this.container.getSlot("catalyserSlot");
					const catalyserData = MachineRecipeRegistry.getRecipeResult("catalyser", catalyserSlot.id);
					if (catalyserData) {
						this.data.catalyser += catalyserData.input;
						this.decreaseSlot(catalyserSlot, 1);
					}
				}
				if (this.data.catalyser > 0) {
					this.container.setText("textInfo3", "Catalyser:");
					this.container.setText("textInfo4", Math.floor(this.data.catalyser));
					const transfer = Math.min((ENERGY_PER_MATTER - this.data.progress) / 6, Math.min(this.data.catalyser, this.data.energy));
					this.data.progress += transfer * 6;
					this.data.energy -= transfer;
					this.data.catalyser -= transfer;
					if (World.getThreadTime() % 40 == 0 && transfer > 0) {
						SoundManager.playSoundAtBlock(this, "MassFabScrapSolo.ogg", 1);
					}
				}
				else {
					this.container.setText("textInfo3", "");
					this.container.setText("textInfo4", "");
				}
				const transfer = Math.min(ENERGY_PER_MATTER - this.data.progress, this.data.energy);
				this.data.progress += transfer;
				this.data.energy -= transfer;
			}
			else {
				this.setActive(false);
			}
			if (this.data.progress >= ENERGY_PER_MATTER) {
				const matterSlot = this.container.getSlot("matterSlot");
				if (matterSlot.id == ItemID.matter && matterSlot.count < 64 || matterSlot.id == 0) {
					matterSlot.setSlot(ItemID.matter, matterSlot.count + 1, 0);
					this.data.progress = 0;
				}
			}

			const relProgress = this.data.progress / ENERGY_PER_MATTER;
			this.container.setScale("energyScale", relProgress);
			this.container.setText("textInfo2", Math.floor(100 * relProgress) + "%");
			this.container.sendChanges();
		}

		onRedstoneUpdate(signal: number): void {
			this.data.isEnabled = (signal == 0);
		}

		getOperationSound(): string {
			return "MassFabLoop.ogg";
		}

		getEnergyStorage(): number {
			return ENERGY_PER_MATTER - this.data.progress;
		}

		getExplosionPower(): number {
			return 15;
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
	}

	MachineRegistry.registerPrototype(BlockID.massFabricator, new MassFabricator());

	StorageInterface.createInterface(BlockID.massFabricator, {
		slots: {
			"catalyserSlot": {input: true},
			"matterSlot": {output: true}
		},
		isValidInput: function(item) {
			return MachineRecipeRegistry.hasRecipeFor("catalyser", item.id);
		}
	});
}