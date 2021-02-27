IDRegistry.genBlockID("pump");
Block.createBlock("pump", [
	{name: "Pump", texture: [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.pump, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.pump, 2, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.pump, 2, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 1], ["pump_side", 1], ["pump_side", 1]]);
TileRenderer.setRotationFunction(BlockID.pump);

ItemName.addTierTooltip("pump", 1);

MachineRegistry.setMachineDrop("pump", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.pump, count: 1, data: 0}, [
		"cxc",
		"c#c",
		"bab"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'a', ItemID.treetap, 0, 'b', BlockID.miningPipe, 0, 'c', ItemID.cellEmpty, 0]);
});


const guiPump = InventoryWindow("Pump", {
	drawing: [
		{type: "bitmap", x: 493, y: 149, bitmap: "extractor_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 407, y: 127, bitmap: "energy_small_background", scale: GUI_SCALE},
		{type: "bitmap", x: 602, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 675, y: 152, bitmap: "pump_arrow", scale: GUI_SCALE},
	],

	elements: {
		"progressScale": {type: "scale", x: 493, y: 149, direction: 0, bitmap: "extractor_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 407, y: 127, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 400 + 67*GUI_SCALE, y: 50 + 16*GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slotEnergy": {type: "slot", x: 400, y: 50 + 39*GUI_SCALE},
		"slotLiquid1": {type: "slot", x: 400 + 91*GUI_SCALE, y: 50 + 12*GUI_SCALE},
		"slotLiquid2": {type: "slot", x: 400 + 125*GUI_SCALE, y: 50 + 29*GUI_SCALE},
		"slotUpgrade1": {type: "slot", x: 880, y: 50 + 2*GUI_SCALE},
		"slotUpgrade2": {type: "slot", x: 880, y: 50 + 21*GUI_SCALE},
		"slotUpgrade3": {type: "slot", x: 880, y: 50 + 40*GUI_SCALE},
		"slotUpgrade4": {type: "slot", x: 880, y: 50 + 59*GUI_SCALE},
	}
});

namespace Machine {
	export class Pump
	extends ElectricMachine {
		defaultValues = {
			energy: 0,
			tier: 1,
			energy_storage: 800,
			energy_consume: 1,
			work_time: 20,
			progress: 0,
			coords: null
		}

		upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector"];

		getScreenByName() {
			return guiPump;
		}

		getTier(): number {
			return this.data.tier;
		}

		resetValues(): void {
			this.data.tier = this.defaultValues.tier;
			this.data.energy_storage = this.defaultValues.energy_storage;
			this.data.energy_consume = this.defaultValues.energy_consume;
			this.data.work_time = this.defaultValues.work_time;
		}

		addLiquidToItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance): void {
			return MachineRegistry.addLiquidToItem.call(this, liquid, inputItem, outputItem);
		}

		setupContainer(): void {
			this.liquidStorage.setLimit("water", 8);
			this.liquidStorage.setLimit("lava", 8);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotLiquid1") return !!LiquidLib.getFullItem(id, data, "water");
				if (name == "slotLiquid2") return false;
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				return UpgradeAPI.isValidUpgrade(id, this);
			});
		}

		getLiquidType(liquid: string, block: Tile): string {
			if ((!liquid || liquid=="water") && (block.id == 8 || block.id == 9)) {
				return "water";
			}
			if ((!liquid || liquid=="lava") && (block.id == 10 || block.id == 11)) {
				return "lava";
			}
			return null;
		}

		recursiveSearch(liquid: string, x: number, y: number, z: number, map: {}): Vector {
			let block = this.region.getBlock(x, y, z);
			let scoords = x+':'+y+':'+z;
			if (!map[scoords] && Math.abs(this.x - x) <= 64 && Math.abs(this.z - z) <= 64 && this.getLiquidType(liquid, block)) {
				if (block.data == 0) return new Vector3(x, y, z);
				map[scoords] = true;
				return this.recursiveSearch(liquid, x, y+1, z, map) ||
				this.recursiveSearch(liquid, x+1, y, z, map) ||
				this.recursiveSearch(liquid, x-1, y, z, map) ||
				this.recursiveSearch(liquid, x, y, z+1, map) ||
				this.recursiveSearch(liquid, x, y, z-1, map);
			}
			return null;
		}

		tick(): void {
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);

			let newActive = false;
			let liquid = this.liquidStorage.getLiquidStored();
			if (this.y > 0 && this.liquidStorage.getAmount(liquid) <= 7 && this.data.energy >= this.data.energy_consume) {
				if (this.data.progress == 0) {
					this.data.coords = this.recursiveSearch(liquid, this.x, this.y-1, this.z, {});
				}
				if (this.data.coords) {
					newActive = true;
					this.data.energy -= this.data.energy_consume;
					this.data.progress += 1/this.data.work_time;
					if (+this.data.progress.toFixed(3) >= 1) {
						let coords = this.data.coords;
						let block = this.region.getBlock(coords);
						liquid = this.getLiquidType(liquid, block);
						if (liquid && block.data == 0) {
							this.region.setBlock(coords, 0, 0);
							this.liquidStorage.addLiquid(liquid, 1);
						}
						this.data.progress = 0;
					}
				}
			}
			else {
				this.data.progress = 0;
			}
			this.setActive(newActive);

			let slot1 = this.container.getSlot("slotLiquid1");
			let slot2 = this.container.getSlot("slotLiquid2");
			this.addLiquidToItem(liquid, slot1, slot2);

			const energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

			this.container.setScale("progressScale", this.data.progress);
			this.liquidStorage.updateUiScale("liquidScale", liquid);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.sendChanges();
		}

		getOperationSound(): string {
			return "PumpOp.ogg";
		}

		getEnergyStorage(): number {
			return this.data.energy_storage;
		}
	}

	MachineRegistry.registerPrototype(BlockID.pump, new Pump());

	StorageInterface.createInterface(BlockID.pump, {
		slots: {
			"slotLiquid1": {input: true},
			"slotLiquid2": {output: true}
		},
		isValidInput: (item: ItemInstance) => (
			!!LiquidLib.getFullItem(item.id, item.data, "water")
		),
		canReceiveLiquid: () => false,
		canTransportLiquid: () => true
	});
}