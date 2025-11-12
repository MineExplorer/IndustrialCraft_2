BlockRegistry.createBlock("miner", [
	{name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true}
], "machine");

TileRenderer.setStandardModelWithRotation(BlockID.miner, 2, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.miner, 2, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 1], ["miner_side", 1], ["miner_side", 1]]);
TileRenderer.setRotationFunction(BlockID.miner);

ItemName.addTierTooltip(BlockID.miner, 2);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.miner, count: 1, data: 0}, [
		"x#x",
		" b ",
		" b "
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', BlockID.miningPipe, 0]);
});

const guiMiner = MachineRegistry.createInventoryWindow("Miner", {
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
	export class Miner extends ElectricMachine {
		defaultValues = {
			energy: 0,
			x: 0,
			y: 0,
			z: 0,
			scanY: 0,
			scanR: 0,
			progress: 0
		}

		defaultDrop = BlockID.machineBlockBasic;

		getScreenByName(): UI.IWindow {
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
				return ItemRegistry.isBlock(id) && !TileEntity.isTileEntityBlock(id);
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotScanner", (name, id) => {
				return id == ItemID.scanner || id == ItemID.scannerAdvanced;
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => {
				return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
			});
		}

		getMiningValues(toolId: number) {
			if (toolId == ItemID.drill) return {energy: 6, time: 100};
			if (toolId == ItemID.diamondDrill) return {energy: 20, time: 50};
			return null;
		}

		findOre(level: number): boolean {
			const r = this.data.scanR;
			while (r) {
				if (this.data.x > this.x + r) {
					this.data.x = this.x - r;
					this.data.z++;
				}
				if (this.data.z > this.z + r) break;
				const blockID = this.region.getBlockId(this.data.x, this.data.scanY, this.data.z);
				if (ore_blocks.indexOf(blockID) != -1 && level >= ToolAPI.getBlockDestroyLevel(blockID)) {
					return true;
				}
				this.data.x++;
			}
			return false;
		}

		isEmptyBlock(block: Tile): boolean {
			return block.id == 0 || block.id == 51 || block.id == 8 || block.id == 9;
		}

		canBeDestroyed(blockID: number, level: number): boolean {
			if (ToolAPI.getBlockMaterialName(blockID) != "unbreaking" && level >= ToolAPI.getBlockDestroyLevel(blockID)) {
				return true;
			}
			return false;
		}

		findPath(x: number, y: number, z: number, sprc: number, level: number): Vector {
			const block = this.region.getBlock(x, y, z);
			if (block.id == BlockID.miningPipe || this.isEmptyBlock(block)) {
				const dx = this.data.x - x;
				const dz = this.data.z - z;
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

		mineBlock(x: number, y: number, z: number, block: Tile, item: ItemContainerSlot): void {
			const result = this.region.breakBlockForResult(x, y, z, -1, new ItemStack(item));
			this.drop(result.items);
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
			const containers = StorageInterface.getNearestContainers(this, this.blockSource);
			StorageInterface.putItems(items, containers);
			for (let item of items) {
				if (item.count > 0) {
					this.region.dropItem(this.x + .5, this.y + 1, this.z + .5, item);
				}
			}
		}

		onTick(): void {
			const region = this.region;
			if (this.data.progress == 0) {
				let y = this.y;
				while (region.getBlockId(this.x, y - 1, this.z) == BlockID.miningPipe) {
					y--;
				}
				this.data.y = y;
			}

			let newActive = false;
			const drillSlot = this.container.getSlot("slotDrill");
			const pipeSlot = this.container.getSlot("slotPipe");
			const params = this.getMiningValues(drillSlot.id);
			if (params) {
				if (this.data.y < this.y && this.data.scanY != this.data.y) {
					let radius = 0;
					const scannerSlot = this.container.getSlot("slotScanner");
					const energyStored = ChargeItemRegistry.getEnergyStored(scannerSlot);
					if (scannerSlot.id == ItemID.scanner || scannerSlot.id == ItemID.scannerAdvanced) {
						const tool = ItemRegistry.getInstanceOf(scannerSlot.id) as ItemScanner;
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
					const dx = this.data.x - this.x;
					const dz = this.data.z - this.z;
					let prc = 0;
					if (Math.abs(dx) > Math.abs(dz)) {
						prc = 1;
					}
					const coords = this.findPath(this.x, this.data.y, this.z, prc, level);
					if (coords) {
						const block = region.getBlock(coords.x, coords.y, coords.z);
						if (this.data.energy >= params.energy) {
							this.data.energy -= params.energy;
							this.data.progress++;
							newActive = true;
						}
						if (this.data.progress >= params.time) {
							level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
							this.mineBlock(coords.x, coords.y, coords.z, block, drillSlot);
						}
					}
				}
				else if (this.data.y > 0 && pipeSlot.id == BlockID.miningPipe) {
					const block = region.getBlock(this.x, this.data.y - 1, this.z);
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
						const block = region.getBlock(this.x, this.data.y - 1, this.z);
						if (this.data.energy >= params.energy) {
							this.data.energy -= params.energy;
							this.data.progress++;
							newActive = true;
						}
						if (this.data.progress >= params.time) {
							level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
							this.mineBlock(this.x, this.data.y - 1, this.z, block, drillSlot);
							this.setPipe(this.data.y);
						}
					}
					else {
						this.data.progress = 0;
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
						const pipeSlot = this.container.getSlot("slotPipe");
						if (pipeSlot.id != 0 && pipeSlot.id != BlockID.miningPipe && ItemRegistry.isBlock(pipeSlot.id) && !TileEntity.isTileEntityBlock(pipeSlot.id)) {
							const blockId = Block.convertItemToBlockId(pipeSlot.id);
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

			this.chargeSlot("slotDrill");
			this.chargeSlot("slotScanner");
			this.dischargeSlot("slotEnergy");
			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		getOperationSound(): string {
			return "MinerOp.ogg";
		}

		getEnergyStorage(): number {
			return 10000;
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
	}

	MachineRegistry.registerPrototype(BlockID.miner, new Miner());
}