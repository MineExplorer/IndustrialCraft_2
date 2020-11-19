IDRegistry.genBlockID("miner");
Block.createBlock("miner", [
	{name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "machine");

TileRenderer.setStandardModelWithRotation(BlockID.miner, 2, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.miner, 2, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 1], ["miner_side", 1], ["miner_side", 1]]);
TileRenderer.setRotationFunction(BlockID.miner);

ItemName.addTierTooltip("miner", 2);

MachineRegistry.setMachineDrop("miner", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.miner, count: 1, data: 0}, [
		"x#x",
		" b ",
		" b "
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', BlockID.miningPipe, 0]);
});


let guiMiner = InventoryWindow("Miner", {
	drawing: [
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotDrill": {type: "slot", x: 441, y: 75, bitmap: "slot_drill"},
		"slotPipe": {type: "slot", x: 541, y: 75},
		"slotScanner": {type: "slot", x: 641, y: 75, bitmap: "slot_scanner"},
		"slotEnergy": {type: "slot", x: 541, y: 212, isValid: MachineRegistry.isValidEUStorage},
	}
});

namespace Machine {
	export class Miner
	extends ElectricMachine {
		constructor() {
			super(2);
		}

		defaultValues = {
			energy: 0,
			x: 0,
			y: 0,
			z: 0,
			scanY: 0,
			scanR: 0,
			progress: 0,
			isActive: false
		}

		getScreenByName() {
			return guiMiner;
		}

		setupContainer() {
			StorageInterface.setSlotValidatePolicy(this.container, "slotDrill", (id, count, data) => {
				return (id == ItemID.drill || id == ItemID.diamondDrill);
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotPipe", (id, count, data) => {
				return (ToolLib.isBlock(id) && !TileEntity.isTileEntityBlock(id));
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotScanner", (id, count, data) => {
				return (id == ItemID.scanner || id == ItemID.scannerAdvanced);
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (id, count, data) => {
				return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
			});
		}
		
		getMiningValues(slot: ItemInstance) {
			if (slot.id == ItemID.drill) return {energy: 6, time: 100}
			return {energy: 20, time: 50}
		}
		
		findOre(level: number): boolean {
			let r = this.data.scanR;
			while (r) {
				if (this.data.x > this.x + r) {
					this.data.x = this.x - r;
					this.data.z++;
				}
				if (this.data.z > this.z + r) break;
				let blockID = this.region.getBlockId(this.data.x, this.data.scanY, this.data.z);
				if (ore_blocks.indexOf(blockID) != -1 && level >= ToolAPI.getBlockDestroyLevel(blockID)) {
					return true;
				}
				this.data.x++;
			}
			return false;
		}
		
		isEmptyBlock(block: Tile): boolean {
			return block.id == 0 || block.id == 51 || block.id >= 8 && block.id <= 11 && block.data > 0;
		}

		canBeDestroyed(blockID: number, level: number): boolean {
			if (ToolAPI.getBlockMaterialName(blockID) != "unbreaking" && level >= ToolAPI.getBlockDestroyLevel(blockID)) {
				return true;
			}
			return false;
		}
		
		findPath(x: number, y: number, z: number, sprc: number, level: number): Vector {
			var block = this.region.getBlock(x, y, z);
			if (block.id == BlockID.miningPipe || this.isEmptyBlock(block)) {
				var dx = this.data.x - x;
				var dz = this.data.z - z;
				if (Math.abs(dx) == Math.abs(dz)) {
					var prc = sprc;
				} else if (Math.abs(dx) > Math.abs(dz)) {
					var prc = 0;
				} else {
					var prc = 1;
				}
				if (prc == 0) {
					if (dx > 0) x++;
					else x--;
				} else {
					if (dz > 0) z++;
					else z--;
				}
				return this.findPath(x, y, z, sprc, level);
			} else if (this.canBeDestroyed(block.id, level)) {
				return new Vector3(x, y, z);
			}
			this.data.x++;
			return null;
		}
		
		mineBlock(x: number, y: number, z: number, block: Tile, level: number) {
			let drop = ToolLib.getBlockDrop(new Vector3(x, y, z), block.id, block.data, level);
			let items = [];
			for (let i in drop) {
				items.push({id: drop[i][0], count: drop[i][1], data: drop[i][2]});
			}
			let container = this.region.getContainer(x, y, z);
			if (container) {
				let slots = StorageInterface.getContainerSlots(container);
				for (let i in slots) {
					let slot = container.getSlot(slots[i]);
					if (slot.id > 0) {
						items.push({id: slot.id, count: slot.count, data: slot.data, extra: slot.extra});
						if (container.slots) {
							slot.id = slot.count = slot.data = 0;
						} else {
							container.setSlot(i, 0, 0, 0);
						}
					}
				}
			}
			if (block.id == 79) {
				this.region.setBlock(x, y, z, 8, 0);
			} else {
				this.region.setBlock(x, y, z, 0, 0);
			}
			this.drop(items);
			this.data.progress = 0;
		}
		
		setPipe(y: number, slot) {
			if (y < this.y)
				this.region.setBlock(this.x, y, this.z, BlockID.miningPipe, 0);
			this.region.setBlock(this.x, y-1, this.z, BlockID.miningPipe, 1);
			slot.count--;
			if (!slot.count) slot.id = 0;
			this.data.progress = 0;
		}
		
		drop(items: ItemInstance[]) {
			let containers = StorageInterface.getNearestContainers(this, 0, true);
			StorageInterface.putItems(items, containers);
			for (let i in items) {
				let item = items[i]
				if (item.count > 0) {
					nativeDropItem(this.x+0.5, this.y+1, this.z+0.5, 2, item.id, item.count, item.data, item.extra);
				}
			}
		}
		
		tick(): void {
			let region = this.region;
			if (this.data.progress == 0) {
				let y = this.y;
				while(region.getBlockId(this.x, y-1, this.z) == BlockID.miningPipe) {
					y--;
				}
				this.data.y = y;
			}
			
			let newActive = false;
			let drillSlot = this.container.getSlot("slotDrill");
			let pipeSlot = this.container.getSlot("slotPipe");
			if (drillSlot.id == ItemID.drill || drillSlot.id == ItemID.diamondDrill) {
				if (this.data.y < this.y && this.data.scanY != this.data.y) {
					let r = 0;
					let scanner = this.container.getSlot("slotScanner");
					let energyStored = ChargeItemRegistry.getEnergyStored(scanner);
					if (scanner.id == ItemID.scanner && energyStored >= 50) {
						ChargeItemRegistry.setEnergyStored(scanner, energyStored - 50);
						r = scan_radius;
					} else if (scanner.id == ItemID.scannerAdvanced && energyStored >= 250) {
						ChargeItemRegistry.setEnergyStored(scanner, energyStored - 250);
						r = adv_scan_radius;
					}
					this.data.x = this.x - r;
					this.data.z = this.z - r;
					this.data.scanY = this.data.y;
					this.data.scanR = r;
				}
				let level = ToolAPI.getToolLevel(drillSlot.id);
				if (this.data.y < this.y && this.findOre(level)) {
					let dx = this.data.x - this.x;
					let dz = this.data.z - this.z;
					let prc = 0;
					if (Math.abs(dx) > Math.abs(dz)) {
						prc = 1;
					}
					let coords = this.findPath(this.x, this.data.y, this.z, prc, level);
					if (coords) {
						let block = region.getBlock(coords.x, coords.y, coords.z);
						let params = this.getMiningValues(drillSlot);
						if (this.data.energy >= params.energy) {
							this.data.energy -= params.energy;
							this.data.progress++;
							newActive = true;
						}
						if (this.data.progress >= params.time) {
							level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
							this.mineBlock(coords.x, coords.y, coords.z, block, level);
						}
					}
				}
				else if (this.data.y > 0 && pipeSlot.id == BlockID.miningPipe) {
					let block = region.getBlock(this.x, this.data.y-1, this.z);
					if (this.isEmptyBlock(block)) {
						if (this.data.energy >= 3) {
							this.data.energy -= 3;
							this.data.progress++;
							newActive = true;
						}
						if (this.data.progress >= 20) {
							this.setPipe(this.data.y, pipeSlot);
						}
					}
					else if (this.canBeDestroyed(block.id, level)) {
						let block = region.getBlock(this.x, this.data.y-1, this.z);
						let params = this.getMiningValues(drillSlot);
						if (this.data.energy >= params.energy) {
							this.data.energy -= params.energy;
							this.data.progress++;
							newActive = true;
						}
						if (this.data.progress >= params.time) {
							level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
							this.mineBlock(this.x, this.data.y-1, this.z, block, level);
							this.setPipe(this.data.y, pipeSlot);
						}
					}
				}
			}
			else {
				if (region.getBlockId(this.x, this.data.y, this.z) == BlockID.miningPipe) {
					if (this.data.energy >= 3) {
						this.data.energy -= 3;
						this.data.progress++;
						newActive = true;
					}
					if (this.data.progress >= 20) {
						this.drop([{id: BlockID.miningPipe, count: 1, data: 0}]);
						let pipeSlot = this.container.getSlot("slotPipe");
						if (pipeSlot.id != 0 && pipeSlot.id != BlockID.miningPipe && ToolLib.isBlock(pipeSlot.id) && !TileEntity.isTileEntityBlock(pipeSlot.id)) {
							let blockId = Block.convertItemToBlockId(pipeSlot.id);
							region.setBlock(this.x, this.data.y, this.z, blockId, pipeSlot.data);
							pipeSlot.count--;
							if (pipeSlot.count == 0) pipeSlot.id = 0;
						}
						else {
							region.setBlock(this.x, this.data.y, this.z, 0, 0);
						}
						this.data.scanY = 0;
						this.data.progress = 0;
					}
				}
			}
			if (newActive) {
				//this.startPlaySound();
			} else {
				//this.stopPlaySound();
			}
			this.setActive(newActive);

			let energyStorage = this.getEnergyStorage();
			this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot("slotDrill"), "Eu", this.data.energy, 2);
			this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot("slotScanner"), "Eu", this.data.energy, 2);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, 2);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.sendChanges();
		}

		getOperationSound(): string {
			return "MinerOp.ogg";
		}

		getEnergyStorage(): number {
			return 10000;
		}
	}

	MachineRegistry.registerElectricMachine(BlockID.miner, new Miner());
}