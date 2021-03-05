/// <reference path="../../machine/MachineBase.ts" />
/// <reference path="../../machine/ElectricMachine.ts" />
/// <reference path="../../machine/Generator.ts" />

namespace MachineRegistry {
	let machineIDs = {}

	export function isMachine(id: number) {
		return machineIDs[id];
	}

	// register IC2 Machine
	export function registerPrototype(id: number, Prototype: any) {
		// register ID
		machineIDs[id] = true;

		TileEntity.registerPrototype(id, Prototype);

		if (Prototype instanceof Machine.MachineBase) {
			Block.registerDropFunction(id, () => []);
		}

		if (Prototype instanceof Machine.ElectricMachine) {
			// wire connection
			ICRender.getGroup("ic-wire").add(id, -1);
			// register for energy net
			EnergyTileRegistry.addEnergyTypeForId(id, EU);
		}
	}

	// for reverse compatibility
	export function registerElectricMachine(id: number, Prototype: any) {
		// wire connection
		ICRender.getGroup("ic-wire").add(id, -1);
		// setup energy values
		if (Prototype.defaultValues) {
			Prototype.defaultValues.energy = 0;
			Prototype.defaultValues.energy_receive = 0;
			Prototype.defaultValues.last_energy_receive = 0;
			Prototype.defaultValues.voltage = 0;
			Prototype.defaultValues.last_voltage = 0;
		}
		else {
			Prototype.defaultValues = {
				energy: 0,
				energy_receive: 0,
				last_energy_receive: 0,
				voltage: 0,
				last_voltage: 0
			};
		}

		for (let key in Machine.ElectricMachine.prototype) {
			if (!Prototype[key]) {
				Prototype[key] = Machine.ElectricMachine.prototype[key];
			}
		}

		this.registerPrototype(id, Prototype);
		// register for energy net
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	}

	export function registerGenerator(id: number, Prototype: any) {
		for (let key in Machine.Generator.prototype) {
			if (!Prototype[key]) {
				Prototype[key] = Machine.Generator.prototype[key];
			}
		}

		this.registerPrototype(id, Prototype);
	}

	// standard functions
	export function setStoragePlaceFunction(blockID: string | number, hasVerticalRotation?: boolean) {
		Block.registerPlaceFunction(Block.getNumericId(blockID), function(coords, item, block, player, region) {
			let place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
			let rotation = TileRenderer.getBlockRotation(player, hasVerticalRotation);
			region.setBlock(place.x, place.y, place.z, item.id, rotation);
			// World.playSound(place.x, place.y, place.z, "dig.stone", 1, 0.8)
			let tile = World.addTileEntity(place.x, place.y, place.z, region);
			if (item.extra) {
				tile.data.energy = item.extra.getInt("energy");
			}
		});
	}

