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
		setMachineDrop(id, Prototype.defaultDrop);

		// setup functions
		if (!(Prototype instanceof Machine.MachineBase)) {
			const BasePrototype = Machine.MachineBase.prototype;
			Prototype.getDefaultDrop ??= BasePrototype.getDefaultDrop;
			Prototype.adjustDrop ??= BasePrototype.adjustDrop;
			Prototype.activate ??= function() {
				if (!this.data.isActive) {
					this.data.isActive = true;
					TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + 4);
				}
			}
			Prototype.deactivate ??= function() {
				if (this.data.isActive) {
					this.data.isActive = false;
					TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
				}
			}
		}

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
		Prototype.getTier ??= BasePrototype.getTier;
		Prototype.getMaxPacketSize ??= BasePrototype.getMaxPacketSize;
		Prototype.getExplosionPower ??= BasePrototype.getExplosionPower;
		Prototype.energyReceive ??= BasePrototype.energyReceive;

		this.registerPrototype(id, Prototype);
		// register for energy net
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	}

	export function registerGenerator(id: number, Prototype: TileEntity.TileEntityPrototype) {
		const BasePrototype = Machine.Generator.prototype;
		Prototype.energyTick ??= BasePrototype.energyTick;
		Prototype.canReceiveEnergy ??= BasePrototype.canReceiveEnergy;
		Prototype.canExtractEnergy ??= BasePrototype.canExtractEnergy;
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

	export function getLiquidFromItem(tank: BlockEngine.LiquidTank, inputItem: ItemInstance, outputItem: ItemInstance): boolean {
		let liquid = tank.getLiquidStored();
		let empty = LiquidItemRegistry.getEmptyItem(inputItem.id, inputItem.data);
		if (empty && (!liquid && tank.isValidLiquid(empty.liquid) || empty.liquid == liquid) && !tank.isFull() &&
			(outputItem.id == empty.id && outputItem.data == empty.data && outputItem.count < Item.getMaxStack(empty.id) || outputItem.id == 0)) {
			let liquidLimit = tank.getLimit();
			let storedAmount = tank.getAmount(liquid);
			let count = Math.min(inputItem.count, Math.floor((liquidLimit - storedAmount) / empty.amount));
			if (count > 0) {
				tank.addLiquid(empty.liquid, empty.amount * count);
				outputItem.id = empty.id;
				outputItem.count += count;
				outputItem.data = empty.data;
				inputItem.count -= count;
				if (inputItem.count == 0) inputItem.id = inputItem.data = 0;
			}
			else if (inputItem.count == 1 && empty.storage) {
				let amount = Math.min(liquidLimit - storedAmount, empty.amount);
				tank.addLiquid(empty.liquid, amount);
				inputItem.data += amount;
			}
			return true;
		}
		return false;
	}

	export function fillTankOnClick(liquidTank: BlockEngine.LiquidTank, item: ItemInstance, playerUid: number): boolean {
		let outputItem = new ItemStack();
		if (getLiquidFromItem(liquidTank, item, outputItem)) {
			let player = new PlayerEntity(playerUid);
			if (outputItem.id) {
				player.addItemToInventory(outputItem);
			}
			player.setCarriedItem(item);
			return true;
		}
		return false;
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