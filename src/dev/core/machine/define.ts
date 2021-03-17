/// <reference path="../../machine/MachineBase.ts" />
/// <reference path="../../machine/ElectricMachine.ts" />
/// <reference path="../../machine/Generator.ts" />

namespace MachineRegistry {
	let machineIDs = {}

	export function isMachine(id: number) {
		return machineIDs[id];
	}

	// register IC2 Machine
	export function registerPrototype(id: number, Prototype: TileEntity.TileEntityPrototype) {
		// register ID
		machineIDs[id] = true;

		TileEntity.registerPrototype(id, Prototype);

		// setup drop
		const BasePrototype = Machine.MachineBase.prototype;
		Prototype.getDefaultDrop = Prototype.getDefaultDrop || BasePrototype.getDefaultDrop;
		Prototype.adjustDrop = Prototype.adjustDrop || BasePrototype.adjustDrop;
		setMachineDrop(id, Prototype.defaultDrop);

		if (Prototype instanceof Machine.ElectricMachine) {
			// wire connection
			ICRender.getGroup("ic-wire").add(id, -1);
			// register for energy net
			EnergyTileRegistry.addEnergyTypeForId(id, EU);
		}
	}

	// for reverse compatibility
	export function registerElectricMachine(id: number, Prototype: TileEntity.TileEntityPrototype) {
		// wire connection
		ICRender.getGroup("ic-wire").add(id, -1);
		// setup energy values
		if (Prototype.defaultValues) {
			Prototype.defaultValues.energy = 0;
		}
		else {
			Prototype.defaultValues = {
				energy: 0
			};
		}

		const BasePrototype = Machine.ElectricMachine.prototype;
		Prototype.isEnergyTile = true;
		Prototype.getTier = Prototype.getTier || BasePrototype.getTier;
		Prototype.getMaxPacketSize = Prototype.getMaxPacketSize || BasePrototype.getMaxPacketSize;
		Prototype.getExplosionPower = Prototype.getExplosionPower || BasePrototype.getExplosionPower;
		Prototype.energyReceive = Prototype.energyReceive || BasePrototype.energyReceive;

		this.registerPrototype(id, Prototype);
		// register for energy net
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	}

	export function registerGenerator(id: number, Prototype: TileEntity.TileEntityPrototype) {
		const BasePrototype = Machine.Generator.prototype;
		Prototype.energyTick = Prototype.energyTick || BasePrototype.energyTick;
		Prototype.canReceiveEnergy = Prototype.canReceiveEnergy || BasePrototype.canReceiveEnergy;
		Prototype.canExtractEnergy = Prototype.canExtractEnergy || BasePrototype.canExtractEnergy;
		this.registerElectricMachine(id, Prototype);
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

	export function getMachineDrop(blockID: number, level: number): ItemInstanceArray[] {
		let drop = [];
		if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
			let dropID = TileEntity.getPrototype(blockID).getDefaultDrop();
			drop.push([dropID, 1, 0]);
		}
		return drop;
	}

	export function setMachineDrop(blockID: string | number, dropID?: number) {
		dropID ??= Block.getNumericId(blockID);
		Block.registerDropFunction(blockID, function(coords, blockID, blockData, level) {
			let drop = [];
			if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
				drop.push([dropID, 1, 0]);
			}
			return drop;
		});
		// drop on explosion
		Block.registerPopResourcesFunction(blockID, function(coords, block, region) {
			if (Math.random() < 0.25) {
				region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, dropID, 1, 0);
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