	export function getMachineDrop(coords: Vector, blockID: number, level: number, item: ItemInstance, region: BlockSource, basicDrop?: number, saveEnergyAmount?: number): ItemInstanceArray[] {
		let dropID = 0;
		if (ICTool.isValidWrench(item, 10)) {
			ChargeItemRegistry.getEnergyFrom(item, "Eu", 10, 4, true);
			region.setBlock(coords.x, coords.y, coords.z, 0, 0);
			let chance = ICTool.getWrenchData(item.id).chance;
			if (Math.random() < chance) {
				dropID = blockID;
			} else {
				dropID = basicDrop || blockID;
			}
		}
		else if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
			dropID = basicDrop || blockID;
		}
		if (dropID == blockID && saveEnergyAmount) {
			let extra = new ItemExtraData();
			extra.putInt("energy", saveEnergyAmount);
			return [[dropID, 1, 0, extra]];
		}
		if (dropID) return [[dropID, 1, 0]];
		return [];
	}

	export function setMachineDrop(stringID: string, basicDrop?: number) {
		Block.registerDropFunction(stringID, function(coords, blockID, blockData, level, enchant, item, region) {
			return MachineRegistry.getMachineDrop(coords, blockID, level, item, region, basicDrop);
		});
		Block.registerPopResourcesFunction(stringID, function(coords, block, region) { // drop on explosion
			if (Math.random() < 0.25) {
				region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, basicDrop || block.id, 1, 0);
			}
		});
	}

	export function getLiquidFromItem(liquid: string, inputItem: ItemContainerSlot | ItemInstance, outputItem: ItemContainerSlot | ItemInstance, byHand?: boolean): boolean {
		let storage = StorageInterface.getInterface(this);
		let empty = LiquidLib.getEmptyItem(inputItem.id, inputItem.data);
		if (empty && (!liquid && storage.canReceiveLiquid(empty.liquid) || empty.liquid == liquid) && !this.liquidStorage.isFull(empty.liquid) &&
			(outputItem.id == empty.id && outputItem.data == empty.data && outputItem.count < Item.getMaxStack(empty.id) || outputItem.id == 0)) {
			let liquidLimit = this.liquidStorage.getLimit(empty.liquid);
			let storedAmount = this.liquidStorage.getAmount(liquid).toFixed(3);
			let count = Math.min(byHand? inputItem.count : 1, Math.floor((liquidLimit - storedAmount) / empty.amount));
			if (count > 0) {
				this.liquidStorage.addLiquid(empty.liquid, empty.amount * count);
				inputItem.count -= count;
				outputItem.id = empty.id;
				outputItem.count += count;
				outputItem.data = empty.data;
				if (inputItem.count == 0) inputItem.id = inputItem.data = 0;
			}
			else if (inputItem.count == 1 && empty.storage) {
				let amount = Math.min(liquidLimit - storedAmount, empty.amount);
				this.liquidStorage.addLiquid(empty.liquid, amount);
				inputItem.data += amount * 1000;
			}
			if (byHand) {
				if (outputItem.id) {
					Player.addItemToInventory(outputItem.id, outputItem.count, outputItem.data);
				}
				Player.setCarriedItem(inputItem.id, inputItem.count, inputItem.data);
			} else {
				(inputItem as ItemContainerSlot).markDirty();
				(outputItem as ItemContainerSlot).markDirty();
			}
			return true;
		}
		return false;
	}

	export function addLiquidToItem(liquid: string, inputItem: ItemContainerSlot, outputItem: ItemContainerSlot): void {
		let amount = this.liquidStorage.getAmount(liquid).toFixed(3);
		if (amount > 0) {
			let full = LiquidLib.getFullItem(inputItem.id, inputItem.data, liquid);
			if (full && (outputItem.id == full.id && outputItem.data == full.data && outputItem.count < Item.getMaxStack(full.id) || outputItem.id == 0)) {
				if (amount >= full.amount) {
					this.liquidStorage.getLiquid(liquid, full.amount);
					inputItem.setSlot(inputItem.id, inputItem.count - 1, inputItem.data);
					inputItem.validate();
					outputItem.setSlot(full.id, outputItem.count + 1, full.data);
				}
				else if (inputItem.count == 1 && full.storage) {
					if (inputItem.id == full.id) {
						amount = this.liquidStorage.getLiquid(liquid, full.amount);
						inputItem.setSlot(inputItem.id, 1, inputItem.data - amount * 1000);
					} else {
						amount = this.liquidStorage.getLiquid(liquid, full.storage);
						inputItem.setSlot(full.id, 1, (full.storage - amount)*1000);
					}
				}
			}
		}
	}

	/** @deprecated */
	export function isValidEUItem(id: number, count: number, data: number, container: UI.Container): boolean {
		let level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidItem(id, "Eu", level);
	}

	/** @deprecated */
	export function isValidEUStorage(id: number, count: number, data: number, container: UI.Container): boolean {
		let level = container.tileEntity.getTier();
		return ChargeItemRegistry.isValidStorage(id, "Eu", level);
	}

	export function updateGuiHeader(gui: any, text: string): void {
		let header = gui.getWindow("header");
		header.contentProvider.drawing[2].text = Translation.translate(text);
	}
}

const transferByTier = {
	1: 32,
	2: 256,
	3: 2048,
	4: 8192
}