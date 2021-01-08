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
		"slotEnergy": {type: "slot", x: 541, y: 212},
	}
});

namespace Machine {
	export class Miner
	extends ElectricMachine {
		defaultValues = {
			energy: 0,
			x: 0,
			y: 0,
			z: 0,
			scanY: 0,
			scanR: 0,
			progress: 0
		}

		getScreenByName() {
			return guiMiner;
		}

		getTier(): number {
			return 2;
		}

		setupContainer(): void {
			StorageInterface.setSlotValidatePolicy(this.container, "slotDrill", (name, id) => {
				return id == ItemID.drill || id == ItemID.diamondDrill;
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotPipe", (name, id) => {
				return ToolLib.isBlock(id) && !TileEntity.isTileEntityBlock(id);
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotScanner", (name, id) => {
				return id == ItemID.scanner || id == ItemID.scannerAdvanced;
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => {
				return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
			});
		}

		getMiningValues(tool: number) {
			if (tool == ItemID.drill) return {energy: 6, time: 100};
			if (tool == ItemID.diamondDrill) return {energy: 20, time: 50};
			return null;
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

		mineBlock(x: number, y: number, z: number, block: Tile, level: number): void {
			let drop = ToolLib.getBlockDrop(new Vector3(x, y, z), block.id, block.data, level);
			let items: ItemInstance[] = [];
			for (let i in drop) {
				items.push(new ItemStack(drop[i][0], drop[i][1], drop[i][2], drop[i][3]));
			}
			let container = this.region.getContainer(x, y, z);
			if (container) {
				let slots = StorageInterface.getContainerSlots(container) as any[];
				for (let i in slots) {
					let slot = container.getSlot(slots[i]);
					if (slot.id > 0) {
						items.push(new ItemStack(slot));
						container.setSlot(slots[i], 0, 0, 0);
					}
				}
			}
			this.region.setBlock(x, y, z, (block.id == 79)? 8 : 0, 0);
			this.drop(items);
			this.data.progress = 0;
		}

		setPipe(y: number): void {
			if (y < this.y)
				this.region.setBlock(this.x, y, this.z, BlockID.miningPipe, 0);
			this.region.setBlock(this.x, y - 1, this.z, BlockID.miningPipe, 1);
			this.decreaseSlot(this.container.getSlot("slotPipe"), 1);
			this.data.progress = 0;
		}

		drop(items: ItemInstance[]): void {
			let containers = StorageInterface.getNearestContainers(this, this.blockSource);
			StorageInterface.putItems(items, containers);
			for (let i in items) {
				let item = items[i]
				if (item.count > 0) {
					this.region.dropItem(this.x + .5, this.y + 1, this.z + .5, item.id, item.count, item.data, item.extra);
				}
			}
		}

		tick(): void {
			let region = this.region;
			if (this.data.progress == 0) {
				let y = this.y;
				while(region.getBlockId(this.x, y - 1, this.z) == BlockID.miningPipe) {
					y--;
				}
				this.data.y = y;
			}

			let newActive = false;
			let drillSlot = this.container.getSlot("slotDrill");
			let pipeSlot = this.container.getSlot("slotPipe");
			let params = this.getMiningValues(drillSlot.id);
			if (params) {
				if (this.data.y < this.y && this.data.scanY != this.data.y) {
					let radius = 0;
					let scannerSlot = this.container.getSlot("slotScanner");
					let energyStored = ChargeItemRegistry.getEnergyStored(scannerSlot);
					if (scannerSlot.id == ItemID.scanner || scannerSlot.id == ItemID.scannerAdvanced) {
						let tool = ItemRegistry.getInstanceOf(scannerSlot.id) as ItemScanner;
						ChargeItemRegistry.setEnergyStored(scannerSlot, energyStored - tool.getEnergyPerUse());
						radius = tool.getScanRadius();
					}
					this.data.x = this.x - radius;
					this.data.z = this.z - radius;
					this.data.scanY = this.data.y;
					this.data.scanR = radius;
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
							this.setPipe(this.data.y);
						}
					}
					else if (this.canBeDestroyed(block.id, level)) {
						let block = region.getBlock(this.x, this.data.y-1, this.z);
						if (this.data.energy >= params.energy) {
							this.data.energy -= params.energy;
							this.data.progress++;
							newActive = true;
						}
						if (this.data.progress >= params.time) {
							level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
							this.mineBlock(this.x, this.data.y-1, this.z, block, level);
							this.setPipe(this.data.y);
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
						this.drop([new ItemStack(BlockID.miningPipe, 1, 0)]);
						let pipeSlot = this.container.getSlot("slotPipe");
						if (pipeSlot.id != 0 && pipeSlot.id != BlockID.miningPipe && ToolLib.isBlock(pipeSlot.id) && !TileEntity.isTileEntityBlock(pipeSlot.id)) {
							let blockId = Block.convertItemToBlockId(pipeSlot.id);
							region.setBlock(this.x, this.data.y, this.z, blockId, pipeSlot.data);
							this.decreaseSlot(pipeSlot, 1);
						}
						else {
							region.setBlock(this.x, this.data.y, this.z, 0, 0);
						}
						this.data.scanY = 0;
						this.data.progress = 0;
					}
				}
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

	MachineRegistry.registerPrototype(BlockID.miner, new Miner());
}